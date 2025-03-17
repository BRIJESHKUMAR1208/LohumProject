import React, { useEffect, useState } from "react";
import { 
    Dialog, DialogTitle, DialogContent, DialogActions 
} from "@mui/material";
import { Box, Snackbar, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import APIClient from "../../../API/APIClient";
import apis from "../../../API/API.json";
import AddIcon from "@mui/icons-material/Add";
import { Button as Buttons } from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const AllHostel = () => {
  const [hostels, setHostels] = useState([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const storedUserString = localStorage.getItem("usertype");
  const usertype = JSON.parse(storedUserString);



  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await APIClient.get(apis.getallHostels);
        const dataWithIds = response.data.map((hostel, index) => ({
          srno: index + 1,
          id: hostel.hid, // Unique hostel ID
          hname: hostel.hname,
        }));
        setHostels(dataWithIds);
      } catch (error) {
        console.error("Error fetching hostels:", error);
        toast.error("Failed to load hostels");
      }
    };
    fetchHostels();
  }, []);

  // Handle Delete
  const handleDeleteClick = (hostel) => {
    setSelectedHostel(hostel);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await APIClient.post(
        `${apis.deleteHostel}/${selectedHostel.id}`,
        null,
        { headers: { "Content-Type": "application/json" } }
      );
  
      if (response.status === 200) {
        setHostels((prev) =>
          prev.filter((hostel) => hostel.id !== selectedHostel.id)
        );
        toast.success("Hostel deleted successfully");
      } else {
        toast.error("Failed to delete hostel");
      }
    } catch (error) {
      console.error("Error deleting hostel:", error);
      toast.error(error.response?.data || "Failed to delete hostel");
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  // Define columns for the DataGrid
  const columns = [
    { field: "srno", headerName: "Sr. No.", width: 300 },
    { field: "hname", headerName: "Hostel Name", width: 350 },
    {
      field: "action",
      headerName: "Action",
      width: 300,
      sortable: false,
      renderCell: (params) => (
        <div>
          <Buttons
    variant="outline-primary"
    size="sm"
    as={Link}
    to={`/Hostel/EditHostel/${params.row.id}`}
    onClick={(e) => {
      if (!(usertype === 1 || usertype === 4)) {
        e.preventDefault(); // Stop navigation for unauthorized users
      }
    }}
    style={{
      opacity: usertype === 1 || usertype === 4 ? 1 : 0.5, // Make it visually disabled
      pointerEvents: "auto", // Keep pointer events enabled for onClick to work
    }}
  >
    <EditIcon style={{ cursor: usertype === 1 || usertype === 4 ? "pointer" : "not-allowed" }} />
  </Buttons>
          {/* <Buttons
            variant="outline-danger"
            size="sm"
            style={{ marginLeft: 8 }}
            onClick={() => handleDeleteClick(params.row)}
          >
            <DeleteIcon style={{ cursor: "pointer" }} />
          </Buttons> */}

          <Buttons
    variant="outline-danger"
    size="sm"
    style={{
      marginLeft: 8,
      opacity: usertype === 1 || usertype === 4 ? 1 : 0.5, // Make it visually disabled
      pointerEvents: "auto", // Keep pointer events enabled for onClick
    }}
    onClick={(e) => {
      if (usertype === 1 || usertype === 4) {
        handleDeleteClick(params.row);
      } else {
        e.preventDefault(); // Prevent action for unauthorized users
      }
    }}
  >
    <DeleteIcon style={{ cursor: usertype === 1 || usertype === 4 ? "pointer" : "not-allowed" }} />
  </Buttons>
        </div>
      )
    }
  ];

  return (
    
    <div className="row justify-content-center">
    <div>
    <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">Home</li>
                <li className="breadcrumb-item">Hostel</li>
                <li className="breadcrumb-item active">
                  All Hostel List{" "}
                </li>
              </ol>
            </nav>
      <div className="formdata">
      <h1 className="maintitle mt-0 pt-0">Hostel List</h1>
        <div className="">
        {/* <Link to="/Hostel/CreateHostel" style={{ textDecoration: "none", color: "inherit" }}>
          <Button variant="primary">
            <AddIcon /> New Hostel
          </Button>
        </Link>
      </div> */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 5, mb: 2 , px: "16px"}}>
      <Button variant="contained" color="primary" component={Link} to="/Hostel/CreateHostel">
          <AddIcon /> New Hostel
        </Button>
        <Button variant="contained" color="primary" component={Link} to="/Approvalhostallist">
          Hostel Approval List
        </Button>
        <Button variant="contained" color="secondary" component={Link} to="/Publisherhostallist">
          Hostel Publisher List
        </Button>
      </Box>

      <Box sx={{ height: 600, width: "100%" }} style={{ backgroundColor: "#fff", padding: "16px" }}>
        <DataGrid
          rows={hostels}
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
          components={{ Toolbar: GridToolbar }}
          componentsProps={{ toolbar: { showQuickFilter: true } }}
          pageSize={10}
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this hostel?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <ToastContainer />
      </Snackbar>
    </div>
    </div>
  </div>
  </div>
  );
};

export default AllHostel;
