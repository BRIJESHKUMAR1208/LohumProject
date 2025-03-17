import { useState, useEffect, useMemo, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";
import {
  Snackbar,
  DialogTitle, // Add this import
  DialogContent,
  Dialog,
  Button,
} from "@mui/material";
//import { Col, Form, Row } from "react-bootstrap";
import JoditEditor from "jodit-react";
import APIClient from "../../../API/APIClient";
import apis from "../../../API/API.json";

const CreateSubMenu = () => {
  const [html, setHtml] = useState("");
  const [file, setFile] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [data, Setdata] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedRole1, setSelectedRole1] = useState("");
  const [content, setContent] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    menuname: "",
    contenttype: "",
    external_link: "",
    internal_link: "",
    submenu_id: "",
    file: "",
    html: "",
    languagetype: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({
      menuname: "",
      contenttype: "",
      external_link: "",
      internal_link: "",
      submenu_id: "",
      file: "",
      html: "",
      languagetype: "",
    });
  }, []);

  const config = useMemo(
    () => ({
      readonly: false,
    }),
    []
  );

  const onChange = useCallback((newContent) => {
    setContent(newContent);
  }, []);

  const handleEditorChange = (content) => {
    setHtml(content);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.menuname) {
      newErrors.menuname = "Name is required";
    }

    if (!formData.contenttype) {
      newErrors.contenttype = "Select a content type";
    }
    if (!selectedRole) {
      newErrors.contenttype = "Select Contnet Type";
    }

    if (formData.contenttype === "4" && !formData.external_link) {
      newErrors.external_link = "External Link is required";
    }

    if (formData.contenttype === "3" && !formData.internal_link) {
      newErrors.internal_link = "Internal Link is required";
    }

    if (formData.contenttype === "2") {
      if (!file) {
        newErrors.file = "File is required";
      } else if (file.type !== "application/pdf") {
        newErrors.file = "Only PDF files are allowed";
      }
    }

    if (!formData.languagetype) {
      newErrors.languagetype = "Select Language";
    }

    if (!formData.submenu_id) {
      newErrors.submenu_id = "Select Menu";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    setFile(imageFile);
  };

  const handleInputChange = (event) => {
    setSelectedRole(event.target.value);
    setSelectedRole1(event.target.value);
    const { name, value, type } = event.target;

    if (type === "file") {
      setFormData({
        ...formData,
        [name]: event.target.files[0],
      });
    } else {
      setSelectedRole(event.target.value);
      setSelectedRole(event.target.value);
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

      // formDataToSend.append('subsubmenu_id', formData.subsubmenu_id);
      formDataToSend.append("submenu_id", formData.submenu_id);
      formDataToSend.append("languagetype", formData.languagetype);

      if (formData.contenttype === "4") {
        formDataToSend.append("external_link", formData.external_link);
      } else if (formData.contenttype === "3") {
        formDataToSend.append("internal_link", formData.internal_link);
      } else if (formData.contenttype === "2") {
        formDataToSend.append("file", file);
      } else if (formData.contenttype === "1") {
        formDataToSend.append("html", content);
      }

      const response = await APIClient.post(apis.createMenu, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // console.log('Data saved:', response.data);
      toast.success("Data saved successfully!");
      setModalMessage("Data saved successfully!");
      setSnackbarOpen(true);

      setFormData({
        menuname: "",
        contenttype: "",
        external_link: "",
        internal_link: "",
        submenu_id: "",
        file: "",
        html: "",
        languagetype: "",
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Unauthorized access. Please log in.");
      } else {
        toast.error("Something Went Wrong!");
        console.error("Error saving/updating data:", error);
      }
    }
  };
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await APIClient.get(apis.topMenu);
        Setdata(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);


  return (
    <div >
      <div >
        <main id="main" className="main">
          <div className="pagetitle">
            <div className="pagetitle-lft">
              {/* <h1>Create Sub-Menu</h1> */}
              <nav>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">Dashboard</li>
                  <li className="breadcrumb-item  ">CMS</li>
                  <li className="breadcrumb-item active ">SubMenu</li>
                </ol>
              </nav>
            </div>
            <h1 className="text-center text-dark">Sub Menu</h1>
          </div>
          <div className="row justify-content-center">
            <div className="d-flex justify-content-left" style={{ marginLeft: "100px" }}>
              <Link to="/dashboard">
                <button type="button" className="btn btn-info">Back</button>
              </Link>
            </div>

            <div className="formdata">
              <div className="card">

                <div className="card-body">

                  <div className="box-sec">

                    {/* <Form.Group className="mb-3" controlId="Usertype"> */}
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

                    <div className="mb-12">
                      <label className="form-label text-dark">Menu Names</label>
                      {/* <Form.Label className="text-center" style={{ color: "black" }}>Menu Names</Form.Label> */}
                      <select
                        className="form-control"
                        name="submenu_id"
                        value={formData.submenu_id}
                        onChange={handleInputChange}
                      >
                        <option value="" style={{ color: "black" }}>
                          Select a Menu
                        </option>
                        {data.map((data) => (
                          <option key={data.id} value={data.id}>
                            {data.menuname}
                          </option>
                        ))}
                      </select>
                      {errors.submenu_id && (
                        <div className="text-danger">{errors.submenu_id}</div>
                      )}
                    </div>
                    {/* </Form.Group> */}

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
                          name="external_link"
                          value={formData.external_link}
                          onChange={handleInputChange}
                        />
                        {errors.external_link && (
                          <div className="text-danger">
                            {errors.external_link}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Input for Internal Link */}
                    {formData.contenttype === "3" && (
                      <div className="mb-3">
                        <select
                          className="form-control"
                          name="internal_link"
                          value={formData.internal_link}
                          onChange={handleInputChange}
                        //isInvalid={!!formErrors.internal_link}
                        >
                          <option value="" style={{ color: "black" }}>
                            Select a role
                          </option>
                          {data.map((data) => (
                            <option
                              key={data.id}
                              value={"/menu/" + data.menu_url}
                            >
                              {"Menu Name" + ":-" + data.menuname}
                            </option>
                          ))}
                        </select>
                        {errors.internal_link && (
                          <div className="text-danger">
                            {errors.internal_link}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Input for File */}
                    {formData.contenttype === "2" && (
                      <div className="mb-3">
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
                          <JoditEditor
                            value={content}
                            config={config}
                            tabIndex={1}
                            onChange={onChange}
                          />
                        </div>
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
                          Data save successfully.
                        </Alert>
                      </Snackbar>
                      <ToastContainer />
                    </div>
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

export default CreateSubMenu;
