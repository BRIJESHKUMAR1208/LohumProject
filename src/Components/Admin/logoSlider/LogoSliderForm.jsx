import { useState } from "react";
//import axios from 'axios';
import { Button, Box, IconButton, Paper, Grid, TextField } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import APIClient from "../../../API/APIClient";
import apis from "../../../API/API.json";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const LogoSliderForm = ({ id, onDelete }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const storedUserString = localStorage.getItem("usertype");
  const usertype = JSON.parse(storedUserString);

  const handleVideoUpload = async () => {
    if (!selectedImage) return;
    if (!imageName.trim()) {
      // Display an error toast notification if image name is blank
      toast.error("Image name cannot be blank", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }
    if (!/^[a-zA-Z0-9\s]+$/.test(imageName)) {
      // Display an error toast notification if image name contains special characters
      toast.error("Name should not contain special characters", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    const formData = new FormData();
    formData.append("imgsrc", selectedImage);
    formData.append("content", imageName);
    formData.append("usertype", usertype);
    try {
      const response = await APIClient.post(apis.postLogoSlider, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const videoPath = response.data.videopath;
      alert("Data uploaded successfully!");
      // Show a success toast notification
      toast.success("Data uploaded successfully!", {
        position: toast.POSITION.TOP_CENTER,
      });

      // Clear the form fields and reset state after successful upload
      setSelectedImage(null);
      setImageName("");

      // Reset the input file element to allow selecting a new video
      const inputFile = document.getElementById(`upload-input-${id}`);
      if (inputFile) {
        inputFile.value = ""; // Clear the selected file
      }
    } catch (error) {
      console.error("Error uploading video:", error);

      // Show an error toast notification
      toast.error("Error uploading video", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const handleVideoChange = (event) => {
    const imageFile = event.target.files[0];
    const allowedExtensions = /(\.png|\.jpg|\.gif|\.jpeg)$/i;
    if (imageFile && allowedExtensions.test(imageFile.name)) {
      setSelectedImage(imageFile);
    } else {
      // Display an error toast notification if the file type is not allowed
      toast.error("Please select a PNG, JPEG, or GIF image", {
        position: toast.POSITION.TOP_CENTER,
      });
      // Reset the input file element
      event.target.value = "";
    }
  };

  const handleContentChange = (event) => {
    setImageName(event.target.value);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <div className="row justify-content-center">
      <div className="formdata">
        <div className="card">
          <div className="card-body">
            <form>
              <Paper
                elevation={15}
                sx={{
                  padding: 8,
                  width: "100%",
                  maxWidth: "1200px",
                  margin: "auto",
                  position: "relative",
                }}
              >
                <h1>Logo</h1>
                {selectedImage && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: 2,
                    }}
                  >
                    {/* Display a video preview, if needed */}
                    <img
                      width="100"
                      height="100"
                      style={{
                        maxWidth: "100px",
                        maxHeight: "100px",
                        objectFit: "cover",
                      }}
                      src={URL.createObjectURL(selectedImage)}
                    />
                  </Box>
                )}

                {/* Input for uploading video */}
                <input
                  type="file"
                  onChange={handleVideoChange}
                  style={{ display: "none" }}
                  id={`upload-input-${id}`}
                />
                <label htmlFor={`upload-input-${id}`}>
                  <Button variant="outlined" component="span">
                    <AddPhotoAlternateIcon />
                    Choose File
                  </Button>
                </label>

                {selectedImage && (
                  <IconButton
                    onClick={handleDelete}
                    sx={{ position: "absolute", top: 5, right: 5 }}
                  ></IconButton>
                )}

                {/* Text field for video name */}
                <TextField
                  label=" Add Content  "
                  value={imageName}
                  onChange={handleContentChange}
                  fullWidth
                  sx={{ marginTop: 5 }}
                  required
                />

                {/* Upload button */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleVideoUpload}
                  disabled={!selectedImage}
                  sx={{ marginTop: 2 }}
                >
                  <UploadFileIcon />
                  Upload image/video
                </Button>

                <ToastContainer />
              </Paper>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoSliderForm;
