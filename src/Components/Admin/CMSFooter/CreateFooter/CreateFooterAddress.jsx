import { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
//import ViewListIcon from '@mui/icons-material/ViewList';

import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
//import HomeIcon from '@mui/icons-material/Home';
import {

  Button,
  Snackbar,
  DialogTitle,
  DialogContent,
  Dialog,
} from '@mui/material';
import APIClient from "../../../../API/APIClient";
import apis from "../../../../API/API.json";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


 const CreateFooterAddress = () => {
  const [html, setHtml] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const storedUserString = localStorage.getItem("usertype");
  const usertype = JSON.parse(storedUserString);
  const [formData, setFormData] = useState({
    tittle_name: '',
    address: '',
    mobile_no: '',
    contenttype: 0,
    footertype:3,
    languagetype: '',
  });
  const [errors, setErrors] = useState({});

  // Validation functions
  const validateForm = () => {
    const newErrors = {};


    if (!formData.tittle_name) {
      newErrors.tittle_name = "Please enter Name";
    } else if (!/^[A-Za-z\s]+$/.test(formData.tittle_name)) {
      newErrors.tittle_name = "Only alphabet characters are allowed"; // Prevents numbers and special characters
    } else if (parseInt(formData.languagetype) === 2) {
      if (!/^[\u0900-\u097F\s]+$/.test(formData.tittle_name)) {
        newErrors.tittle_name = "कृपया केवल हिंदी शब्द ही इनपुट करें";
      }
    }

    if (!formData.mobile_no) {
      newErrors.mobile_no = "Please enter your mobile number";
    } else if (!/^(\+91|\+91\-|0)?[789]\d{9}$/.test(formData.mobile_no)) {
      newErrors.mobile_no = "Please enter a valid 10-digit phone number ";
    }
  
    if (!formData.address) {
      newErrors.address = 'Address is required';
    } else if (
      !/^[\u0900-\u097F\s]+$/.test(formData.address) &&
      parseInt(formData.languagetype) === 2
    ) {
      errors.address = "कृपया केवल हिंदी शब्द ही इनपुट करें";
    }
    if (!formData.languagetype ) {
      newErrors.languagetype = 'Select a Language';
    }
  

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
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
        formDataToSend.append('tittle_name', formData.tittle_name);
        formDataToSend.append('address', formData.address);
        formDataToSend.append('mobile_no', formData.mobile_no);
        formDataToSend.append('footertype', formData.footertype);
        formDataToSend.append('contenttype', formData.contenttype);
        formDataToSend.append('languagetype', formData.languagetype);
        formDataToSend.append("usertype", usertype);
        const response = await APIClient.post(apis.createfooter, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setModalMessage('Data saved successfully!');
        setSnackbarOpen(true);

        // Clear the form fields
        setFormData({
          tittle_name: '',
          address: '',
          mobile_no: '',
          languagetype: '',
        });
      
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error('Unauthorized access. Please log in.');
      } else {
      
        toast.error('Something Went Wrong!');
        console.error('Error saving/updating data:', error);
      }
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div>
     
      <main id="main">
        <div className="pagetitle">
          <div className="pagetitle-lft">
            {/* <h1>Create Footer Address</h1> */}
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">Home</li>
                <li className="breadcrumb-item">Footer</li>
                <li className="breadcrumb-item active">Create Footer Address</li>
              </ol>
            </nav>
          </div>
          <h1>Create Footer Address</h1> 
          <div className="row justify-content-center">
          <div className="d-flex justify-content-left" style={{ marginLeft: "100px" }}>
          <Link to='/dashboard'>
              <button type="button" className="btn btn-info">
                Back
              </button>
            </Link>
          </div>
        </div>
        <div className="row justify-content-center">
  <div className="formdata"> {/* Bootstrap column for full width */}
    <div className="card custom-card">
      <div className="card-body">
                <div className="mb-3 mt-md-4">
                  <div className="col-md-12">
                    <div className="box-sec">
                      
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
                          <option value=" ">Select a Language</option>
                          <option value="1">English</option>
                          <option value="2">Hindi</option>
                        </select>
                        {errors.languagetype && (
                          <div className="text-danger">
                            {errors.languagetype}
                          </div>
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
                        <label className="form-label text-dark">Address</label>
                        <textarea
                          className="form-control"
                          type="text"
                          placeholder="Address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                        />
                        {errors.address && (
                          <div className="text-danger">{errors.address}</div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-dark">Phone No</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Phone No"
                          name="mobile_no"
                          value={formData.mobile_no}
                          onChange={handleInputChange}
                          maxLength={10}
                          minLength={10}
                        />
                        {errors.mobile_no && (
                          <div className="text-danger">{errors.mobile_no}</div>
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
                            <Button
                              onClick={handleConfirmSubmit}
                              color="primary"
                            >
                              Confirm
                            </Button>
                          </DialogActions>
                        </Dialog>
                        <Snackbar
                          open={snackbarOpen}
                          autoHideDuration={3000} // Adjust as needed
                          onClose={() => setSnackbarOpen(false)}
                        >
                          <Alert
                            severity="success"
                            onClose={() => setSnackbarOpen(false)}
                          >
                            {modalMessage}
                          </Alert>
                        </Snackbar>
                        <ToastContainer/>
                      </div>
                    </div>
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

export default CreateFooterAddress;