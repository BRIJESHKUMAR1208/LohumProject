import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import APIClient from "../../../API/APIClient";
import apis from "../../../API/API.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewListIcon from "@mui/icons-material/ViewList";
import { Link, useParams } from "react-router-dom";
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

function EAlert(props) {
  return <Alert elevation={6} variant="filled" {...props} />;
}

const PublishEditVision = () => {
  const { id } = useParams();
  const [content, setContent] = useState("");
  const [menudata, setMenudata] = useState("");
  const [html, setHtml] = useState("");
  const [file, setFile] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false); // Confirmation dialog state
  // const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state
  const [modalMessage, setModalMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const navigate = useNavigate();
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [existingFile, setExistingFile] = useState(null);
  const storedUserString = localStorage.getItem("usertype");
  const usertype = JSON.parse(storedUserString);

  const config = useMemo(
    () => ({
      readonly: false,
    }),
    []
  );
  const onChange = useCallback((html) => {
    setContent(html);
  }, []);

  const [formData, setFormData] = useState({
    title_name: "",
    contenttype: "",
    external_link: "",
    internal_link: "",
    file: "",
    html: "",
   // footertype: 3,
    languagetype: "",
    filepdfpath: "",
    visiontype: "",
  });

  const editor = useRef(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({
      title_name: "",
      contenttype: "",
      external_link: "",
      internal_link: "",
      file: "",
      html: "",
      //footertype: 3,
      languagetype: "",
      filepdfpath: "",
      visiontype: "",
    });
  }, []);

  const handleEditorChange = (content) => {
    setHtml(content);
    setFormData((prevState) => ({
      ...prevState,
      html: content, // Ensure formData is also updated
    }));
  };
  // const handleEditorChange = (content) => {
  //   sethtml(content);
  // };

  const validateForm = () => {
    const errors = {};
    const namePattern = /^[a-zA-Z\s]+$/;
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    if (!formData.title_name) {
      errors.title_name = "Name is required";
    } else if (!formData.title_name.match(namePattern)) {
      errors.title_name = "Name should only contain alphabets and spaces";
    } else if (specialCharRegex.test(formData.title_name)) {
      errors.description = " Name should not contain special characters";
    } else if (parseInt(formData.languagetype) === 2) {
      if (!/^[\u0900-\u097F\s]+$/.test(formData.title_name)) {
        errors.title_name = "कृपया केवल हिंदी शब्द ही इनपुट करें";
      }
    }

    if (!formData.contenttype) {
      errors.contenttype = "Select a content type";
    }
    if (!formData.languagetype) {
      errors.languagetype = "Select a Language";
    }

    if (!formData.visiontype) {
        errors.visiontype = "Select a visiontype";
      }

    if (formData.contenttype === "4" && !formData.external_link) {
      errors.external_link = "External Link is required";
    }

    // if (formData.contenttype === "3" && !formData.internal_link) {
    //   errors.internal_link = "Internal Link is required";
    // }

    // if (formData.contenttype === "2" && !file) {
    //   errors.file = "File is required";
    // }

    // if (formData.contenttype === '1' && !html) {
    //   errors.editorContent = 'HTML content is required';
    // }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    setFile(imageFile);
  };

  const handleInputChange = (event) => {
    const { name, value, type } = event.target;

    if (type === "file") {
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
    //validateForm();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("tittle_name", formData.title_name);
      formDataToSend.append("contenttype", formData.contenttype);
      //formDataToSend.append("footertype", formData.footertype);
      formDataToSend.append("languagetype", formData.languagetype);
      formDataToSend.append("visiontype", formData.visiontype);

      if (formData.contenttype === 4) {
        formDataToSend.append("external_link", formData.external_link);
      } else if (formData.contenttype === 3) {
        formDataToSend.append("internal_link", formData.internal_link);
      } else if (formData.contenttype === 2) {
        if (file) {
          formDataToSend.append("file", file); // Attach new file
        } else if (formData.filepdfpath) {
          formDataToSend.append("filepdfpath", formData.filepdfpath); // Attach existing file path
        }
      } else if (formData.contenttype === 1) {
        formDataToSend.append("html", formData.html);
      }
      formDataToSend.append("usertype", usertype);
      formDataToSend.append("action", "publish");

      const response = await APIClient.post(
        "/api/VisionMission/update/" + id,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // console.log('Data saved:', response.data);
      toast.success("Data saved successfully!");
      setModalMessage("Data saved successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  useEffect(() => {
    async function fetchData1() {
      try {
        setLoading(true);
        const response = await APIClient.get(apis.getmenuname);
        setDropdownOptions(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    }
    fetchData1();
  }, []);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await APIClient.get(apis.getvisionbyid + id);
        setFormData(response.data);
        setHtml(response.data.html); // Set the html state
        setEditorContent(response.data.html); // Set the editor content
        // const menuresponse = await APIClient.get(apis.getmenuname);

        //setMenudata(menuresponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchData();
  }, [id]);
  // console.log(formData)

  return (
    <div>
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
          <h1 className="flex-grow-1 text-center">Approve Footer Data </h1>
        </div>
      </div>

      <div className="formdata">
        <div className="card">
          <div className="card-body">
            <div className="row justify-content-center">
              <div>
                <div className="mb-3">
                  <label className="form-label text-dark">Language Type</label>
                  <select
                    className="form-select"
                    name="languagetype"
                    value={formData.languagetype}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a Language</option>
                    <option value={1}>English</option>
                    <option value={2}>Hindi</option>
                  </select>
                  {errors.languagetype && (
                    <div className="text-danger">{errors.languagetype}</div>
                  )}
                </div>
                 {/* Input for visiontype */}
                <div className="mb-3">
                  <label className="form-label text-dark">Vision Type</label>
                  <select
                    className="form-select"
                    name="visiontype"
                    value={formData.visiontype}
                    onChange={handleInputChange}
                  >
                    <option value="">--Select--</option>
                    <option value="Challenge">Challenge</option>
                    <option value="Vision">Vision</option>
                    <option value="Mission">Mission</option>
                  </select>
                  {errors.visiontype && (
                    <div className="text-danger">{errors.visiontype}</div>
                  )}
                </div>
                {/* Input for Name */}
                <div className="mb-3">
                  <label className="form-label text-dark">Name</label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter Name"
                    name="title_name"
                    value={formData.title_name}
                    onChange={handleInputChange}
                  />
                  {errors.title_name && (
                    <div className="text-danger">{errors.title_name}</div>
                  )}
                </div>

                {/* Input for Select a content type */}
                <div className="mb-3">
                  <label className="form-label text-dark">
                    Select a content type
                  </label>
                  <select
                    className="form-select"
                    name="contenttype"
                    value={formData.contenttype}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a content type</option>
                    <option value={4}>External Link</option>
                    <option value={3}>Internal Link</option>
                    <option value={2}>File</option>
                    <option value={1}>HTML</option>
                  </select>
                  {errors.contenttype && (
                    <div className="text-danger">{errors.contenttype}</div>
                  )}
                </div>

                {/* Input for External Link */}
                {parseInt(formData.contenttype) === 4 && (
                  <div className="mb-3">
                    <label className="form-label text-dark">
                      Enter External Link
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter External Link"
                      name="external_link"
                      value={formData.external_link}
                      onChange={handleInputChange}
                    />
                    {errors.external_link && (
                      <div className="text-danger">{errors.external_link}</div>
                    )}
                  </div>
                )}

                {/* Input for Internal Link */}
                {parseInt(formData.contenttype) === 3 && (
                  <div className="mb-3">
                    <label className="form-label text-dark">
                      Enter Internal Link
                    </label>
                    <select
                      className="form-control"
                      name="internal_link"
                      value={formData.internal_link}
                      onChange={handleInputChange}
                      // isInvalid={!!formErrors.internal_link}
                    >
                      <option value="" style={{ color: "black" }}>
                        Select a Menu Name
                      </option>
                      {dropdownOptions.map((data) => (
                        <option key={data.id} value={"/menu/" + data.menuurl}>
                          {"Menu Name" + ":-" + data.menuname}
                        </option>
                      ))}
                    </select>
                    {errors.internal_link && (
                      <div className="text-danger">{errors.internal_link}</div>
                    )}
                  </div>
                )}

                {/* Input for File */}
                {formData.contenttype === 2 && (
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
                      name="file"
                      onChange={handleImageChange}
                    />
                    {errors.file && (
                      <div className="text-danger">{errors.file}</div>
                    )}
                  </div>
                )}

                {/* HTML Editor Input */}
                {parseInt(formData.contenttype) === 1 && (
                  <div className="mb-3">
                    <label className="form-label text-dark">HTML Editor</label>
                    <div>
                      <JoditEditor
                        ref={editor}
                        value={formData.html} // Ensure the editor is initialized with correct content
                        config={config}
                        tabIndex={1}
                        onChange={handleEditorChange}
                      />
                    </div>
                    {errors.editorContent && (
                      <div className="text-danger">{errors.editorContent}</div>
                    )}
                  </div>
                )}

                {/* Submit Button */}
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
                      <Button onClick={handleCloseConfirmation} color="primary">
                        Cancel
                      </Button>
                      <Button onClick={handleConfirmSubmit} color="primary">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishEditVision;
