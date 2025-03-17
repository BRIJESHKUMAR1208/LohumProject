import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import APIClient from "../../../API/APIClient";
import apis from "../../../API/API.json";
const SliderTable = () => {
  const [apiData, setApiData] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Define columns for the DataGrid
  const columns = [
    { field: 1, headerName: "S.No", width: 50 },
    {
      field: "imgpath",
      headerName: "Image",
      // Render the image using an <img> element
      width: 100,
      height: 300,
      renderCell: (params) => (
        <img
          src={params.row.imgpath}
          alt="Image"
          style={{ width: "100%", height: "100%" }}
        />
      ),
    },
    { field: "content", headerName: "Content data", width: 200 },
    {
      field: "delete",
      headerName: "Delete",
      sortable: false,
      renderCell: (params) => (
        <DeleteIcon
          style={{ cursor: "pointer" }}
          onClick={() => handleDeleteClick(params.row)}
        />
      ),
    },
  ];

  // Handle the delete button click
  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setConfirmDialogOpen(true);
  };

  // Handle the delete confirmation
  const handleConfirmSubmit = async () => {
    try {
      // Make a DELETE request to your API to delete the selected item
      await APIClient.post(apis.deleteSlider + selectedItem.id);

      // Update the data in the state to reflect the deletion
      setApiData((prevData) =>
        prevData.filter((item) => item.id !== selectedItem.id)
      );

      // Display a success message
      setModalMessage("Data deleted successfully");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting data:", error);
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  // Close the delete confirmation dialog
  const handleCloseConfirmation = () => {
    setConfirmDialogOpen(false);
  };

  // Fetch data when the component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        // Make a GET request to your API to fetch the data
        const response = await APIClient.get(apis.getSlider);

        // Add an 'id' property to each item to satisfy the DataGrid's requirement
        // window.location.reload();
        const dataWithIds = response.data.map((row, index) => ({
          id: index,
          ...row,
        }));

        // Update the state with the fetched data
        setApiData(dataWithIds);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={apiData.map((item) => ({
            ...item,
            name: item.name || "", // Ensure name is a string
          }))}
          columns={columns}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
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

      {/* Delete confirmation dialog */}
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

      {/* Snackbar for showing success message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          {modalMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
export default SliderTable;
