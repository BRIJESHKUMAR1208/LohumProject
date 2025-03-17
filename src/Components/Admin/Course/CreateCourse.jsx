import React, { useState, useEffect } from "react";
import { Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import APIClient from "../../../API/APIClient";
import apis from "../../../API/API.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Link } from "react-router-dom";

const CreateCourse = () => {
  // State for course name, description, department selection, and file upload
  const [name, setCourseName] = useState("");
  const [coursedetails, setCourseDescription] = useState("");
  const [deptid, setDepartmentId] = useState("");
  const [departments, setDepartments] = useState([]);
  const [imgsrc, setFile] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch all departments for dropdown
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        debugger
        const response = await APIClient.get(apis.getDepartments);
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!name.trim()) errors.name = "Please enter a course name";
    if (!coursedetails.trim()) errors.coursedetails = "Please enter a course description";
    if (!deptid) errors.deptid = "Please select a department";
    if (!imgsrc) errors.imgsrc = "Please upload a file";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setConfirmDialogOpen(true);
  };

  // Corrected file change handler using e.target.files
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleConfirmSubmit = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("coursedetails", coursedetails);
    formData.append("deptid", deptid); // using deptid instead of did
    formData.append("imgsrc", imgsrc);

    try {
      debugger;
      const response = await APIClient.post(apis.createCourse, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        setTimeout(() => {
          setLoading(false);
          setSuccessDialogOpen(true);
          // Reset form values after success
          setCourseName("");
          setCourseDescription("");
          setDepartmentId("");
          setFile(null);
        }, 1000);
      } else {
        toast.error("Something went wrong");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error(error.response?.data || "Error submitting data");
      setLoading(false);
    }
  };

  return (

    <div >
      <div >
        <main id="main" className="main">
        <div className="pagetitle">
        <div className="pagetitle-lft">
        <nav>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">Home</li>
                  <li className="breadcrumb-item  ">Course</li>
                  <li className="breadcrumb-item active ">Create Course</li>
                </ol>
              </nav>
              </div>
              <h2 className="fw-bold mb-4 text-center text-uppercase">Create Course</h2>
              </div>


              <div className="row justify-content-center">
            <div className="d-flex justify-content-left" style={{ marginLeft: "100px" }}>
              <Link to="/dashboard">
                <button type="button" className="btn btn-info">Back</button>
              </Link>
            </div>
            <div className="formdata"> {/* Bootstrap column for full width */}
              <div className="card custom-card">
                <div className="card-body">
              <Form onSubmit={handleSubmit}>
                {/* Course Name */}
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Course Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Course Name"
                    value={name}
                    onChange={(e) => setCourseName(e.target.value)}
                    isInvalid={!!formErrors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.name}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Course Description */}
                <Form.Group className="mb-3" controlId="coursedetails">
                  <Form.Label>Course Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter Course Description"
                    value={coursedetails}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    isInvalid={!!formErrors.coursedetails}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.coursedetails}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Department Dropdown */}
                <Form.Group className="mb-3" controlId="department">
                  <Form.Label>Department</Form.Label>
                  <Form.Select
                    value={deptid}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    isInvalid={!!formErrors.deptid}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.did} value={dept.did}>
                        {dept.dname}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formErrors.deptid}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* File Upload */}
                <Form.Group className="mb-3" controlId="imgsrc">
                  <Form.Label>Upload File</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handleFileChange}
                    isInvalid={!!formErrors.imgsrc}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.imgsrc}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Submit Button */}
                <div className="d-flex justify-content-between">
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </div>

                {/* Loading Spinner */}
                <Dialog open={loading}>
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </Dialog>
              </Form>



              <ToastContainer />

              {/* Confirmation Dialog */}
              <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
                <DialogTitle>Confirm Create</DialogTitle>
                <DialogContent>Are you sure you want to create this course?</DialogContent>
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
                <DialogContent>Course created successfully!</DialogContent>
                <DialogActions>
                  <Button onClick={() => setSuccessDialogOpen(false)} color="primary">
                    OK
                  </Button>
                </DialogActions>
              </Dialog>
              </div>
              </div>
              </div>
          </div>
        </main>
      </div>
      </div>
  );
};

export default CreateCourse;
