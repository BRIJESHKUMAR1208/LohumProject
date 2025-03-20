import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import APIClient from "../../../API/APIClient";
import apis from "../../../API/API.json";

const BannerTable = () => {
  const [apiData, setApiData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const storedUserString = localStorage.getItem("usertype");
  const usertype = JSON.parse(storedUserString);

  const columns = [
    { field: "id1", headerName: "S.No", width: 50 },
    {
      field: "imgpath",
      headerName: "Image",
      width: 150,
      renderCell: (params) => (
        <img
          src={APIClient.defaults.baseURL + params.row.imgpath}
          alt="Image"
          style={{ width: "100%", height: "100%" }}
        />
      ),
    },
    { field: "content", headerName: "Content Data", width: 200 },

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
    try {
      await APIClient.post("/api/Slider/delete/" + selectedItem.id);
      setApiData((prevData) =>
        prevData.filter((item) => item.id !== selectedItem.id)
      );
      setModalMessage("Data deleted successfully");
      setSnackbarOpen(true);
    } catch (error) {
      toast.error("Something Went Wrong!");
      console.error("Error deleting data:", error);
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await APIClient.get(apis.getSlider);
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
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">Home</li>
              <li className="breadcrumb-item">Banner</li>
              <li className="breadcrumb-item active">Banner Table </li>
            </ol>
          </nav>
          <h1 className="maintitle">Banner Table</h1>

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 2 }}
          >
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/bannerapprovallist"
            >
              Banner Approval List
            </Button>
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to="/bannerpublisherlist"
            >
              Banner Publisher List
            </Button>
          </Box>
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
          <Dialog
            open={confirmDialogOpen}
            onClose={() => setConfirmDialogOpen(false)}
          >
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this data?
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setConfirmDialogOpen(false)}
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
            <MuiAlert severity="success" onClose={() => setSnackbarOpen(false)}>
              {modalMessage}
            </MuiAlert>
          </Snackbar>
          <ToastContainer />
        </main>
      </div>
    </div>
  );
};

export default BannerTable;
