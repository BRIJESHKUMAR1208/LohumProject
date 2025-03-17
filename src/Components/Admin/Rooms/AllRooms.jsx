import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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

const AllRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [hostels, setHostels] = useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const storedUserString = localStorage.getItem("usertype");
  const usertype = JSON.parse(storedUserString);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await APIClient.get(apis.getHostels);
        const hostelsMap = response.data.reduce((acc, hostel) => {
          acc[hostel.hid] = hostel.hname;
          return acc;
        }, {});
        setHostels(hostelsMap);
      } catch (error) {
        console.error("Error fetching hostels:", error);
      }
    };

    const fetchRooms = async () => {
      try {
        const response = await APIClient.get(apis.getRooms);
        setRooms(
          response.data.map((room,index) => ({
            rid: index + 1,
            id: room.id,
            name: room.name,
            hostalName: hostels[room.hostalid] || "Unknown",
          }))
        );
      } catch (error) {
        console.error("Error fetching rooms:", error);
        toast.error("Failed to load rooms");
      }
    };

    fetchHostels().then(fetchRooms);
  }, [hostels]);

  const handleDeleteClick = (room) => {
    setSelectedRoom(room);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await APIClient.post(
        `${apis.deleteRoom}/${selectedRoom.id}`,
        null,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        setRooms((prev) => prev.filter((room) => room.id !== selectedRoom.id));
        toast.success("Room deleted successfully");
      } else {
        toast.error("Failed to delete room");
      }
    } catch (error) {
      console.error("Error deleting room:", error);
      toast.error(error.response?.data || "Failed to delete room");
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  const columns = [
    { field: "rid", headerName: "Sr. No.", width: 100 },
    { field: "name", headerName: "Room Name", width: 250 },
    { field: "hostalName", headerName: "Hostel Name", width: 250 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <div>
        <Buttons
    variant="outline-primary"
    size="sm"
    as={Link}
    to={`/Room/EditRoom/${params.row.id}`}
    onClick={(e) => {
      if (!(usertype === 1 || usertype === 4)) {
        e.preventDefault(); // Prevent navigation for unauthorized users
      }
    }}
    style={{
      opacity: usertype === 1 || usertype === 4 ? 1 : 0.5, // Visually disable for unauthorized users
      pointerEvents: "auto", // Ensure click event still fires
    }}
  >
    <EditIcon style={{ cursor: usertype === 1 || usertype === 4 ? "pointer" : "not-allowed" }} />
  </Buttons>

  <Buttons
    variant="outline-danger"
    size="sm"
    style={{
      marginLeft: 8,
      opacity: usertype === 1 || usertype === 4 ? 1 : 0.5, // Make it visually disabled for unauthorized users
      pointerEvents: "auto", // Ensure click event still fires
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
      ),
    },
  ];

  return (
    <main id="main" className="main">
    <div className="row justify-content-center">
    <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">Home</li>
                <li className="breadcrumb-item">Room</li>
                <li className="breadcrumb-item active">
                  All Room List{" "}
                </li>
              </ol>
            </nav>
      <div className="formdata">
      {/* <div className="header-box"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px",
        }}
      > 
       <h1 className="maintitle">Room List</h1>
        <Link
          to="/Rooms/CreateRoom"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Button variant="primary">
            <AddIcon /> New Room
          </Button>
        </Link>
      </div> */}
      <h1 className="maintitle mt-0 pt-0">Room List</h1>
      <div className="">
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 5, mb: 2 }}>
      <Button variant="contained" color="primary" component={Link} to="/Rooms/CreateRoom">
          <AddIcon /> New Room
        </Button>
        <Button variant="contained" color="primary" component={Link} to="/Approvalroomlist">
           Room Approval List
        </Button>
        <Button variant="contained" color="secondary" component={Link} to="/Publisherroomlist">
           Room Publisher List
        </Button>
      </Box>

      <Box
        sx={{ height: 600, width: "100%" }}
        style={{ backgroundColor: "#fff", padding: "16px" }}
      >
        <DataGrid
          rows={rooms}
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

      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this room?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Confirm
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
      </div>
    </main>
  );
};

export default AllRooms;
