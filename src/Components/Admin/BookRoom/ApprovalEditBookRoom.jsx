import React, { useState, useEffect } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import APIClient from "../../../API/APIClient";
import apis from "../../../API/API.json";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Link, useParams } from "react-router-dom";

const ApprovalEditBookRoom = () => {
  const { id } = useParams(); // Get booking ID from URL params
  const [formErrors, setFormErrors] = useState({});
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const storedUserString = localStorage.getItem("usertype");
  const usertype = JSON.parse(storedUserString);

  const [formData, setFormData] = useState({
    hostalid: "",
    roomid: "",
    amount: "",
    usertype: ''
  });

  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await APIClient.get(`${apis.getbookroomlist}/${id}`);
        if (response.data) {
          setFormData({
            hostalid: response.data.hostalid,
            roomid: response.data.roomid,
            amount: response.data.amount,
            usertype:usertype,
            ...(usertype === 4 && { action: 'publish' })
          });
        } else {
          toast.error("Booking data is missing.");
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
        toast.error("Error fetching booking data. Please try again.");
      }
    };

    if (id) {
      fetchBooking();
    } else {
      toast.error("Booking ID is missing");
    }
  }, [id]);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await APIClient.get(apis.getHostels);
        if (response.data) {
          setHostels(response.data);
        } else {
          toast.error("Failed to load hostels");
        }
      } catch (error) {
        console.error("Error fetching hostels:", error);
        toast.error("Error loading hostels");
      }
    };

    fetchHostels();
  }, []);

  useEffect(() => {
    if (!formData.hostalid) {
      setRooms([]); // Clear rooms when no hostel is selected
      return;
    }

    const fetchRooms = async () => {
      try {
        debugger;
        const response = await APIClient.get(apis.getRooms);//`${apis.getRooms}?hostelid=${formData.hostelid}`);
        if (formData.hostalid) {
          const filteredrooms = response.data.filter(
            (room) => room.hostalid === parseInt(formData.hostalid, 10)
          );
          setRooms(filteredrooms);
        }else {
          setRooms([]);
          toast.error("No rooms available for this hostel.");
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
        toast.error("Error loading rooms");
      }
    };

    fetchRooms();
  }, [formData.hostalid]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.hostalid) errors.hostalid = "Hostel selection is required";
    if (!formData.roomid) errors.roomid = "Room selection is required";
    //if (!formData.amount.trim()) errors.amount = "Amount is required";
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
      const response = await APIClient.post(`${apis.editBookroom}/${id}`, formData);
      if (response.status === 200) {
        setTimeout(() => {
          setLoading(false);
          setSuccessDialogOpen(true);
          setFormData({
            hostalid: "",
            roomid: "",
            amount: ""
          });
        }, 1000);
      } else {
        toast.error("Failed to update booking");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error updating booking:", error);
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
                        <li className="breadcrumb-item">Book Room</li>
                        <li className="breadcrumb-item active"> Approval Edit Book Room</li>
                      </ol>
                    </nav>
                  </div>
        <Card>
          <Card.Body>
            <h2 className="text-center text-uppercase mb-4">Approval Edit Booked Room</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="hostalid">
                <Form.Label>Hostel</Form.Label>
                <Form.Select
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
                </Form.Select>
                <Form.Control.Feedback type="invalid">{formErrors.hostalid}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="roomid">
                <Form.Label>Room</Form.Label>
                <Form.Select
                  name="roomid"
                  value={formData.roomid}
                  onChange={handleChange}
                  isInvalid={!!formErrors.roomid}
                  disabled={!formData.hostalid}
                >
                  <option value="">Select a Room</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{formErrors.roomid}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="amount">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  isInvalid={!!formErrors.amount}
                />
                <Form.Control.Feedback type="invalid">{formErrors.amount}</Form.Control.Feedback>
              </Form.Group>

              <div className="d-flex justify-content-between">
                
                <Button variant="primary" type="submit">Submit</Button>
                <Link to="/BookRoom/Bookroomlist">
                  <Button variant="outline-secondary">Back</Button>
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>

      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Update</DialogTitle>
        <DialogContent>Are you sure you want to update this booking?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={successDialogOpen} onClose={() => setSuccessDialogOpen(false)}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>Room booking updated successfully!</DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccessDialogOpen(false)}>OK</Button>
        </DialogActions>
      </Dialog>
      </div>
    </>
  );
};

export default ApprovalEditBookRoom;
