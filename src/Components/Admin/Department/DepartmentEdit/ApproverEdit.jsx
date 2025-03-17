import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Spinner,
  Row,
} from "react-bootstrap";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import APIClient from "../../../../API/APIClient";
import apis from "../../../../API/API.json";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ApproverEdit = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const storedUserString = localStorage.getItem("usertype");
  const usertype = JSON.parse(storedUserString);

  // Fetch existing department data
  useEffect(() => {
    async function fetchDepartment() {
      try {
        //setLoading(true);
        const response = await APIClient.get(apis.getDeptbyID + id); //`${apis.Deptapprovallist}/${id}`
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching department:", error);
        toast.error("Failed to fetch department details.");
      }
    }
    fetchDepartment();
  }, [id]);

  // Handle input change
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  // Validate form before submitting
  const validateForm = () => {
    const errors = {};
    if (!formData.dname.trim()) {
      errors.dname = "Department name is required";
    } else if (!/^[A-Za-z\s_]+$/.test(formData.dname)) {
      errors.dname = "Only alphabet characters are allowed";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submit
  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      setConfirmDialogOpen(true);
    }
  };

  // Confirm update API call
  const handleUpdateConfirm = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);

    try {
      const formDataToSend = {
        dname: formData.dname,
        usertype: usertype,
        action: "approve",
      };
      // const formDataToSend = new FormData();
      // formDataToSend.append("dname", formData.dname);
      // formDataToSend.append("usertype", usertype);
      // formDataToSend.append("action", "approve");
      // Dynamically add usertype and action
      // if (usertype) { // Check if usertype is 2 or 4
      //   formDataToSend.append("usertype", usertype);
      //   formDataToSend.append("action", "approve");
      // }
      const response = await APIClient.post(
        apis.EditDept + id,
        formDataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      console.log(formDataToSend);
      console.log(formData);
      if (response.status === 200) {
        setSuccessDialogOpen(true);
        toast.success("Data Approved and send for publish!");
        setFormData({ dname: "" }); // Reset form after success
        setSnackbarOpen(true);
      } else {
        toast.error("Failed to update department.");
      }
    } catch (error) {
      console.error("Error updating department:", error);
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
                <li className="breadcrumb-item active">
                  Approver Department Edit
                </li>
              </ol>
            </nav>
          </div>

          <Card>
            <Card.Body>
              <h2 className="text-center text-uppercase mb-4">
                Approver Department Edit
              </h2>

              {/* {loading ? (
                <div className="text-center">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div> */}

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
                    <button type="button" className="btn btn-outline-secondary">
                      Back
                    </button>
                  </Link>
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </main>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Update</DialogTitle>
        <DialogContent>
          Are you sure you want to update this department?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateConfirm} color="primary">
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
        <DialogContent>Department updated successfully!</DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccessDialogOpen(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ApproverEdit;
