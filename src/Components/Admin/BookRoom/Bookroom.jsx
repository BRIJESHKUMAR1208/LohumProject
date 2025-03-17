import React, { useState, useEffect } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import APIClient from "../../../API/APIClient";
import apis from "../../../API/API.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

const Bookroom = () => {
  const [hostelList, setHostelNamelist] = useState([]);
  const [roomlist, setRoomlist] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [Selection, setSelection] = useState({
    roomid: "",
    roomname: "",
    hostalid: "",
    hostalname: "",
    amount: "",
  });

  useEffect(() => {
    const fetchhostallist = async () => {
      try {
        const response = await APIClient.get(apis.getHostels);
        setHostelNamelist(response.data || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
        toast.error("Error fetching departments");
      }
    };
    fetchhostallist();
  }, []);

  useEffect(() => {
    const fetchroom = async () => {
      try {
        const response = await APIClient.get(apis.getrealRoomslist);
        setRoomlist(response.data || []);
        if (Selection.hostalid) {
          const filteredrooms = response.data.filter(
            (room) => room.hostalid === parseInt(Selection.hostalid, 10)
          );
          setRoomlist(filteredrooms);
        }
      } catch (error) {
        toast.error("Error fetching rooms");
      }
    };
    fetchroom();
  }, [Selection.hostalid]);

  // ✅ Validate form inputs
  const validateForm = () => {
    const errors = {};
    if (!Selection.hostalid) errors.hostalid = "Please select a hostel";
    if (!Selection.roomid) errors.roomid = "Please select a room";
    if (!Selection.amount.trim()) errors.amount = "Please enter an amount";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input change
  const handleCourseSelectionChange = (e) => {
    const { name, value } = e.target;
    setSelection((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear error on input change
    }));
  };

  // ✅ Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setConfirmDialogOpen(true);
  };

  // ✅ Handle API Submission
  const handleConfirmSubmit = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);

    try {
      const response = await APIClient.post(apis.createBookroom, Selection, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status >= 200 && response.status < 300) {
        setTimeout(() => {
          setLoading(false);
          setSuccessDialogOpen(true);
          setSelection({
            roomid: "",
            roomname: "",
            hostalid: "",
            hostalname: "",
            amount: "",
          });
        }, 1000);
      } else if (response.status === 500) {
        toast.error("Book room already exists");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error(error.response?.data || "Error submitting data");
      setLoading(false);
    }
  };

  return (
    <>
      <main id="main" className="main">
      <div className="pagetitle-lft">
                    <nav>
                      <ol className="breadcrumb">
                        <li className="breadcrumb-item">Home</li>
                        <li className="breadcrumb-item">Book Room</li>
                        <li className="breadcrumb-item active">New Book Room</li>
                      </ol>
                    </nav>
                  </div>
        <div className="formdata">
          <div className="homeContainer">
            <Row className="vh-100 d-flex justify-content-center align-items-left">
              <Col md={10} lg={12} xs={12}>
                <Card>
                  <Card.Body>
                    <h2 className="fw-bold mb-4 text-center text-uppercase">
                      Booking Room
                    </h2>
                    <Form onSubmit={handleSubmit}>
                      {/* Hostel Selection */}
                      <Form.Group className="mb-3" controlId="HostelName">
                        <Form.Label style={{ color: "black" }}>Hostel</Form.Label>
                        <Form.Select
                          value={Selection.hostalid}
                          name="hostalid"
                          onChange={handleCourseSelectionChange}
                          isInvalid={!!formErrors.hostalid}
                        >
                          <option value="">Select Hostel</option>
                          {hostelList.map((data) => (
                            <option key={data.hid} value={data.hid}>
                              {data.hname}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {formErrors.hostalid}
                        </Form.Control.Feedback>
                      </Form.Group>

                      {/* Room Selection */}
                      <Form.Group className="mb-3" controlId="RoomName">
                        <Form.Label style={{ color: "black" }}>Room</Form.Label>
                        <Form.Select
                          value={Selection.roomid}
                          name="roomid"
                          onChange={handleCourseSelectionChange}
                          isInvalid={!!formErrors.roomid}
                        >
                          <option value="">Select Room</option>
                          {roomlist.map((data) => (
                            <option key={data.id} value={data.id}>
                              {data.name}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {formErrors.roomid}
                        </Form.Control.Feedback>
                      </Form.Group>

                      {/* Amount Input */}
                      <Form.Group className="mb-3" controlId="Amount">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Amount"
                          value={Selection.amount}
                          name="amount"
                          onChange={handleCourseSelectionChange}
                          isInvalid={!!formErrors.amount}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.amount}
                        </Form.Control.Feedback>
                      </Form.Group>

                      {/* Submit Button */}
                      <div className="d-flex" style={{ justifyContent: "space-between" }}>
                      
                        <Button
                          variant="primary"
                          type="submit"
                          style={{ width: 100 }}
                          disabled={loading}
                        >
                          {loading ? "Submitting..." : "Submit"}
                        </Button>
                        <Link to="/BookRoom/Bookroomlist">
                          <Button variant="outline-secondary" style={{ width: 100 }}>
                            Back
                          </Button>
                        </Link>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </main>

      <ToastContainer />

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Create</DialogTitle>
        <DialogContent>Are you sure you want to book this room?</DialogContent>
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
        <DialogContent>Room booked successfully!</DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccessDialogOpen(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Bookroom;
