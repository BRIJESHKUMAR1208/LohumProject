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
import { Button as Buttons} from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const AllCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const storedUserString = localStorage.getItem("usertype");
  const usertype = JSON.parse(storedUserString);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await APIClient.get(apis.getCandidates);
        // Map the API response to add an "id" field for DataGrid
        const dataWithIds = response.data.map((candidate, index) => ({
          srno: index + 1,
          id: candidate.id, // Unique candidate ID
          name: candidate.name,
          mobileno: candidate.mobileno,
          email: candidate.email,
          aadharno: candidate.aadharno,
          // courses: candidate.lstcand // Optionally, include course selections if needed
        }));
        setCandidates(dataWithIds);
      } catch (error) {
        console.error("Error fetching candidates:", error);
        toast.error("Failed to load candidates");
      }
    };

    fetchCandidates();
  }, []);

  // Handle Delete
  const handleDeleteClick = (candidate) => {
    setSelectedCandidate(candidate);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await APIClient.post(
        `${apis.deleteCandidate}/${selectedCandidate.id}`,
        null,
        { headers: { "Content-Type": "application/json" } }
      );
  
      if (response.status === 200) {
        setCandidates((prev) =>
          prev.filter((candidate) => candidate.id !== selectedCandidate.id)
        );
        toast.success("Candidate deleted successfully");
      } else {
        toast.error("Failed to delete candidate");
      }
    } catch (error) {
      console.error("Error deleting candidate:", error);
      toast.error(error.response?.data || "Failed to delete candidate");
    } finally {
      setConfirmDialogOpen(false);
    }
  };

 
  // Define columns for the DataGrid. The action column provides Edit and Delete options.
  const columns = [
    { field: "srno", headerName: "Sr. No.", width: 70 },
    { field: "name", headerName: "Candidate Name", width: 160 },
    { field: "mobileno", headerName: "Mobile No", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "aadharno", headerName: "Aadhar No", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <div>
          {/* Edit candidate link */}
          <Buttons
    variant="outline-primary"
    size="sm"
    as={Link}
    to={`/Candidate/EditCandidate/${params.row.id}`}
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

          {/* <Buttons variant="outline-primary" 
          size="sm" as={Link} 
          to={`/Candidate/EditCandidate/${params.row.id}`}>
          <EditIcon style={{ cursor: "pointer" }} />
          </Buttons> */}
          {/* Delete candidate button */}
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
    <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">Home</li>
                <li className="breadcrumb-item">Candidate</li>
                <li className="breadcrumb-item active">
                  All Candidate List{" "}
                </li>
              </ol>
            </nav>
    <div>
      <div className="formdata">
      <h2 className="maintitle mt-0 pt-0">Candidate List</h2>
        <div className="">
        {/* <Link to="/Candidate/CreateCandidate" style={{ textDecoration: "none", color: "inherit" }}>
          <Button variant="primary">
            <AddIcon /> New Candidate
          </Button>
        </Link>
      </div> */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 5, mb: 2 }}>
      <Button variant="contained" color="primary" component={Link} to="/Candidate/CreateCandidate">
          <AddIcon /> New Candidate
        </Button>
        <Button variant="contained" color="primary" component={Link} to="/Approvalcandidatelist">
          Candidate Approval List
        </Button>
        <Button variant="contained" color="secondary" component={Link} to="/Publishcandidatelist">
          Candidate Publisher List
        </Button>
      </Box>

      <Box sx={{ height: 600, width: "100%" }} style={{ backgroundColor: "#fff", padding: "16px" }}>
        <DataGrid
          rows={candidates}
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
        <DialogContent>Are you sure you want to delete this candidate?</DialogContent>
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

export default AllCandidates;
