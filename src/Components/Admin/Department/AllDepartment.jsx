import React, { useEffect, useState } from "react";
import { 
  Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  Snackbar, TextField 
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import APIClient from "../../../API/APIClient"; //../../../API/APIClient
import apis from "../../../API/API.json";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const AllDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const storedUserString = localStorage.getItem("usertype");
  const usertype = JSON.parse(storedUserString);

  useEffect(() => {
  
    async function fetchDepartments() {
      try {
        debugger;
        console.log("Fetching departments..."); // Debugging log
        const response = await APIClient.get(apis.getDepartments);
          const dataWithIds = response.data.map((row, index) => ({
            id: index + 1, 
            did: row.did, 
            dname: row.dname
          }));
          setDepartments(dataWithIds);
      } catch (error) {
        console.error("Error fetching departments:", error);
        if (isMounted) toast.error("Failed to load departments");
      }
    }
  
    fetchDepartments();
  }, []); // Empty dependency array ensures it runs only once
  
  

  // Handle delete click
  const handleDeleteClick = (department) => {
    setSelectedDepartment(department);
    setConfirmDialogOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    try {
      console.log(`Deleting department with ID: ${selectedDepartment.did}`);
      const response = await APIClient.delete(`${apis.deleteDepartment}/${selectedDepartment.did}`);
  
      if (response.status === 200) {
        setDepartments((prev) => prev.filter((dept) => dept.did !== selectedDepartment.did));
        toast.success("Department deleted successfully");
      } else {
        toast.error("Failed to delete department");
      }
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error(error.response?.data || "Failed to delete department");
    } finally {
      setConfirmDialogOpen(false);
    }
  };
  

  // Handle edit click
  const handleEditClick = (department) => {
    setSelectedDepartment(department);
    setUpdatedName(department.dname);
    setEditDialogOpen(true);
  };

  // Confirm edit
  const handleConfirmEdit = async () => {
    try {
      console.log(`Updating department: ${selectedDepartment.did}`);
      const updatedDepartment = { ...selectedDepartment, dname: updatedName };
  
      const response = await APIClient.put(`${apis.editDepartment}/${selectedDepartment.did}`, updatedDepartment);
  
      if (response.status === 200) {
        setDepartments((prev) =>
          prev.map((dept) => (dept.did === selectedDepartment.did ? updatedDepartment : dept))
        );
        toast.success("Department updated successfully");
      } else {
        toast.error("Failed to update department");
      }
    } catch (error) {
      console.error("Error updating department:", error);
      toast.error("Failed to update department");
    } finally {
      setEditDialogOpen(false);
    }
  };
  

  const columns = [
    { field: "id", headerName: "S.No", width: 150 },
    { field: "dname", headerName: "Department Name", width: 350 },
    {
      field: "edit",
      headerName: "Edit",
      width:200,
      sortable: false,
      renderCell: (params) =>
        //1 == 1 || null ? (
        usertype === 1 || usertype === 4 ? ( // Creator & Super Admin can edit
          <Link to={`/Department/EditDepartment/${params.row.did}`}>
            <EditIcon style={{ cursor: "pointer" }} />
          </Link>
        ) : (
          <EditIcon style={{ cursor: "not-allowed", color: "gray" }} />
        ),
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 100,
      sortable: false,
      renderCell: (params) =>
        usertype === 1 || usertype === 4 ? (
          //usertype === 1 || usertype === 4 ? (
          <DeleteIcon
            style={{ cursor: "pointer" , color: "red"}}
            onClick={() => handleDeleteClick(params.row)}
          />
        ) : (
          <DeleteIcon style={{ cursor: "not-allowed", color: "gray" }} />
      ),
    },
  ];

  return (
    <div className="row justify-content-center">
    <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">Home</li>
                <li className="breadcrumb-item">Department</li>
                <li className="breadcrumb-item active">
                  All Department List{" "}
                </li>
              </ol>
            </nav>
    <div>
      <div className="formdata">
        
        <h1 className="maintitle mt-0 pt-0">Department List</h1>
  
        <div className="">
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 5, mb: 2 }}>
        <Button variant="contained" color="primary" component={Link} to="/Department/DepartmentForm">
          <AddIcon /> New Department
        </Button>
        <Button variant="contained" color="primary" component={Link} to="/Department/ApprovalList">
          Department Approval List
        </Button>
        <Button variant="contained" color="secondary" component={Link} to="/Department/PublisherList">
          Department Publisher List
        </Button>
      </Box>

      <Box sx={{ height: 500, width: "100%" }} style={{ backgroundColor: "#fff" }}>
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
          componentsProps={{ toolbar: { showQuickFilter: true } }}
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this department?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">Cancel</Button>
          <Button onClick={handleConfirmDelete} color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Department</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Department Name"
            variant="outlined"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="primary">Cancel</Button>
          <Button onClick={handleConfirmEdit} color="primary">Save</Button>
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

export default AllDepartments;
