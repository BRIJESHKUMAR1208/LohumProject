import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Container, Form, Spinner } from 'react-bootstrap';
import APIClient from "../../../API/APIClient";
import apis from "../../../API/API.json";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Link, useParams } from 'react-router-dom';

export const  Publishedithostal = () => {
  const { id } = useParams(); // Getting hostel ID from the URL params
  const [formErrors, setFormErrors] = useState({});
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const storedUserString = localStorage.getItem("usertype");
  const usertype = JSON.parse(storedUserString);

  const [formData, setFormData] = useState({
    hname: ''  ,
    usertype: ''
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHostel = async () => {
      try {
        debugger;
        console.log("Fetching hostel data...");  // Log to check if API call is triggered
        const response = await APIClient.get(`${apis.getapproverHostelsedit}/${id}`);
        
        if (response && response.data) {
          console.log("Fetched hostel data:", response.data); // Log the fetched data
          setFormData({ hname: response.data.hname, 
            usertype:usertype,
            ...(usertype === 4  && { action: 'publish' })
          }); // Populate the form with fetched data
        } else {
          toast.error('Hostel data is missing.');
        }
      } catch (error) {
        console.error('Error fetching hostel:', error);
        toast.error('Error fetching hostel data. Please try again.');
      }
    };
    
    if (id) {
      fetchHostel();
    } else {
      toast.error("Hostel ID is missing");
    }
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.hname.trim()) {
      errors.hname = 'Hostel name is required';
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

  const handleUpdateConfirm = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);
    try {
      debugger;
      const response = await APIClient.post(`${apis.editHostel}/${id}`, formData, {headers: { "Content-Type": "application/json" },});
      if (response.status === 200) {
        setTimeout(() => {
          setLoading(false);
          setSuccessDialogOpen(true);
          setFormData({ hname: '' });
        }, 1000);
      } else {
        toast.error('Failed to update hostel');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error updating hostel:', error);
      toast.error('Something went wrong');
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
                        <li className="breadcrumb-item">Hostel</li>
                        <li className="breadcrumb-item active">Publish Edit Hostel</li>
                      </ol>
                    </nav>
                  </div>
        <Card>
          <Card.Body>
            <h2 className="text-center text-uppercase mb-4">Publish Edit Hostel</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="hname">
                <Form.Label>Hostel Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Hostel Name"
                  name="hname"
                  value={formData.hname}
                  onChange={handleChange}
                  isInvalid={!!formErrors.hname}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.hname}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-flex justify-content-between">
                <Link to="/Hostel/AllHostel">
                  <button type="button" className="btn btn-outline-secondary">Back</button>
                </Link>
                <Button variant="primary" type="submit">Submit</Button>
              </div>
              <Dialog open={loading}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </Dialog>
            </Form>
          </Card.Body>
        </Card>
      </Container>

      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Update</DialogTitle>
        <DialogContent>Are you sure you want to update this hostel?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">Cancel</Button>
          <Button onClick={handleUpdateConfirm} color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={successDialogOpen} onClose={() => setSuccessDialogOpen(false)}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>Hostel updated successfully!</DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccessDialogOpen(false)} color="primary">OK</Button>
        </DialogActions>
      </Dialog>
      </div>
    </>
  );
};

export default Publishedithostal;
