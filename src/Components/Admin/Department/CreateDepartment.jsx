import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Spinner,
  Row,
} from "react-bootstrap";
import APIClient from "../../../API/APIClient";
import apis from "../../../API/API.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Sidebar from "../../Sidebar/Sidebar";
//import Header from "../../Header/Header";
//import Footer from "../../Footer/Footer";
import { Link } from "react-router-dom";

const CreateDepartment = () => {
  const [dname, setDepartmentName] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const errors = {};
    //const namePattern = /^[a-zA-Z\s]+$/;

    if (!dname.trim()) {
      errors.dname = "Please enter a department name";
    } else if (!/^[A-Za-z\s_]+$/.test(dname)) {
      errors.dname = "Only alphabet characters are allowed";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setConfirmDialogOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);
    // try {
    //   const response = await APIClient.post(apis.departmentPost, { departmentName });
    //   if (response.status === 200) {
    //     setTimeout(() => {
    //       setLoading(false);
    //       setSuccessDialogOpen(true);
    //       setDepartmentName("");
    //     }, 1000);
    //   } else {
    //     toast.error("Something went wrong");
    //   }
    // } catch (error) {
    //   console.error("Error submitting data:", error);
    //   toast.error(error.response?.data || "Error submitting data");
    //   setLoading(false);
    // }
    try {
      const payload = { dname: dname }; // Ensure the key matches backend model
      console.log("Payload being sent:", payload);

      const response = await APIClient.post(apis.departmentPost, payload, {
        headers: { "Content-Type": "application/json" },
      }); // Explicitly set content type//, { departmentName });
      if (response.status === 200) {
        setTimeout(() => {
          // Set loading state back to false after the delay
          setLoading(false);
          // Show the success dialog
          setSuccessDialogOpen(true);

          setFormData({
            dname: "",
            // email: '',
            // mobile_no: '',
            // address: '',
            // formtype1: 0,
            // formtype1_1: 0,
            // formtype1_2: 0,
            // formtype1_3: 0,
            // formtype1_4: 0,
            // formtype2: 0,
            // formtype3: 0,
            // formtype4: 0,
            // formtype5: 0
          });
        }, 1000);
      } else if (response.status === 500) {
        alert("User already exists");
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      //toast.error('Something went wrong');
      toast.error(error.response.data);
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <main id="main" className="main">
          <div className="pagetitle">
            <div className="pagetitle-lft">
              <nav>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">Home</li>
                  <li className="breadcrumb-item">Department</li>
                  <li className="breadcrumb-item active">Create Department</li>
                </ol>
              </nav>
            </div>
            <h2>Create Department</h2>
          </div>
          <div className="row justify-content-center">
            <div
              className="d-flex justify-content-left"
              style={{ marginLeft: "100px" }}
            >
              <Link to="/dashboard">
                <button type="button" className="btn btn-info">
                  Back
                </button>
              </Link>
            </div>
            <div className="formdata">
              {" "}
              {/* Bootstrap column for full width */}
              <div className="card custom-card">
                <div className="card-body">
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="DepartmentName">
                      <Form.Label style={{ color: "black" }}>
                        Department Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Department Name"
                        value={dname}
                        onChange={(e) => setDepartmentName(e.target.value)}
                        isInvalid={!!formErrors.dname}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.dname}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <div
                      className="d-flex"
                      style={{ justifyContent: "space-between" }}
                    >
                      <Button
                        variant="primary"
                        type="submit"
                        style={{ width: 100 }}
                      >
                        Submit
                      </Button>
                    </div>
                  </Form>

                  <ToastContainer />

                  {/* Confirmation Dialog */}
                  <Dialog
                    open={confirmDialogOpen}
                    onClose={() => setConfirmDialogOpen(false)}
                  >
                    <DialogTitle>Confirm Create</DialogTitle>
                    <DialogContent>
                      Are you sure you want to create this department?
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={() => setConfirmDialogOpen(false)}
                        color="primary"
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleConfirmSubmit} color="primary">
                        Confirm
                      </Button>
                    </DialogActions>
                  </Dialog>

                  {/* Success Dialog */}
                  <Dialog
                    open={successDialogOpen}
                    onClose={() => setSuccessDialogOpen(false)}
                  >
                    <DialogTitle>Success</DialogTitle>
                    <DialogContent>
                      Department created successfully!
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={() => setSuccessDialogOpen(false)}
                        color="primary"
                      >
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

export default CreateDepartment;
