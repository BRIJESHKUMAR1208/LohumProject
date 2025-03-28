import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import APIClient from "../../../API/APIClient";
import apis from "../../../API/API.json";

const ApproveGallerytable = () => {
  const [apiData, setApiData] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const storedUserString = localStorage.getItem("usertype");
  const usertype = JSON.parse(storedUserString);

  const columns = [
    { field: "id1", headerName: "S.No", width: 50 },
    { field: "title", headerName: "Title", width: 200 },

    {
      field: "edit",
      headerName: "Edit",
      sortable: false,
      renderCell: (params) =>
        usertype === 2 || usertype === 4 ? (
          <Link to={"/ApproveGalleryData/" + params.row.id}>
            <EditIcon style={{ cursor: "pointer" }} />
          </Link>
        ) : (
          <EditIcon style={{ cursor: "not-allowed", color: "gray" }} />
        ),
    },
    // {
    //   field: "delete",
    //   headerName: "Delete",
    //   sortable: false,
    //   renderCell: (params) => (
    //     <DeleteIcon
    //       style={{ cursor: "pointer" }}
    //       onClick={() => handleDeleteClick(params.row)}
    //     />
    //   ),
    // },
  ];

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setConfirmDialogOpen(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      await APIClient.post("/api/lowerfooter/delete/" + selectedItem.id);
      setApiData((prevData) =>
        prevData.filter((item) => item.id !== selectedItem.id)
      );
      setIsDeleting(false);
      setModalMessage("Data deleted successfully");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting data:", error);
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  const handleCloseConfirmation = () => {
    setConfirmDialogOpen(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await APIClient.get(apis.galleryapprovallist);
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
        <main id="main" className="main">
          <div className="pagetitle">
            <div className="pagetitle-lft">
              <nav>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">Home</li>
                  <li className="breadcrumb-item">Gallery</li>
                  <li className="breadcrumb-item active">
                  Gallery Approval List
                  </li>
                </ol>
              </nav>
              <h1> Gallery Approval List</h1>
            </div>
            <div
              className="d-flex justify-content-left"
              style={{ marginLeft: "1px" }}
            >
              <Link to="/dashboard">
                <button type="button" className="btn btn-info">
                  Back
                </button>
              </Link>
            </div>
          </div>
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
              components={{
                Toolbar: GridToolbar,
              }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
            />
          </Box>

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
        </main>
      </div>
    </div>
  );
};

export default ApproveGallerytable;
