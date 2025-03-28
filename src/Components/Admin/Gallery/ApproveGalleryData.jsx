import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
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

const ApproveGalleryData = () => {
  const { id } = useParams(); 
  const [formData, setFormData] = useState({
    title_name: "",
    languagetype: "",
    files: []
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]); // Store only existing images
  const [newImages, setNewImages] = useState([]); // Store new images separately
  const storedUserString = localStorage.getItem("usertype");
  const usertype = JSON.parse(storedUserString);


  useEffect(() => {
    if (id) {
      fetchGalleryData(id);
    }
  }, [id]);

  const fetchGalleryData = async (galleryId) => {
    try {
      const response = await APIClient.get(`${apis.getgallerybyid}/${galleryId}`);
      if (response.status === 200) {
        const data = response.data;

        
        setFormData({
          title_name: data.title,
          languagetype: data.languagetype,
          files: []
        });

        const formattedImagePaths = (data.ImagePaths || []).map(
          (path) => `${APIClient.defaults.baseURL}/${path}`
        );
        setExistingImages(formattedImagePaths);
        setImagePreviews(formattedImagePaths); // ✅ Update previews as well
      }
    } catch (error) {
      console.error("Error fetching gallery data:", error);
    }
  };

  const handleDeleteImage = (index, isExisting = false) => {
    if (isExisting) {
      setExistingImages((prevImages) => prevImages.filter((_, i) => i !== index));
      setImagePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    } else {
      setNewImages((prevFiles) => prevFiles.filter((_, i) => i !== index));
      setImagePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    }
  };
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const newFiles = Array.from(event.target.files);
  
    // Generate preview URLs for new images
  const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

  // Update state
  setNewImages((prevImages) => [...prevImages, ...newFiles]);
  setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title_name || !formData.languagetype || (id ? false : formData.files.length === 0)) {
      alert("Please fill all fields and select at least one image.");
      return;
    }

    const isConfirmed = window.confirm("Are you sure you want to submit?");
    if (!isConfirmed) return;

    const submissionData = new FormData();
    submissionData.append("titlename", formData.title_name);
    submissionData.append("languagetype", formData.languagetype);
    submissionData.append("usertype", usertype);
    submissionData.append("id", id);
    submissionData.append("action", "approve");

     // Append new images
  if (newImages.length > 0) {
    newImages.forEach((file) => {
      submissionData.append("lstImagePaths", file);
    });
  }



  // Append existing images (Only filenames, comma-separated)
if (existingImages.length > 0) {
  const existingImageNames = existingImages
    .map((imageUrl) => imageUrl.split("/").pop()) // Extract filenames
    .join(","); // Convert to a comma-separated string
  submissionData.append("ImagePaths", existingImageNames);
}


    try {
      const response = await APIClient.post(apis.galleryapprovalupdate, submissionData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        alert(id ? "Gallery updated successfully!" : "Gallery created successfully!");
      setFormData({ title_name: "", languagetype: "", files: [] });
      setExistingImages([]);
      setNewImages([]);
      setImagePreviews([]);
      window.location.reload();

     
      } else {
        alert("Failed to process request. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <div>
      <main className="main">
        <div className="pagetitle">
        <div className="pagetitle-lft">
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">Home</li>
              <li className="breadcrumb-item">Gallery</li>
              <li className="breadcrumb-item active">Approval Gallery Update</li>
            </ol>
            <h1 className="text-center heading-main">Approval Gallery Update</h1>
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
                    <div className="box-sec">
          <form onSubmit={handleSubmit} className="formdata">
            <div className="card custom-card">
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Title Name</label>
                  <input className="form-control" type="text" name="title_name" value={formData.title_name} onChange={handleInputChange} placeholder="Enter Title Name" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Language Type</label>
                  <select className="form-control" name="languagetype" value={formData.languagetype} onChange={handleInputChange}>
                    <option value="">Select Language</option>
                    <option value="1">English</option>
                    <option value="2">Hindi</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Choose Files</label>
                  <input className="form-control" type="file" multiple accept="image/*" onChange={handleImageChange} />
                </div>
                {imagePreviews.length > 0 && (
                  <div className="image-preview-container d-flex flex-wrap">
                    {imagePreviews.map((image, index) => (
                      <div key={index} className="position-relative">
                        <img key={index}
                          src={image}
                          alt={`Preview ${index}`}
                          className="img-thumbnail m-2"
                          style={{ width: "100px", height: "100px", objectFit: "cover" }}
                        />
                        <button
                          type="button"
                          className="btn btn-danger btn-sm position-absolute top-0 end-0"
                          onClick={() => handleDeleteImage(index, image.startsWith(APIClient.defaults.baseURL))}
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button type="submit" className="btn btn-primary mt-3">{id ? "Update" : "Submit"}</button>
              </div>
            </div>
          </form>
          </div>
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

export default ApproveGalleryData;
