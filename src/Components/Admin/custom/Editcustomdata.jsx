import { useState, useEffect, useCallback, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useParams } from "react-router-dom";
import JoditEditor from "jodit-react";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";
import {
  Button,
  Snackbar,
  DialogTitle, // Add this import
  DialogContent,
  Dialog,
} from "@mui/material";
//import { Col, Row } from 'react-bootstrap';
import APIClient from "../../../API/APIClient";
import apis from "../../../API/API.json";

const Editcustomdata = () => {
  const { id } = useParams();
  const [html, setHtml] = useState("");
  const [file, setFile] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  //const [editorContent, setEditorContent] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  //const [formErrors, setFormErrors] = useState({});
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

  // const handleEditorChange = (content) => {
  //   setEditorContent(content);
  // };

  const [formData, setFormData] = useState({
    menu_id: "",
    submenu_id: 0,

    menuname: "",
    menuurl: "",
    contenttype: "",
    html: "",
    file: "",
    internallink: "",
    externallink: "",
    languagetype: "",
    filepdfpath: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({
      menu_id: "",
      submenu_id: 0,
      menuname: "",
      menuurl: "",
      contenttype: "",
      html: "",
      file: "",
      internallink: "",
      externallink: "",
      languagetype: "",
      filepdfpath: "",
    });
  }, []);

  const handleEditorChange = (content) => {
    setHtml(content);
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate menuname (only allow letters and spaces)
    if (!formData.menuname) {
      newErrors.menuname = "Please enter Name";
    } else if (!/^[A-Za-z\s]+$/.test(formData.menuname)) {
      newErrors.menuname = "Only alphabet characters are allowed"; // Prevents numbers and special characters
    } else if (parseInt(formData.languagetype) === 2) {
      if (!/^[\u0900-\u097F\s]+$/.test(formData.menuname)) {
        newErrors.menuname = "कृपया केवल हिंदी शब्द ही इनपुट करें";
      }
    }

    // Validate contenttype
    if (!formData.contenttype) {
      newErrors.contenttype = "Select a content type";
    }

    // Validate languagetype
    if (!formData.languagetype) {
      newErrors.languagetype = "Select a Language";
    }

    // Validate external link (only if contenttype is "4")
    if (formData.contenttype === "4" && !formData.externallink) {
      newErrors.externallink = "External Link is required";
    }

    // Validate file (only if contenttype is "2")
    if (formData.contenttype === "2") {
      if (!file) {
        newErrors.file = "File is required";
      } else if (file.type !== "application/pdf") {
        newErrors.file = "Only PDF files are allowed";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("menuname", formData.menuname);
      formDataToSend.append("contenttype", formData.contenttype);
      formDataToSend.append("menuurl", formData.menuurl);
      formDataToSend.append("submenu_id", formData.submenu_id);
      formDataToSend.append("languagetype", formData.languagetype);
      formDataToSend.append("usertype", usertype);
      formDataToSend.append("action", "creatorupdate");
      if (formData.contenttype === "4") {
        formDataToSend.append("externallink", formData.externallink);
      } else if (formData.contenttype === "3") {
        formDataToSend.append("internallink", formData.internallink);
      } else if (formData.contenttype === "2") {
        if (file) {
          formDataToSend.append("file", file); // Attach new file
        } else if (formData.filepdfpath) {
          formDataToSend.append("filepdfpath", formData.filepdfpath); // Attach existing file path
        }
      } else if (formData.contenttype === "1") {
        formDataToSend.append("html", content);
      }

      const response = await APIClient.post(
        "/api/TopMenu/updatecustomdata/" + id,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      window.location.replace("/custom/CustomTable");
      toast.success("Data saved successfully!");
      setModalMessage("Data saved successfully!");

      // window.location.href("custom/allcustomdata");
      setSnackbarOpen(true);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Unauthorized access. Please log in.");
      } else {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          const errorMessages = Object.values(error.response.data.errors)
            .flat()
            .join(" ");
          toast.error(`Validation Error: ${errorMessages}`);
        } else {
          toast.error("Something Went Wrong!");
        }
        console.error("Error saving/updating data:", error);
      }
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
    async function fetchData2() {
      try {
        const response = await APIClient.get(apis.getcustomdatabyid + id);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchData2();
  }, [id]);

  return (
    <div>
      <div>
        <main id="main" className="main">
          <div className="pagetitle">
            <div className="pagetitle-lft">
              <nav>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">Home</li>
                  <li className="breadcrumb-item  ">Menu</li>
                  <li className="breadcrumb-item active ">Edit Custom Menu</li>
                </ol>
              </nav>
            </div>
            <h1 className="text-center text-dark">Edit Custom Menu</h1>
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

            <div className="formdata">
              {" "}
              {/* Bootstrap column for full width */}
              <div className="card custom-card">
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label text-dark">
                      Select a Language
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

                  {/* Input for Name */}
                  <div className="mb-3">
                    <label className="form-label text-dark">Name</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Name"
                      name="menuname"
                      value={formData.menuname}
                      onChange={handleInputChange}
                    />
                    {errors.menuname && (
                      <div className="text-danger">{errors.menuname}</div>
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
                      <option value="4">External Link</option>
                      <option value="3">Internal Link</option>
                      <option value="2">File</option>
                      <option value="1">HTML</option>
                    </select>
                    {errors.contenttype && (
                      <div className="text-danger">{errors.contenttype}</div>
                    )}
                  </div>

                  {/* Input for External Link */}
                  {formData.contenttype === "4" && (
                    <div className="mb-3">
                      <label className="form-label text-dark">
                        Enter External Link
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter External Link"
                        name="externallink"
                        value={formData.externallink}
                        onChange={handleInputChange}
                      />
                      {errors.externallink && (
                        <div className="text-danger">{errors.externallink}</div>
                      )}
                    </div>
                  )}

                  {/* Input for Internal Link */}
                  {formData.contenttype === "3" && (
                    <div className="mb-3">
                      <select
                        className="form-control"
                        name="internallink"
                        value={formData.internallink}
                        onChange={handleInputChange}
                        // isInvalid={!!formErrors.internallink}
                      >
                        <option value="" style={{ color: "black" }}>
                          Select a role
                        </option>
                        {dropdownOptions.map((data) => (
                          <option key={data.id} value={"/menu/" + data.menuurl}>
                            {"Menu Name" + ":-" + data.menuname}
                          </option>
                        ))}
                      </select>
                      {errors.internallink && (
                        <div className="text-danger">{errors.internallink}</div>
                      )}
                    </div>
                  )}

                  {/* Input for File */}
                  {formData.contenttype === "2" && (
                    <div className="mb-3">
                      <a
                        href={`${APIClient.defaults.baseURL}${formData.filepdfpath}`} // Ensure filepath is properly appended
                        className="form-control"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {existingFile || "View Document"}
                      </a>
                      <label className="form-label text-dark">
                        Choose File
                      </label>
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
                  {formData.contenttype === "1" && (
                    <div className="mb-3">
                      <label className="form-label text-dark">
                        HTML Editor
                      </label>
                      <div>
                        {/* <textarea
                  className="form-control"
                  value={html}
                  onChange={(e) => handleEditorChange(e.target.value)}
                ></textarea> */}
                      </div>
                      {/* <FroalaEditorComponent
      tag='textarea'
      model={html}
      onModelChange={handleEditorChange}
    /> */}
                      {/* <HtmlEditor/> */}
                      <JoditEditor
                        value={formData.html}
                        config={config}
                        tabIndex={1}
                        onChange={onChange}
                      />
                      {errors.editorContent && (
                        <div className="text-danger">
                          {errors.editorContent}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="btnsubmit">
                    <button
                      className="btn btn-primary"
                      onClick={handleOpenConfirmation}
                    >
                      Update
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
                    <Snackbar
                      open={snackbarOpen}
                      autoHideDuration={3000} // Adjust as needed
                      onClose={() => setSnackbarOpen(false)}
                    >
                      <Alert
                        severity="success"
                        onClose={() => setSnackbarOpen(false)}
                      >
                        Menu updated successfully.
                      </Alert>
                    </Snackbar>
                    <ToastContainer />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
export default Editcustomdata;
