import { useState, useEffect } from "react";
import { Button, Card, Col, Container, Form, Spinner } from "react-bootstrap";
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
import { useParams } from "react-router-dom";
import { Row } from "react-bootstrap/esm";
import { Link } from "react-router-dom";

const EditUser = () => {
  const { id } = useParams();
  const [selectedRole, setSelectedRole] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_no: "",
    address: "",
    usertype: "",
  });

  const dropdownOptions = [
    { usertype: 1, user_name: "Creator" },
    { usertype: 2, user_name: "Approver" },
    { usertype: 3, user_name: "Publisher" },
    { usertype: 4, user_name: "Super Admin" },
  ];

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) {
      errors.name = "Please enter your name";
    } else if (!/^[A-Za-z ]+$/.test(formData.name)) {
      errors.name = "Please input alphabet characters only";
    }
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = `E-mail must include "@" character`;
    }
    if (!formData.mobile_no) {
      errors.mobile_no = "Please enter your mobile number";
    } else if (!/^(\+91|\+91\-|0)?[789]\d{9}$/.test(formData.mobile_no)) {
      errors.mobile_no = "Please enter a valid 10-digit phone number ";
    }
    if (!formData.address) {
      errors.address = "Please enter your address";
    }
    if (!formData.usertype) {
      errors.usertype = "Role is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    setConfirmDialogOpen(true);
  };
  const handleDeleteCancel = () => {
    // Handle cancel action in the confirmation dialog
    setConfirmDialogOpen(false);
  };
  const handleDeleteConfirm = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);
    try {
      const response = await APIClient.post("/api/user/put/" + id, {
        ...formData,
        usertype: parseInt(formData.usertype),
      });
      if (response.status === 200) {
        setTimeout(() => {
          setLoading(false);
          setSuccessDialogOpen(true);
        }, 1000);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await APIClient.get(apis.getUserById + id);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [id]);

  return (
    <div >
    <div >
 
      
    <main id="main" className="main">
    <div className="pagetitle">
          <div className="pagetitle-lft">
            {/* <h1>Create Sub-Menu</h1> */}
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">Dashboard</li>
                <li className="breadcrumb-item  ">CMS</li>
                <li className="breadcrumb-item active ">Edit User</li>
              </ol>
            </nav>
          </div>
          <h1 className="text-center text-dark">Edit User</h1>
        </div>
        <div className="row justify-content-center">
    <div className="d-flex justify-content-left" style={{ marginLeft: "100px" }}>
              <Link to="/User/UserTable">
                <button type="button" className="btn btn-info">Back</button>
              </Link>
            </div>
  <div className="formdata"> {/* Bootstrap column for full width */}
    <div className="card custom-card">
              <div className="card-body">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="mobile_no">
          <Form.Label>Mobile No</Form.Label>
          <Form.Control
            type="text"
            name="mobile_no"
            value={formData.mobile_no}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="usertype">
          <Form.Label>Role</Form.Label>
          <Form.Select
            name="usertype"
            value={formData.usertype ?? ""}
            onChange={handleChange}
            required
          >
            <option value="">Select a role</option>
            {dropdownOptions.map((data) => (
              <option key={data.usertype} value={data.usertype}>
                {data.user_name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {formErrors.message && (
          <div className="text-danger mb-3">{formErrors.message}</div>
        )}

        <div className="btnsubmit">
          <button className="btn btn-primary" onClick={handleSubmit}>
            Update
          </button>

          {/* <CustomModal isOpen={isModalOpen} message={modalMessage} onClose={closeModal} /> */}
          <ToastContainer />
          {/* Confirmation Dialog */}
          <Dialog open={confirmDialogOpen} onClose={handleDeleteCancel}>
            <DialogTitle>Confirm Create</DialogTitle>
            <DialogContent>
              Are you sure you want to create this user?
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteCancel} color="primary">
                Cancel
              </Button>
              <Button onClick={handleDeleteConfirm} color="primary">
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
            <DialogContent>User created successfully!</DialogContent>
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
      </Form>
    </div>
    </div>
    </div>
    </div>
   

      <ToastContainer />
    </main>
    </div>
    </div>
   
  );
};

export default EditUser;
