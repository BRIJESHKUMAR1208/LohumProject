import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewListIcon from "@mui/icons-material/ViewList";
import { Link, useParams } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";
import {
  Button,
  Snackbar,
  DialogTitle,
  DialogContent,
  Dialog,
} from "@mui/material";
import APIClient from "../../../../API/APIClient";
import apis from "../../../../API/API.json";
function EAlert(props) {
  return <Alert elevation={6} variant="filled" {...props} />;
}

const ApproveFooterServices = () => {
  const { id } = useParams();
  const [html, sethtml] = useState("");
  const [file, setselectedfile] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const storedUserString = localStorage.getItem("usertype");
  const usertype = JSON.parse(storedUserString);

  const [formData, setFormData] = useState({
    tittle_name: "",
    description: "",
    footertype: 2,
    contenttype: 0,
    languagetype: "",
  });
  const [errors, setErrors] = useState({});

  // useEffect(() => {
  //   setFormData({
  //     tittle_name: '',
  //     description: '',
  //   });
  // }, []);

  const handleEditorChange = (content) => {
    sethtml(content);
  };
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await APIClient.get(apis.getfooterbyid + id);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchData();
  }, [id]);

  const validateForm = () => {
    const errors = {};

    // Regular expression to match names with alphabets and spaces
    const namePattern = /^[a-zA-Z\s]+$/;

    if (!formData.tittle_name) {
      errors.tittle_name = "Name is required";
    } else if (!formData.tittle_name.match(namePattern)) {
      errors.tittle_name = "Name should only contain alphabets and spaces";
    }
    if (!formData.languagetype) {
      errors.languagetype = "Select a Language";
    }

    if (!formData.description) {
      errors.description = "Description is required";
    } else if (
      !/^[\u0900-\u097F\s]+$/.test(formData.description) &&
      parseInt(formData.languagetype) === 2
    ) {
      errors.description = "कृपया केवल हिंदी शब्द ही इनपुट करें";
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    setselectedfile(imageFile);
  };

  const handleInputChange = (event) => {
    const { name, value, type } = event.target;

    if (type === "2") {
      setFormData({
        ...formData,
        [name]: event.target.files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleOpenConfirmation = () => {
    if (validateForm()) {
      setConfirmDialogOpen(true);
    }
  };

  const handleCloseConfirmation = () => {
    setConfirmDialogOpen(false);
  };

  const handleConfirmSubmit = async () => {
    handleCloseConfirmation();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("tittle_name", formData.tittle_name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("footertype", formData.footertype);
      formDataToSend.append("contenttype", formData.contenttype);
      formDataToSend.append("languagetype", formData.languagetype);

      formDataToSend.append('usertype', usertype);
      formDataToSend.append('action', 'approve');
      const response = await APIClient.post("/api/lowerfooter/updatefooter/" + id, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },


      });

      toast.success("Data saved successfully!");
      setModalMessage("Data saved successfully!");
      setSnackbarOpen(true);

      // Clear the form fields
      setFormData({
        tittle_name: "",
        description: "",
      });
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div>
      <div className="row justify-content-center">
        <div className="d-flex justify-content-left" style={{ marginLeft: "100px" }}>
          <Link to="/dashboard">
            <button type="button" className="btn btn-info">
              Back
            </button>
          </Link>
          <h1 className="flex-grow-1 text-center">Approve Footer Service </h1>
        </div>
      </div>
      <div className="formdata">
        <div className="card">
          <div className="card-body">
            <div className="mb-3 mt-md-4">
              <div className="box-sec">


                <div className="row justify-content-center">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label text-dark">
                        Language Type
                      </label>
                      <select
                        className="form-select"
                        name="languagetype"
                        value={formData.languagetype}
                        onChange={handleInputChange}
                      >
                        <option value="0">Select a Language</option>
                        <option value="1">English</option>
                        <option value="2">Hindi</option>
                      </select>
                      {errors.languagetype && (
                        <div className="text-danger">{errors.languagetype}</div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-dark">
                        Enter Title
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Name"
                        name="tittle_name"
                        value={formData.tittle_name}
                        onChange={handleInputChange}
                      />
                      {errors.tittle_name && (
                        <div className="text-danger">{errors.tittle_name}</div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-dark">
                        Description
                      </label>
                      <textarea
                        className="form-control"
                        type="text"
                        placeholder="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                      />
                      {errors.description && (
                        <div className="text-danger">{errors.description}</div>
                      )}
                    </div>
                    <div className="btnsubmit">
                      <button
                        className="btn btn-primary"
                        onClick={handleOpenConfirmation}
                      >
                        Submit
                      </button>

                      <Dialog
                        open={confirmDialogOpen}
                        onClose={handleCloseConfirmation}
                      >
                        <DialogTitle>Confirm Submit</DialogTitle>
                        <DialogContent>
                          Are you sure you want to submit this data?
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={handleCloseConfirmation}
                            color="primary"
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleConfirmSubmit} color="primary">
                            Confirm
                          </Button>
                        </DialogActions>
                      </Dialog>
                      <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={3000}
                        onClose={() => setSnackbarOpen(false)}
                      >
                        <Alert
                          severity="success"
                          onClose={() => setSnackbarOpen(false)}
                        >
                          {modalMessage}
                        </Alert>
                      </Snackbar>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};
export default ApproveFooterServices;
