import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Spinner } from "react-bootstrap";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import APIClient from "../../../API/APIClient";
import apis from "../../../API/API.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditCourse = () => {
  const { id } = useParams(); // Get course ID from route parameters
  const [name, setCourseName] = useState("");
  const [coursedetails, setCourseDescription] = useState("");
  const [deptid, setDepartmentId] = useState("");
  const [imgsrc, setFile] = useState(null);
  const [existingImgSrc, setExistingImgSrc] = useState(null); // State to hold existing image URL
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const response = await APIClient.get(`${apis.getCourses}/${id}`);
        if (response.status === 200) {
          const course = response.data;
          setCourseName(course.name);
          setCourseDescription(course.coursedetails);
          setDepartmentId(course.deptid);
          setExistingImgSrc(course.imgsrc); // Set existing image URL
        } else {
          toast.error("Failed to fetch course details");
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        toast.error('Failed to load course data');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // Fetch all departments for the dropdown
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

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setConfirmDialogOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setLoading(true);
    setConfirmDialogOpen(false);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("coursedetails", coursedetails);
    formData.append("deptid", deptid);
    if (imgsrc instanceof File) {
      formData.append("imgsrc", imgsrc);
    }

    try {
      const response = await APIClient.post(`${apis.editCourse}/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        toast.success("Course updated successfully");
        setSuccessDialogOpen(true);
        // Reset form fields
        setCourseName("");
        setCourseDescription("");
        setDepartmentId("");
        setFile(null);
        setExistingImgSrc(null);
      } else {
        toast.error("Failed to update course");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="formdata">
        <main id="main" className="main">
          <div className="pagetitle"></div>
          <div className="home">
            <div className="homeContainer">
              <Container>
                <Row className="vh-100 d-flex justify-content-center align-items-left">
                  <Col md={10} lg={12} xs={12}>
                  <div className="pagetitle-lft">
                    <nav>
                      <ol className="breadcrumb">
                        <li className="breadcrumb-item">Home</li>
                        <li className="breadcrumb-item">Course</li>
                        <li className="breadcrumb-item active">Edit Course</li>
                      </ol>
                    </nav>
                  </div>
                    <Card>
                      <Card.Body>
                        <h2 className="fw-bold mb-4 text-center text-uppercase">Edit Course</h2>                        
                        {/* Show Spinner while loading */}
                        {loading ? (
                          <Spinner animation="border" />
                        ) : (
                          <Form onSubmit={handleFormSubmit}>
                            <Form.Group controlId="formCourseName">
                              <Form.Label>Course Name</Form.Label>
                              <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setCourseName(e.target.value)}
                                isInvalid={!!formErrors.name}
                              />
                              <Form.Control.Feedback type="invalid">
                                {formErrors.name}
                              </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="formCourseDescription">
                              <Form.Label>Course Description</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={3}
                                value={coursedetails}
                                onChange={(e) => setCourseDescription(e.target.value)}
                                isInvalid={!!formErrors.coursedetails}
                              />
                              <Form.Control.Feedback type="invalid">
                                {formErrors.coursedetails}
                              </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="formDepartment">
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

                            <Form.Group className="mb-3" controlId="imgsrc">
                              <Form.Label>Upload Course File</Form.Label>
                              <Form.Control
                                type="file"
                                name="imgsrc"
                                onChange={handleFileChange}
                              />
                            </Form.Group>

                            {/* Display existing uploaded file */}
                            {existingImgSrc && (
                              <div className="mb-3">
                                <Form.Label>Existing Uploaded File</Form.Label>
                                <div>
                                  <img src={existingImgSrc} alt="Uploaded File" style={{ maxWidth: "100%", height: "auto" }} />
                                </div>
                              </div>
                            )}

                            <div className="d-flex justify-content-between">
                            <Link to="/Course/AllCourse">
                              <button type="button" className="btn btn-outline-secondary">Back</button>
                            </Link>
                              <Button variant="primary" type="submit">Submit</Button>
                            </div>
                          </Form>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Container>
            </div>
          </div>
        </main>
      </div>

      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Update</DialogTitle>
        <DialogContent>Are you sure you want to update this course?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">Cancel</Button>
          <Button onClick={handleConfirmSubmit} color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={successDialogOpen} onClose={() => setSuccessDialogOpen(false)}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>Course updated successfully!</DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccessDialogOpen(false)} color="primary">OK</Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </>
  );
};

export default EditCourse;