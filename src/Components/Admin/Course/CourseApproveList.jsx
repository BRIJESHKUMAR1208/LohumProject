import React, { useEffect, useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  TextField,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import APIClient from "../../../API/APIClient";
import apis from "../../../API/API.json";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
//import DeleteIcon from "@mui/icons-material/Delete";

//  Move CustomToolbar function ABOVE UserTable
// const CustomToolbar = () => (
//   <GridToolbarContainer>
//     <GridToolbarQuickFilter sx={{ marginRight: "auto" }} /> {/*  Search bar */}
//     <GridToolbarExport /> {/*  Export button */}
//   </GridToolbarContainer>
// );
import { Button as Buttons } from "react-bootstrap";

const CourseApproveList = () => {
  const [courses, setCourses] = useState([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedDetails, setUpdatedDetails] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Fetch courses on mount
  useEffect(() => {
    async function fetchCourses() {
      try {
        //debugger;
        console.log(apis.getCourses);
        const response = await APIClient.get(apis.getApproveCourses);
        // Map API response to include an "id" field for DataGrid
        const dataWithIds = response.data.map((row, index) => ({
          //id: index,         // For DataGrid internal use
          srno: index + 1, // For display purposes
          id: row.id, // Course ID from the backend
          name: row.name,
          coursedetails: row.coursedetails,
          dname: row.dname, // Assuming a joined department name
        }));
        setCourses(dataWithIds);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Failed to load courses");
      }
    }
    fetchCourses();
  }, []);

  // Handle Delete
  

  

  // Handle Edit
  const handleEditClick = (course) => {
    setSelectedCourse(course);
    setUpdatedName(course.name);
    setUpdatedDetails(course.coursedetails);
    setEditDialogOpen(true);
  };

  const handleConfirmEdit = async () => {
    try {
      const updatedCourse = {
        ...selectedCourse,
        name: updatedName,
        coursedetails: updatedDetails,
      };
      const response = await APIClient.post(
        `${apis.editCourse}/${selectedCourse.id}`,
        updatedCourse
      );
      if (response.status === 200) {
        setCourses((prev) =>
          prev.map((course) =>
            course.id === selectedCourse.id ? updatedCourse : course
          )
        );
        toast.success("Course updated successfully");
      } else {
        toast.error("Failed to update course");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Failed to update course");
    } finally {
      setEditDialogOpen(false);
    }
  };

  // Define columns for DataGrid, including Edit and Delete operation columns
  const columns = [
    { field: "srno", headerName: "Sr. No.", width: 70 },
    { field: "name", headerName: "Course Name", width: 200 },
    { field: "coursedetails", headerName: "Course Description", width: 225 },
    // { field: "deptid", headerName: "Department", width: 200 },
    { field: "dname", headerName: "Department Name", width: 200 },
    {
      field: "edit",
      headerName: "Edit",
      sortable: false,
      width: 100,
      renderCell: (params) => (
        <Button color="primary">
          <Link
            to={`/Course/EditCourseApprove/${params.row.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <EditIcon style={{ cursor: "pointer" }} />
          </Link>
        </Button>
      ),
    },
    
  ];

  return (
    <div className="row justify-content-center">
      <nav>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">Home</li>
          <li className="breadcrumb-item">Course</li>
          <li className="breadcrumb-item active">Course Approval List </li>
        </ol>
      </nav>
      <div className="formdata">
        <h1 className="maintitle mt-0 pt-0">Course Approval List</h1>
        <div className="">
          {/* <Link to="/Course/CreateCourse" className="header-box-rgt">
          <p>
            <AddIcon /> New Course
          </p>
        </Link>
      </div> */}
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 5, my: 3 }}
          >
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/Course/CreateCourse"
            >
              <AddIcon /> New Course
            </Button>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/Course/AllCourse"
            >
              Back
            </Button>
            {/* <Button variant="contained" color="secondary" component={Link} to="">
          Course Publisher List
        </Button> */}
          </Box>

          <Box
            sx={{ height: 500, width: "100%" }}
            style={{ backgroundColor: "#fff" }}
          >
            <DataGrid
              rows={courses}
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
        </div>
        

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle>Edit Course</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Course Name"
              fullWidth
              variant="standard"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Course Description"
              fullWidth
              variant="standard"
              value={updatedDetails}
              onChange={(e) => setUpdatedDetails(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmEdit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
        >
          <ToastContainer />
        </Snackbar>
      </div>
    </div>
  );
};

export default CourseApproveList;
