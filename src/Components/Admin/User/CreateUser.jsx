import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import APIClient from "../../../API/APIClient";
import apis from "../../../API/API.json";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const CreateUser = () => {
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_no: "",
    address: "",
    usertype: "", // Ensure usertype starts as null to enforce integer
  });

  const dropdownOptions = [
    { usertype: 1, user_name: "Creator" },
    { usertype: 2, user_name: "Approver" },
    { usertype: 3, user_name: "Publisher" },
    { usertype: 4, user_name: "Super Admin" },
  ];

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "usertype" ? parseInt(value, 10) || null : value.trim(),
    });
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setLoading(true);

    // Validate required fields
    if (
      !formData.name ||
      !formData.email ||
      !formData.mobile_no ||
      !formData.address ||
      formData.usertype === null
    ) {
      setFormErrors({ message: "All fields are required" });
      setLoading(false);
      return;
    }

    // Construct the payload
    const payload = {
      ...formData,
      usertype: parseInt(formData.usertype, 10), // Ensure it's an integer
    };

    console.log("Submitting Data:", JSON.stringify(payload, null, 2)); // Debugging

    try {
      const response = await APIClient.post(apis.newuser, payload);

      if (response.status === 200) {
        toast.success("User created successfully!");
        setFormData({
          name: "",
          email: "",
          mobile_no: "",
          address: "",
          usertype: null,
        });
      } else if (response.status === 500) {
        toast.error("User already exists");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container ">
        <main id="main" className="main">
          <div className="pagetitle">
              <nav>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">Dashboard</li>
                  <li className="breadcrumb-item  ">CMS</li>
                  <li className="breadcrumb-item active ">Create User</li>
                </ol>
              </nav>
            <h1 className="text-center text-dark">Create User</h1>
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

                  <Form onSubmit={handleSubmit} className="custom-form-width">

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

                    <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? "Creating..." : "Create User"}
                    </Button>
                  </Form>

                  <ToastContainer />
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>
    

  );
};

export default CreateUser;
