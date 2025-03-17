import React, { useState, useEffect } from "react";
import { Button, Card, Container, Form, Spinner } from "react-bootstrap";
import APIClient from "../../../API/APIClient";
import apis from "../../../API/API.json";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Link, useParams } from "react-router-dom";

export const PublisherEditRoom = () => {
  const { id } = useParams(); // Getting room ID from the URL params
  const [formErrors, setFormErrors] = useState({});
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const storedUserString = localStorage.getItem("usertype");
  const usertype = JSON.parse(storedUserString);
  const [formData, setFormData] = useState({
    name: "", // Room name
    hostalid: "", // Selected hostel ID
    usertype: ''
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hostels, setHostels] = useState([]); // List of hostels


  useEffect(() => {
    const fetchRoom = async () => {
      try {
        debugger;
        const response = await APIClient.get(`${apis.getRoomsbyid}/${id}`);
        if (response && response.data) {
          setFormData({
            name: response.data.name,
            hostalid: response.data.hostalid,
            usertype:usertype,
            ...(usertype === 4 && { action: 'publish' })
          });
        } else {
          toast.error("Room data is missing.");
        }
      } catch (error) {
        console.error("Error fetching room:", error);
        toast.error("Error fetching room data. Please try again.");
      }
    };

    const fetchHostels = async () => {
      try {
        const response = await APIClient.get(apis.getHostels);
        if (response && response.data) {
          setHostels(response.data);
        } else {
          toast.error("Failed to load hostels");
        }
      } catch (error) {
        console.error("Error fetching hostels:", error);
        toast.error("Error loading hostels");
      }
    };

    if (id) {
      fetchRoom();
      fetchHostels();
    } else {
      toast.error("Room ID is missing");
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
    if (!formData.name.trim()) {
      errors.name = "Room name is required";
    }
    if (!formData.hostalid) {
      errors.hostalid = "Hostel selection is required";
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
      const response = await APIClient.post(`${apis.editRoom}/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.status === 200) {
        setTimeout(() => {
          setLoading(false);
          setSuccessDialogOpen(true);
          // Reset form values after success
          setFormData({ name: "", hostalid: "" }); // Reset form after success
        }, 1000);
      } else {
        toast.error("Failed to update room");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error updating room:", error);
      toast.error("Something went wrong");
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
                        <li className="breadcrumb-item">Room</li>
                        <li className="breadcrumb-item active">Publisher Edit Room</li>
                      </ol>
                    </nav>
                  </div>
        <Card>
          <Card.Body>
            <h2 className="text-center text-uppercase mb-4">Publisher Edit Room</h2>
            <Form onSubmit={handleSubmit}>

              <Form.Group className="mb-3" controlId="hostalid">
                <Form.Label>Hostel</Form.Label>
                <Form.Control
                  as="select"
                  name="hostalid"
                  value={formData.hostalid}
                  onChange={handleChange}
                  isInvalid={!!formErrors.hostalid}
                >
                  <option value="">Select a Hostel</option>
                  {hostels.map((hostel) => (
                    <option key={hostel.hid} value={hostel.hid}>
                      {hostel.hname}
                    </option>
                  ))}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {formErrors.hostalid}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Room Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Room Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  isInvalid={!!formErrors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.name}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-flex justify-content-between">
                
                <Button variant="primary" type="submit">
                  Submit
                </Button>
                <Link to="/Rooms/AllRooms">
                  <Button variant="outline-secondary">Back</Button>
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>

      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Update</DialogTitle>
        <DialogContent>Are you sure you want to update this room?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">Cancel</Button>
          <Button onClick={handleUpdateConfirm} color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={successDialogOpen} onClose={() => setSuccessDialogOpen(false)}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>Room updated successfully!</DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccessDialogOpen(false)} color="primary">OK</Button>
        </DialogActions>
      </Dialog>
      </div>
    </>
  );
};

export default PublisherEditRoom;
