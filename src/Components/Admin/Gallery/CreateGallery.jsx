import React, { useState, useEffect, useMemo, useCallback } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewListIcon from "@mui/icons-material/ViewList";
import { Link } from "react-router-dom";
import { Routes, Route, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";
import {
  Button,
  Snackbar,
  DialogTitle, // Add this import
  DialogContent,
  Dialog,
} from "@mui/material";
import JoditEditor from "jodit-react";
import APIClient from "../../../API/APIClient";
import apis from "../../../API/API.json";

const CreateGallery = () => {
  const [formData, setFormData] = useState({
    titlename: "",
    languagetype: "",
    files: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]); // Store image previews
  const storedUserString = localStorage.getItem("usertype");
  const usertype = JSON.parse(storedUserString);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const newFiles = Array.from(event.target.files);

    // Merge new files with existing files
    setFormData((prevState) => ({
      ...prevState,
      files: [...prevState.files, ...newFiles],
    }));

    // Generate previews for newly selected images and merge with existing previews
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title_name || !formData.language_type || formData.files.length === 0) {
      alert("Please fill all fields and select at least one image.");
      return;
    }

    // Show confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to submit?");
    if (!isConfirmed) {
      return;
    }

    // Prepare data for submission
    const submissionData = new FormData();
    submissionData.append("titlename", formData.title_name);
    submissionData.append("languagetype", formData.language_type);
    formData.files.forEach((file) => submissionData.append("lstImagePaths", file));
    submissionData.append("usertype", usertype);

    try {
      debugger;
      const response = await APIClient.post(apis.creategallery, submissionData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        alert("Gallery created successfully!");
        setFormData({ title_name: "", language_type: "", files: [] });
        setImagePreviews([]);
      } else {
        alert("Failed to create gallery. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <div>
      <main id="main" className="main">
        <div className="pagetitle">
          <div className="pagetitle-lft">
            {/* <h1>Create Footer Data</h1> */}
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">Home</li>
                <li className="breadcrumb-item">Gallery</li>
                <li className="breadcrumb-item active">Create Gallery</li>
              </ol>
              <h1 className="text-center heading-main">Create Gallery</h1>
            </nav>
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
          </div>
          <div className="row justify-content-center">
            <div className="formdata">
              {" "}
              {/* Bootstrap column for full width */}
              <div className="card custom-card">
                <div className="card-body">
                  <div className="mb-3 mt-md-4">
                    <div className="box-sec"></div>
                    <form onSubmit={handleSubmit}>
                      {/* Title Name Input */}
                      <div className="mb-3">
                        <label className="form-label">Title Name</label>
                        <input
                          className="form-control"
                          type="text"
                          name="title_name"
                          value={formData.title_name}
                          onChange={handleInputChange}
                          placeholder="Enter Title Name"
                        />
                      </div>

                      {/* Language Type Dropdown */}
                      <div className="mb-3">
                        <label className="form-label">Language Type</label>
                        <select
                          className="form-control"
                          name="language_type"
                          value={formData.language_type}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Language</option>
                          <option value="1">English</option>
                          <option value="2">Hindi</option>
                        </select>
                      </div>

                      {/* File Upload */}
                      <div className="mb-3">
                        <label className="form-label">Choose Files</label>
                        <input
                          className="form-control"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </div>

                      {/* Display Image Previews */}
                      {imagePreviews.length > 0 && (
                        <div className="image-preview-container d-flex flex-wrap">
                          {imagePreviews.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Preview ${index}`}
                              className="img-thumbnail m-2"
                              style={{ width: "100px", height: "100px", objectFit: "cover" }}
                            />
                          ))}
                        </div>
                      )}

                      {/* Submit Button */}
                      <button type="submit" className="btn btn-primary mt-3">
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateGallery;
