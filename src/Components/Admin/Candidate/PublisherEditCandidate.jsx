import React, { useState, useEffect } from "react";
import { Button, Card, Col, Container, Form, Row, Spinner, Table } from "react-bootstrap";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import APIClient from "../../../API/APIClient";
import apis from "../../../API/API.json";
import "react-toastify/dist/ReactToastify.css";

const PublisherEditCandidate = () => {
  const { id } = useParams(); // Candidate ID from route parameters
  const storedUserString = localStorage.getItem("usertype");
  const usertype = JSON.parse(storedUserString);

  // Candidate personal info state
  const [candidateInfo, setCandidateInfo] = useState({
    name: "",
    mobileno: "",
    email: "",
    aadharno: "",
    usertype: ''
  });

  // Candidate course selections (array)
  const [candidateCourses, setCandidateCourses] = useState([]);

  // Current course selection inputs
  const [courseSelection, setCourseSelection] = useState({
    deptid: "",
    dname: "",
    courseid: "",
    coursename: "",
    isview: false,
    isdownload: false
  });

  // Options fetched from API for dropdowns
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courses1, setCourses1] = useState([]);

  // Dialog and loading states
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation errors state
  const [formErrors, setFormErrors] = useState({});

  // Fetch candidate data by ID on mount
  useEffect(() => {
    const fetchCandidate = async () => {
      setLoading(true);
      try {
        // Ensure that apis.getCandidatebyId is defined correctly, e.g. "/api/candidate/"
        const response = await APIClient.get(`${apis.getCandidatebyId}${id}`);
        if (response.status === 200) {
          const candidate = response.data;
          setCandidateInfo({
            name: candidate.name || "",
            mobileno: candidate.mobileno || "",
            email: candidate.email || "",
            aadharno: candidate.aadharno || ""
          });
          setCandidateCourses(candidate.lstcand || []);
        } else {
          toast.error("Failed to fetch candidate details");
        }
      } catch (error) {
        console.error("Error fetching candidate:", error);
        toast.error("Error fetching candidate details");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  // Fetch departments and courses on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await APIClient.get(apis.getDepartments);
        setDepartments(response.data || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
         toast.error("Error fetching departments");
      }
    };

    fetchDepartments();
    
  }, []);


// Fetch course and courses on mount
useEffect(() => {
  const fetchcourses = async () => {
    try {
      const response = await APIClient.get(apis.getCourses);
      setCourses1(response.data || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
       toast.error("Error fetching departments");
    }
  };

  fetchcourses();
  
}, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await APIClient.get(apis.getCourses);
        setCourses(response.data || []);
        if (courseSelection.deptid) {
          // Immediately filter courses based on selected department
          const filteredCourses = response.data.filter(course => course.deptid === parseInt(courseSelection.deptid, 10));
          setCourses(filteredCourses);
        }
      } catch (error) {
        toast.error("Error fetching courses");
      }
    };
  
    fetchCourses();
  }, [courseSelection.deptid]);  // Re-run only when deptid changes

  // Handle changes in candidate personal info
  const handleCandidateChange = (e) => {
    const { name, value } = e.target;
    setCandidateInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Handle course selection change (for dropdowns and checkboxes)
  const handleCourseSelectionChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    setCourseSelection((prev) => {
      // Handling Department Selection
      if (name === "deptid") {
        const selectedIndex = e.target.selectedIndex;
        const selectedDeptName = e.target.options[selectedIndex].text;
        return {
          ...prev,
          deptid: value,
          dname: selectedDeptName,
        };
      }
      
      // Handling Course Selection
      if (name === "courseid") {
        const selectedIndex = e.target.selectedIndex;
        const selectedCourseName = e.target.options[selectedIndex].text;
        return {
          ...prev,
          courseid: value,
          coursename: selectedCourseName,
        };
      }
  
      // Handling Checkbox & Other Inputs
      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  // Validate candidate personal info fields
  const validateCandidateInfo = () => {
    const errors = {};
    if (!candidateInfo.name.trim()) errors.name = "Name is required";
    if (!candidateInfo.mobileno.trim()) errors.mobileno = "Mobile number is required";
    if (!candidateInfo.email.trim()) errors.email = "Email is required";
    if (!candidateInfo.aadharno.trim()) errors.aadharno = "Aadhar number is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate current course selection before adding
  const validateCourseSelection = () => {
    const errors = {};
    if (!courseSelection.deptid) errors.deptid = "Please select a department";
    if (!courseSelection.courseid) errors.courseid = "Please select a course";
    return Object.keys(errors).length === 0;
  };

  // Handle Add Course Selection button click
  const handleAddCourse = () => {
    if (!validateCourseSelection()) {
      toast.error("Please fill in required course selection fields.");
      return;
    }
    setCandidateCourses((prev) => [...prev, courseSelection]);
    // Reset course selection state
    setCourseSelection({
      deptid: "",
      dname: "",
      courseid: "",
      coursename: "",
      isview: false,
      isdownload: false
    });
  };

  // Handle deletion of a row from course selections table
  const handleDeleteRow = (index) => {
    setCandidateCourses((prev) => prev.filter((_, i) => i !== index));
    // Open confirmation dialog
    setConfirmDialogOpen(false);
  };

  // Handle form submission: validate candidate info and course selections, then open confirmation dialog
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateCandidateInfo()) {
      toast.error("Please fill in all required candidate info fields.");
      return;
    }
    if (candidateCourses.length === 0) {
      toast.error("Please add at least one course selection.");
      return;
    }
    setConfirmDialogOpen(true);
  };

  // When candidate submission is confirmed, send data to backend
  const handleConfirmSubmit = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);

    // Optionally, convert boolean flags to numbers if your backend requires them
    const formattedCandidateCourses = candidateCourses.map((course) => ({
      ...course,
      isview: course.isview ? 1 : 0,
      isdownload: course.isdownload ? 1 : 0
    }));

    const payload = {
      ...candidateInfo,
      lstcand: formattedCandidateCourses,
      usertype: usertype,
      ...(usertype === 4 && { action: 'publish' })
    };

    try {
      const response = await APIClient.post(apis.editCandidate + id, payload, {
        headers: { "Content-Type": "application/json" }
      });
      if (response.status === 200) {
        toast.success("Candidate updated successfully!");
        setSuccessDialogOpen(true);
        // Optionally, reset the form
        setCandidateInfo({
          name: "",
          mobileno: "",
          email: "",
          aadharno: ""
        });
        setCandidateCourses([]);
      } else {
        toast.error("Failed to update candidate");
      }
    } catch (error) {
      console.error("Error updating candidate:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="formdata">
      <Container className="my-4">
      <div className="pagetitle-lft">
                    <nav>
                      <ol className="breadcrumb">
                        <li className="breadcrumb-item">Home</li>
                        <li className="breadcrumb-item">Candidate</li>
                        <li className="breadcrumb-item active">Publisher Edit Candidate</li>
                      </ol>
                    </nav>
                  </div>
        <Card>
          <Card.Body>
            <h2 className="text-center text-uppercase mb-4">Publisher Edit Candidate</h2>
            <Form onSubmit={handleSubmit}>
              {/* Candidate Personal Info */}
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="candidateName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter name"
                      name="name"
                      value={candidateInfo.name}
                      onChange={handleCandidateChange}
                      isInvalid={!!formErrors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="candidateMobile">
                    <Form.Label>Mobile No.</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter mobile number"
                      name="mobileno"
                      value={candidateInfo.mobileno}
                      onChange={handleCandidateChange}
                      isInvalid={!!formErrors.mobileno}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.mobileno}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="candidateEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      name="email"
                      value={candidateInfo.email}
                      onChange={handleCandidateChange}
                      isInvalid={!!formErrors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="candidateAadhar">
                    <Form.Label>Aadhar No.</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Aadhar number"
                      name="aadharno"
                      value={candidateInfo.aadharno}
                      onChange={handleCandidateChange}
                      isInvalid={!!formErrors.aadharno}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.aadharno}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <hr />
              {/* Candidate Course Selection */}
              <h4 className="mb-3">Select Course Details</h4>
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group controlId="deptid">
                    <Form.Label>Department</Form.Label>
                    <Form.Select
                      name="deptid"
                      value={courseSelection.deptid}
                      onChange={handleCourseSelectionChange}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.did} value={dept.did}>
                          {dept.dname}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="courseid">
                    <Form.Label>Course</Form.Label>
                    <Form.Select
                      name="courseid"
                      value={courseSelection.courseid}
                      onChange={handleCourseSelectionChange}
                    >
                      <option value="">Select Course</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group controlId="isview">
                    <Form.Check
                      type="checkbox"
                      label="View"
                      name="isview"
                      checked={courseSelection.isview}
                      onChange={handleCourseSelectionChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group controlId="isdownload">
                    <Form.Check
                      type="checkbox"
                      label="Download"
                      name="isdownload"
                      checked={courseSelection.isdownload}
                      onChange={handleCourseSelectionChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button variant="secondary" onClick={handleAddCourse}>
                Add Course Selection
              </Button>

              {/* Display DataTable for Course Selections */}
              {candidateCourses.length > 0 && (
                <>
                  <h5 className="mt-4">Course Selections</h5>
                  <Table striped bordered hover responsive>
                    <thead>
                      
                         <tr>
                        <th>Sr. No.</th>
                        <th>Department ID</th>
                        <th>Department Name</th>
                        <th>Course ID</th>
                        <th>Course Name</th>
                        <th>View</th>
                        <th>Download</th>
                        <th>Action</th>
                        </tr>
                    </thead>
                <tbody>
                {candidateCourses.map((entry, index) => {
                    debugger;
                // Lookup department and course from fetched arrays
                const dept = departments.find(d => d.did === entry.deptid);
                const course = courses1.find(c => c.id === entry.courseid);
                //const course = courses.find(c => String(c.cid) === String(entry.courseid));

                return (
                    <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{entry.deptid}</td>
                    <td>{entry.dname ? entry.dname : dept ? dept.dname : "N/A"}</td>
                    {/* if(entry.dname == ""){
                    <td>{dept ? dept.dname : "N/A"}</td> 
                    }
                    else{
                    <td>{entry.dname}</td>

                    } */}
                    <td>{entry.courseid}</td>
                    <td>{entry.coursename ? entry.coursename : course ? course.name : "N/A"}</td>
                    {/* if(entry.coursename == ""){
                        <td>{course ? course.name : "N/A"}</td> 
                    }
                    else{
                    
                     <td>{entry.coursename}</td>
                    } */}

                    <td>{entry.isview ? "Yes" : "No"}</td>
                    <td>{entry.isdownload ? "Yes" : "No"}</td>
                    <td>
                        <Button variant="Danger" size="sm" onClick={() => handleDeleteRow(index)}>
                        Delete
                        </Button>
                    </td>
                    </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </>
              )}

              {/* Submit Button for the entire candidate form */}
              <div className="mt-4">
                <Button variant="primary" type="submit" onClick={handleSubmit}>
                  Update Candidate
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Submit</DialogTitle>
        <DialogContent>
          Are you sure you want to submit the candidate details along with course selections?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmSubmit} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onClose={() => setSuccessDialogOpen(false)}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>Candidate updated successfully!</DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccessDialogOpen(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </div>
    </>
  );
};

export default PublisherEditCandidate;
