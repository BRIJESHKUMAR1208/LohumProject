import React, { useState, useEffect, useMemo, useCallback } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Link, useParams } from 'react-router-dom';
import JoditEditor from 'jodit-react';
import HomeIcon from '@mui/icons-material/Home';
import APIClient from "../../../../API/APIClient";
import apis from "../../../../API/API.json";

import { Button, Card, Col, Container, Form, Spinner } from 'react-bootstrap';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';



 const ApproveTender = () => {
  const { id } = useParams();
  const [html, sethtml] = useState('');
  const [file, setFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  //const [selectedRole, setSelectedRole] = useState('');
  const [prevContentType, setPrevContentType] = useState('');
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [existingFile, setExistingFile] = useState(null);
  const [menudata, setmenudata] = useState("");
  const storedUserString = localStorage.getItem("usertype");
  const usertype = JSON.parse(storedUserString);
  const [formData, setFormData] = useState({
    tender_tittle: '',  // Corrected typo in the field name
    contenttype: '',
    external_file: '',
    internal_file: '',  // Corrected field name
    file: null,  // Use null for file state
    startdate: '',
    end_date: '',  // Corrected field name
    html: '',
    languagetype: '',
    filepdfpath:''
  });
  const [errors, setErrors] = useState({});
  const [editingItemId, setEditingItemId] = useState(null);

  const optionsData = [
    { id: 4, label: 'External Link' },
    { id: 3, label: 'Internal Link' },
    { id: 2, label: 'File' },
    { id: 1, label: 'HTML' },  // Updated label
  ];
  const config = useMemo(
    () => ({
      readonly: false
    }),
    []
  );

  const onChange = useCallback((newContent) => {
    // console.log("Editor content changed:", newContent);
    sethtml(newContent);
  }, []);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await APIClient.get(apis.getmenuname);
        setmenudata(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchData();
  }, [id]);
  useEffect(() => {
    if (id) {
      APIClient.get(apis.Tenderbyid + id)
        .then((response) => {
          setFormData(response.data);
          sethtml(response.data.html);

        })
        .catch((error) => {
          console.error('Error fetching data for editing:', error);
        });
    } else {
      setFormData({
        tender_tittle: '',
        contenttype: 0,
        external_file: '',
        internal_file: '',
        file: null,
        startdate: '',
        end_date: '',
        html: '',
        languagetype: '',
        filepdfpath:''
      });
    }
  }, [id]);

  const validateForm = () => {
    const errors = {};

    if (!formData.tender_tittle) {
      errors.tender_tittle = "Please enter Name";
    } else if (!/^[A-Za-z\s]+$/.test(formData.tender_tittle)) {
      errors.tender_tittle = "Only alphabet characters are allowed"; // Prevents numbers and special characters
    } else if (parseInt(formData.languagetype) === 2) {
      if (!/^[\u0900-\u097F\s]+$/.test(formData.tender_tittle)) {
        errors.tender_tittle = "कृपया केवल हिंदी शब्द ही इनपुट करें";
      }
    }

    if (!formData.contenttype) {
      errors.contenttype = 'Select a content type';
    }
    if (!formData.languagetype) {
      errors.languagetype = 'Select a Language';
    }

    if (formData.contenttype === '4' && !formData.external_file) {
      errors.external_file = 'External Link is required';
    }

    if (formData.contenttype === '3' && !formData.internal_file) {
      errors.internal_file = 'Internal Link is required';
    }

    // if (formData.contenttype === '2' && !file) {
    //   errors.file = 'File is required';
    // }

    if (formData.contenttype === '1' && !html) {
      errors.html = 'HTML content is required';  // Updated field name
    }

    if (!formData.startdate) {
      errors.startdate = 'Starting Date is required';
    }

    if (!formData.end_date) {
      errors.end_date = 'Ending Date is required';
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    setFile(imageFile);
  };


  const handleInputChange = (event) => {
    const { name, value, type } = event.target;

    // Store the previous content type
    setPrevContentType(formData.contenttype);

    if (type === 'file') {
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

  const openModal = (message) => {
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Open the confirmation dialog when the user clicks "Submit"
    setConfirmDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    // Handle cancel action in the confirmation dialog
    setConfirmDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    setConfirmDialogOpen(false);
    if (validateForm()) {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append('tender_tittle', formData.tender_tittle);
        formDataToSend.append('contenttype', formData.contenttype);

        if (parseInt(formData.contenttype) === 4) {
          formDataToSend.append('external_file', formData.external_file);
        } else if (parseInt(formData.contenttype) === 3) {
          formDataToSend.append('internale_file', formData.internal_file);
        } else if (parseInt(formData.contenttype) === 2) {
          if (file) {
            formDataToSend.append("file", file); // Attach new file
          } else if (formData.filepdfpath) {
            formDataToSend.append("filepath", formData.filepdfpath); // Attach existing file path
          }  // Use file here
        } else if (parseInt(formData.contenttype) === 1) {
          formDataToSend.append('html', html);
        }

        formDataToSend.append('startdate', formData.startdate);
        formDataToSend.append('end_date', formData.end_date);
        formDataToSend.append('languagetype', formData.languagetype);
        formDataToSend.append("usertype", usertype);
        formDataToSend.append("action", 'approve');
        const response = await APIClient.post("/api/Tenders/updatetenderdata/" + id, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        
        // console.log('Data updated:', response.data);
        toast.success('Data updated successfully!');
        setFormData({
            tender_tittle: "",
            contenttype: "",
            external_file: "",
            internale_file: "",
            file: "",
            startdate: "",
            end_date: "",
            html: "",
            languagetype: "",
          });
    
      } catch (error) {
        console.error('Error saving/updating data:', error);
        toast.error('Something went wrong');
      }
    }
  };

  // console.log(formData)
  return (

    <div className="dashboard-container ">
        <main id="main" className="main">
        <div className="pagetitle">
          <div className="pagetitle-lft">
           
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">Home</li>
                <li className="breadcrumb-item active">Approve Tender Data</li>
              </ol>
            </nav>
            <h1>Approve Tender Data</h1>
          </div>
          <div className="d-flex justify-content-left" style={{ marginLeft: "100px" }}>
            <Link to="/Tenderapprovallist">
              <button type="button" className="btn btn-info">
                Back
              </button>
            </Link>
          </div>
        </div>
        <div className="formdata">
              <div className="card custom-card">
                <div className="card-body">

            <div className="container">
              <div className="row">
                <div className="col">
                  <div className="col text-end">

                  </div>
                </div>
              </div>
              <div className="row justify-content-center">
                <div className="container-fluid bg-white">
                  <div className="box-sec">
                    {/* <h1 className="text-center heading-main">Tender</h1> */}
                    <div className="mb-3">
                      <label className="form-label text-dark">Language Type</label>
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
                      {errors.languagetype && <div className="text-danger">{errors.languagetype}</div>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-dark">Name</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Name"
                        name="tender_tittle"
                        value={formData.tender_tittle}
                        onChange={handleInputChange}
                      />
                      {errors.tender_tittle && <div className="text-danger">{errors.tender_tittle}</div>}
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-dark">Select a content type</label>
                      <select
                        className="form-select"
                        name="contenttype"
                        value={formData.contenttype}
                        onChange={handleInputChange}


                      >
                        <option value="">Select a content type</option>

                        {optionsData.map((data) => (
                          <option key={data.id} value={data.id}>
                            {data.label}
                          </option>
                        ))}
                      </select>
                      {errors.contenttype && <div className="text-danger">{errors.contenttype}</div>}
                    </div>

                    {/* Render fields based on contenttype */}
                    {parseInt(formData.contenttype) === 4 && (

                      <div className="mb-3">
                        <label className="form-label text-dark">Enter External Link</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter External Link"
                          name="external_file"
                          value={formData.external_file}
                          onChange={handleInputChange}
                        />
                        {errors.external_file && (
                          <div className="text-danger">{errors.external_file}</div>
                        )}
                      </div>
                    )}

                    {parseInt(formData.contenttype) === 3 && (
                      <div className="mb-3">
                      <select
                        className="form-control"
                        name="internale_file"
                        value={formData.internale_file}
                        onChange={handleInputChange}
                      // isInvalid={!!formErrors.internal_link}
                      >
                        <option value="" style={{ color: "black" }}>
                          Select a Menu Name
                        </option>
                        {menudata.map((data) => (
                          <option
                            key={data.id}
                            value={"/menu/" + data.menuurl}
                          >
                            {"Menu Name" + ":-" + data.menuname}
                          </option>
                        ))}
                      </select>
                      {errors.internale_file && (
                        <div className="text-danger">
                          {errors.internale_file}
                        </div>
                      )}
                    </div>
                    )}

                    {parseInt(formData.contenttype) === 2 && (
                      <div className="mb-3">
                         <a
                          href={`${APIClient.defaults.baseURL}${formData.filepdfpath}`} // Ensure filepath is properly appended
                          className="form-control"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {existingFile || "View Document"}
                        </a>
                        <label className="form-label text-dark">Choose File</label>
                        <input
                          className="form-control"
                          type="file"


                          onChange={handleImageChange}
                        />
                        {errors.file && (
                          <div className="text-danger">{errors.file}</div>
                        )}
                      </div>
                    )}

                    {parseInt(formData.contenttype) === 1 && (
                      <div className="mb-3">
                        <label className="form-label text-dark">HTML Editor</label>  {/* Updated label */}
                        <div>
                          {/* <FroalaEditorComponent
                        tag="textarea"
                        config={config}
                        model={html}
                        value={formData.html}
                        onModelChange={handleEditorChange}
                      /> */}
                          <JoditEditor
                            value={formData.html}
                            config={config}
                            tabIndex={1}
                            onChange={onChange}
                          />
                          {/* {console.log("hf")} */}
                        </div>
                        {errors.html && (
                          <div className="text-danger">{errors.html}</div>
                        )}
                      </div>
                    )}

                    <div className="mb-3">
                      <label className="form-label text-dark">Starting Date</label>
                      <input
                        className="form-control"
                        type="date"
                        name="startdate"
                        value={formData.startdate}
                        onChange={handleInputChange}
                      />
                      {errors.startdate && (
                        <div className="text-danger">{errors.startdate}</div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-dark">Ending Date</label>
                      <input
                        className="form-control"
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleInputChange}
                      />
                      {errors.end_date && (
                        <div className="text-danger">{errors.end_date}</div>
                      )}
                    </div>

                    <div className="btnsubmit">
                      <button className="btn btn-primary" onClick={handleSubmit}>
                        Approve
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
                          <Button onClick={() => setSuccessDialogOpen(false)} color="primary">
                            OK
                          </Button>
                        </DialogActions>
                      </Dialog>
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

export default ApproveTender;