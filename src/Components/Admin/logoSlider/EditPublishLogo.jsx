import { useState, useEffect } from "react";
import { Button, Box, Paper, TextField, IconButton } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apis from "../../../API/API.json";
import { useParams } from "react-router-dom";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import APIClient from "../../../API/APIClient";

const EditPushlishLogo = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    content: "",
    imgsrc: null,
    imgpath: "",
    usertype: "",
    action: "", // Stores the existing image path
  });
  const storedUserString = localStorage.getItem("usertype");
  const usertype = JSON.parse(storedUserString);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await APIClient.get(`${apis.getlogoSliderbyid}${id}`);
        setFormData({
          content: response.data.content || "",
          imgsrc: null, // Reset uploaded image
          imgpath: response.data.imgpath || "", // Store existing image
        });
      } catch (error) {
        console.error("Error fetching banner data:", error);
        toast.error("Failed to fetch banner data");
      }
    }

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleUpload = async () => {
    try {
      const uploadData = new FormData();

      if (selectedImage) {
        uploadData.append("imgsrc", selectedImage);
      } else if (formData.imgpath) {
        uploadData.append("imgpath", formData.imgpath);
      }

      uploadData.append("content", formData.content);
      uploadData.append("usertype", usertype);
      uploadData.append("action", "publish");
      const response = await APIClient.post(`${apis.EditLogo}${id}`, uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Publish banner  data successfully!");

      setFormData((prev) => ({
        ...prev,
        imgpath: response.data.imgpath || prev.imgpath, // Update only if a new image is uploaded
      }));

      setSelectedImage(null);
    } catch (error) {
      console.error("Error uploading banner:", error);
      toast.error("Error uploading banner");
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const allowedExtensions = /(\.png|\.jpg|\.gif|\.jpeg)$/i;
    if (file && allowedExtensions.test(file.name)) {
      setSelectedImage(file);
      setFormData((prev) => ({
        ...prev,
        imgsrc: file,
        imgpath: "", // Clear existing image path when selecting a new one
      }));
    } else {
      toast.error("Please select a PNG, JPEG, or GIF image");
      event.target.value = "";
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="formdata">
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">Home</li>
            <li className="breadcrumb-item">Logo</li>
            <li className="breadcrumb-item active">Edit Publish Logo</li>
          </ol>
        </nav>
        <form>
          <Paper
            elevation={15}
            sx={{
              padding: 8,
              maxWidth: "1200px",
              margin: "auto",
              position: "relative",
            }}
          >
            <h1>{id ? "Publish Banner Data" : "Publish Banner Data"}</h1>

            {/* Show existing or newly selected image */}
            {(selectedImage || formData.imgpath) && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 2,
                }}
              >
                <img
                  width="100"
                  height="100"
                  style={{
                    maxWidth: "100px",
                    maxHeight: "100px",
                    objectFit: "cover",
                  }}
                  src={
                    selectedImage
                      ? URL.createObjectURL(selectedImage)
                      : `${APIClient.defaults.baseURL}${formData.imgpath}`
                  }
                  alt="Preview"
                />
              </Box>
            )}

            <input
              type="file"
              onChange={handleImageChange}
              style={{ display: "none" }}
              id="upload-input"
            />
            <label htmlFor="upload-input">
              <Button variant="outlined" component="span">
                <AddPhotoAlternateIcon />
                Choose File
              </Button>
            </label>

            {/* Text field for content */}
            <TextField
              label="Add Content"
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              fullWidth
              sx={{ marginTop: 5 }}
              required
            />

            {/* Upload or update button */}
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              sx={{ marginTop: 2 }}
            >
              <UploadFileIcon />
              {id ? "Publish Banner" : "Publish Banner"}
            </Button>

            {id && (
              <IconButton
                onClick={() =>
                  console.log("Delete function needs implementation")
                }
                sx={{ position: "absolute", top: 5, right: 5 }}
              >
                {/* <DeleteIcon /> */}
              </IconButton>
            )}

            <ToastContainer />
          </Paper>
        </form>
      </div>
    </div>
  );
};

export default EditPushlishLogo;
