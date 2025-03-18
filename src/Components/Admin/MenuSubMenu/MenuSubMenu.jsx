import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
//import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
//import Header from '../../header/Header';
//import Sidebar from '../../sidebar/Sidebar';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import APIClient from "../../../API/APIClient";
import apis from "../../../API/API.json";
//import Footer from '../../footer/Footer';
//import AddIcon from "@mui/icons-material/Add";
//import DesignServicesIcon from "@mui/icons-material/DesignServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import './WhatsNewTable.scss'

function MenuSubMenu() {
  const [apiData, setApiData] = useState([]);
  //const [isDeleting, setIsDeleting] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const storedUserString = localStorage.getItem("usertype");
  const usertype = JSON.parse(storedUserString);

  const columns = [
    { field: "id1", headerName: "S.No", width: 50 },
    { field: "menuname", headerName: "Title", width: 200 },
    // { field: "internal_link", headerName: "Internal Link", width: 120 },
    // { field: "external_link", headerName: "External Link", width: 120 },
    { field: "menuurl", headerName: "Menu Url", width: 200 },
    {
      field: "edit",
      headerName: "Edit",
      sortable: false,
      renderCell: (params) =>
      
        usertype === 1 || usertype === 4 ? ( // Creator & Super Admin can edit
          <Link to={`/EditMenuSubmeu/IndexEdit/${params.row.id}`}>
            <EditIcon style={{ cursor: "pointer" }} />
          </Link>
        ) : (
          <EditIcon style={{ cursor: "not-allowed", color: "gray" }} />
        ),
    },
    {
      field: "delete",
      headerName: "Delete",
      sortable: false,
      renderCell: (params) =>
        usertype === 1 || usertype === 4 ? (
          //usertype === 1 || usertype === 4 ? (
          <DeleteIcon
            style={{ cursor: "pointer" }}
            onClick={() => handleDeleteClick(params.row)}
          />
        ) : (
          <DeleteIcon style={{ cursor: "not-allowed", color: "gray" }} />
        ),
    },
  ];

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setConfirmDialogOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (!selectedItem) return;

    try {
      await APIClient.post("/api/Topmenu/delete/" + selectedItem.id);
      setApiData((prevData) =>
        prevData.filter((item) => item.id !== selectedItem.id)
      );
      setModalMessage("Data deleted successfully");
      setSnackbarOpen(true);
    } catch (error) {
      toast.error("Something Went Wrong!");
      console.error("Error deleting data:", error);
    } finally {
      setSelectedItem(null);
      setConfirmDialogOpen(false);
    }
  };
  const handleCloseConfirmation = () => {
    setConfirmDialogOpen(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await APIClient.get(apis.topMenu);
        const dataWithIds = response.data.map((row, index) => ({
          id1: index + 1,
          ...row,
        }));
        setApiData(dataWithIds);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="row justify-content-center">
      <div className="formdata">

        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">Home</li>
            <li className="breadcrumb-item">Service</li>
            <li className="breadcrumb-item active">
              All Menu Submenu List{" "}
            </li>
          </ol>
        </nav>
        <h1>All Menu Submenu List</h1>


        <div className="d-flex justify-content-left" style={{ marginLeft: "1px" }}>
          <Link to="/dashboard">
            <button type="button" className="btn btn-info">
              Back
            </button>
          </Link>
          <Link to="/approvallist">
            <button
              type="button"
              className="btn btn-primary"
              style={{ marginLeft: "10px" }}
            >
              Get Approval List
            </button>
          </Link>
          <Link to="/publisherlist">
            <button
              type="button"
              className="btn btn-primary"
              style={{ marginLeft: "10px" }}
            >
              Get Publisher List
            </button>
          </Link>
        </div>

        <div className="card-body">


          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={apiData}
              columns={columns}
              disableColumnFilter
              disableColumnSelector
              disableDensitySelector
              slots={{
                toolbar: GridToolbar, // Correct way to use the toolbar
              }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
            />
          </Box>

        </div>

        <Dialog open={confirmDialogOpen} onClose={handleCloseConfirmation}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this data?
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
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
        >
          <MuiAlert severity="success" onClose={() => setSnackbarOpen(false)}>
            {modalMessage}
          </MuiAlert>
        </Snackbar>
        <ToastContainer />
      </div>
    </div>
  );
}

export default MenuSubMenu;
