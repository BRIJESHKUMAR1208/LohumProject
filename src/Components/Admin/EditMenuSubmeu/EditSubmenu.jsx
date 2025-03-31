import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import ViewListIcon from '@mui/icons-material/ViewList';
import { Link, useParams } from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";

import Alert from "@mui/material/Alert";
import {
  Button,
  Snackbar,
  DialogTitle, // Add this import
  DialogContent,
  Dialog,
} from "@mui/material";
import { Col, Form, Row } from "react-bootstrap";
//import { ElectricBike } from "@mui/icons-material";
import JoditEditor from "jodit-react";
import APIClient from "../../../API/APIClient";
import apis from "../../../API/API.json";
import baseURL from "../../../API/APIClient";

const EditSubmenu = () => {
  const { id } = useParams();
  const [html, setHtml] = useState("");
  const [file, setFile] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [data, Setdata] = useState([]);
  const [submenus, setSubMenu] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [editorContent, setEditorContent] = useState("");
  //const [content, setContent] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState([]);
  //const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [filePath, setFilePath] = useState("");  
  const [existingFile, setExistingFile] = useState(null);
  const [formData, setFormData] = useState({
    menu_id: "",
    submenu_id: "",
    menuname: "",
    menuurl: "",
    contenttype: "",
    html: "",
    file: "",
    internal_link: "",
    external_link: "",
    languagetype: "",
    filepdfpath:""
  });
  const storedUserString = localStorage.getItem("usertype");
  const usertype = JSON.parse(storedUserString);

  const [errors, setErrors] = useState({});
  const editor = useRef(null);
  useEffect(() => {
    setFormData({
      menu_id: "",
      menuname: "",
      menuurl: "",
      contenttype: "",
      external_link: "",
      internal_link: "",
      submenu_id: "",
      file: "",
      html: "",
      languagetype: "",
      filepdfpath:""
    });
  }, []);

  const config = useMemo(
    () => ({
      readonly: false,
    }),
    []
  );

  const onChange = useCallback((html) => {
    setHtml(html);
  }, []);

  const handleEditorChange = (content) => {
    setHtml(content);
    setFormData((prevState) => ({
      ...prevState,
      html: content, // Ensure formData is also updated
    }));
  };

  // const handleEditorChange = (content) => {
  //   setHtml(content);
  // };
  const validateForm = () => {
    const newErrors = {};

    if (!formData.menuname) {
      newErrors.menuname = "Name is required";
    }
    // if (!formData.menu_id) {
    //   newErrors.menuname = 'Name is required';
    // }
    if (!formData.languagetype) {
      newErrors.languagetype = "Select a Language";
    }

    if (!formData.contenttype) {
      newErrors.contenttype = "Select a content type";
    }

    if (formData.contenttype === "4" && !formData.external_link) {
      newErrors.external_link = "External Link is required";
    }

    if (formData.contenttype === "3" && !formData.internal_link) {
      newErrors.internal_link = "Internal Link is required";
    }

    // if (formData.contenttype === "2") {
    //   if (!file) {
    //     newErrors.file = "File is required";
    //   } else if (file.type !== "application/pdf") {
    //     newErrors.file = "Only PDF files are allowed";
    //   }
    // }
    // if (formData.contenttype === '1' && !html) {
    //   newErrors.html = 'HTML content is required';
    // }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    setFile(imageFile);
  };
  const handleuploadpdf = async (event) => {
    const imageFile = event.target.files[0];
    if (imageFile && imageFile.type === "application/pdf") {
      setFile(imageFile);

      const formDataToSend = new FormData();
      formDataToSend.append("file", imageFile);
      try {
        const response = await APIClient.post(
          "/api/TopMenu/uploadpdf",
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const filePath = response.data.filepath;
        setFilePath(filePath);
        if (editor.current) {
          const range = editor.current.selection.range;
          editor.current.selection.insertHTML(
            `<a href="${filePath}">Download PDF</a>`
          );
        }
      } catch (error) {
        console.error("Error uploading PDF:", error);
      }
    }
  };
  const handleInputChange = (event) => {
    setSubMenu(event.target.value);
    setSelectedRole(event.target.value);

    const { name, value, type } = event.target;

    if (type === "file") {
      setFormData({
        ...formData,
        [name]: event.target.files[0],
      });
    } else {
      setSubMenu(event.target.value);
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
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("menuname", formData.menuname);
      formDataToSend.append("contenttype", formData.contenttype);
      formDataToSend.append("menuurl", formData.menuurl);
      formDataToSend.append("submenu_id", formData.submenu_id);
      formDataToSend.append("languagetype", formData.languagetype);

      if (formData.contenttype === "4") {
        formDataToSend.append("external_link", formData.external_link);
      } else if (formData.contenttype === "3") {
        formDataToSend.append("internal_link", formData.internal_link);
      } else if (formData.contenttype === "2") {
        if (file) {
          formDataToSend.append("file", file); // Attach new file
        } else if (formData.filepdfpath) {
          formDataToSend.append("filepdfpath", formData.filepdfpath); // Attach existing file path
        }
      } else if (formData.contenttype === "1") {
        formDataToSend.append("html", formData.html);
      }
      formDataToSend.append("usertype", usertype);
      formDataToSend.append("action", "creatorupdate");

      const response = await APIClient.post(
        apis.editSubMenu + id,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Data saved successfully!");
      setModalMessage("Data saved successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Unauthorized access. Please log in.");
      } else {
        toast.error("Something Went Wrong!");
        console.error("Error saving/updating data:", error);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await APIClient.get(apis.getmenuname);
        Setdata(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);
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
        const response = await APIClient.get(apis.getmenudatabyid + id);
        setFormData(response.data);
        setHtml(response.data.html); // Set the html state
        setEditorContent(response.data.html); // Set the editor content
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchData2();
  }, [id]);

  return (
    <div>
      <div className="row justify-content-center">
        <div className="container-fluid bg-white">
          <div className="box-sec">
            <h1 className="text-center">Edit SubMenu</h1>
            <Form.Group className="mb-3" controlId="Usertype">
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
              <div className="mb-12">
                <Form.Label className="text-center" style={{ color: "black" }}>
                  Menu Names
                </Form.Label>
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
                <Form.Control.Feedback type="invalid">
                  {/* {formErrors.usertype} */}
                </Form.Control.Feedback>
              </div>
            </Form.Group>
            {errors.selectedRole && (
              <div className="text-danger">{errors.selectedRole}</div>
            )}

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
                  <div className="text-danger">{errors.external_link}</div>
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
                  // isInvalid={!!formErrors.internal_link}
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
                {errors.internal_link && (
                  <div className="text-danger">{errors.internal_link}</div>
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
            {formData.contenttype === "1" && (
              <div className="mb-3">
                <label className="form-label text-dark">HTML Editor</label>
                <div>
                  {/* <textarea
                  className="form-control"
                  value={html}
                  onChange={(e) => handleEditorChange(e.target.value)}
                ></textarea> */}
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
            <div className="mb-3">
              <label className="form-label text-dark">Choose File</label>
              <input
                className="form-control"
                type="file"
                name="file"
                onChange={handleuploadpdf}
              />
              {errors.file && <div className="text-danger">{errors.file}</div>}
            </div>
            <div>
              <a href={baseURL + filePath} target="_blank">
                pdf file
              </a>
            </div>

            {/* Submit Button */}
            <div className="btnsubmit">
              <button
                className="btn btn-primary"
                onClick={handleOpenConfirmation}
                disabled={loading}
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
  );
};
export default EditSubmenu;
