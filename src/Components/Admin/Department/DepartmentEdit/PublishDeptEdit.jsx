import React, { useState, useEffect } from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import APIClient from "../../../../API/APIClient";
import apis from "../../../../API/API.json";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PublishDeptEdit = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const storedUserString = localStorage.getItem("usertype");
  const usertype = JSON.parse(storedUserString);

  useEffect(() => {
    let isMounted = true;
    async function fetchDepartment() {
      try {
        const response = await APIClient.get(apis.getDeptbyID + id);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching department:', error);
        toast.error("Failed to fetch department details.");
      }
    }
    fetchDepartment();
    return () => {
        isMounted = false; // Cleanup on unmount
      };
  }, [id]);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.dname.trim()) {
      errors.dname = 'Department name is required';
    } else if (!/^[A-Za-z\s_]+$/.test(formData.dname)) {
      errors.dname = "Only alphabet characters are allowed";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      setConfirmDialogOpen(true);
    }
  };

  const handlePublishConfirm = async () => {
    setConfirmDialogOpen(false);

    try {
      const formDataToSend = {
        dname: formData.dname,
        usertype: usertype,
        action: "publish",
      };
      
      const response = await APIClient.post(apis.EditDept + id, formDataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      console.log(formDataToSend);
      console.log(formData);
      if (response.status === 200) {
        setSuccessDialogOpen(true);
        toast.success("Data successfully published!");
        setFormData({ dname: "" });
      } else {
        toast.error("Failed to publish department.");
      }
    } catch (error) {
      console.error('Error publishing department:', error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="formdata">
      <main id="main" className="main">
        <Container fluid className="my-4">
          <div className="pagetitle-lft">
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">Home</li>
                <li className="breadcrumb-item">Department</li>
                <li className="breadcrumb-item active">Publish Department</li>
              </ol>
            </nav>
          </div>

          <Card>
            <Card.Body>
              <h2 className="text-center text-uppercase mb-4">Publish Department</h2>
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="dname">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Department Name"
                    name="dname"
                    value={formData.dname}
                    onChange={handleChange}
                    isInvalid={!!formErrors.dname}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.dname}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-flex justify-content-between">
                  <Link to="/Department/AllDepartment">
                    <button type="button" className="btn btn-outline-secondary">Back</button>
                  </Link>
                  <Button variant="primary" type="submit">Publish</Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </main>

      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Publish</DialogTitle>
        <DialogContent>Are you sure you want to publish this department?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">Cancel</Button>
          <Button onClick={handlePublishConfirm} color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={successDialogOpen} onClose={() => setSuccessDialogOpen(false)}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>Department published successfully!</DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccessDialogOpen(false)} color="primary">OK</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PublishDeptEdit;
