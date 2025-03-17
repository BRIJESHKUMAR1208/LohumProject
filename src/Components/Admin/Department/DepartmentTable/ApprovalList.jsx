import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MuiAlert from "@mui/material/Alert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import APIClient from "../../../../API/APIClient";
import apis from "../../../../API/API.json";
import AddIcon from "@mui/icons-material/Add";

const ApprovalList = () => {
  const [departments, setDepartments] = useState([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const storedUserString = localStorage.getItem("usertype");
  const usertype = JSON.parse(storedUserString);

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await APIClient.get(apis.Deptapprovallist);
      setDepartments(
        response.data.map((row, index) => ({ id: index + 1, did: row.did, dname: row.dname }))
      );
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to load departments");
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const columns = [
    { field: "id", headerName: "S.No", width: 200 },
    { field: "dname", headerName: "Department Name", width: 300 },
    {
      field: "edit",
      headerName: "View Details",
      width: 200,
      sortable: false,
      renderCell: (params) =>
        //1 === 1 || null ? ( // Check the user role here
        usertype === 2 || usertype === 4 ? (
          <Link to={"/Department/ApproverEdit/" + params.row.did}>
            <EditIcon style={{ cursor: "pointer" }} />
          </Link>
        ) : (
          // <DesignServicesIcon
          //     style={{ cursor: 'no-drop', color: 'red' }}
          //     disabled
          // />
          <Link to={"/Department/ApproverEdit/" + params.row.did}>
            <EditIcon style={{ cursor: "not-allowed", color: "gray" }} />
          </Link>
        ),
    },

  ];

  return (
    <div className="formdata">
    <div className="container mt-4">
      <nav>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">Home</li>
          <li className="breadcrumb-item">Department</li>
          <li className="breadcrumb-item active">Department Approval List</li>
        </ol>
      </nav>
      <h1 className="mb-3">Department Approval List</h1>

      <Box
                  sx={{ display: "flex", justifyContent: "center", gap: 5, my: 3 }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/Department/DepartmentForm"
                  >
                    <AddIcon /> New Department
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/Department/AllDepartment"
                  >
                    Back
                  </Button>
                  {/* <Button variant="contained" color="secondary" component={Link} to="">
                Course Publisher List
              </Button> */}
                </Box>

      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={departments}
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
          componentsProps={{ toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 500 } } }}
        />
      </Box>
      
      {/* <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <MuiAlert severity="success" onClose={() => setSnackbarOpen(false)}>
          {modalMessage}
        </MuiAlert>
      </Snackbar>
      <ToastContainer /> */}
    </div>
    </div>
  );
};

export default ApprovalList;
