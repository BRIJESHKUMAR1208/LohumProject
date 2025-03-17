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

//import AddIcon from '@mui/icons-material/Add';
//import DesignServicesIcon from '@mui/icons-material/DesignServices';
import Alert from "@mui/material/Alert";
// import './WhatsNewTable.scss'

import APIClient from "../../../API/APIClient";
import apis from "../../../API/API.json";

const CustomTable = () => {
  const [apiData, setApiData] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const storedUserString = localStorage.getItem("usertype");
  const usertype = JSON.parse(storedUserString);

  const columns = [
    { field: "id1", headerName: "S.No", width: 50 },
    { field: "menuname", headerName: "Title", width: 200 },
    // { field: "u_internal_link", headerName: "Internal Link",width: 120 },
    // { field: "u_external_link", headerName: "External Link",width: 120 },
    { field: "menuurl", headerName: "Menu Url", width: 200 },
    {
      field: "edit",
      headerName: "Edit",
      sortable: false,
      renderCell: (params) =>
        usertype === 1 || usertype === 4 ? (
          <Link to={"/custom/Editcustomdata/" + params.row.id}>
            <EditIcon style={{ cursor: "pointer" }} />
          </Link>
        ) : (
          <Link to={"/custom/Editcustomdata/" + params.row.id}>
            <EditIcon style={{ cursor: "not-allowed", color: "gray" }} />
          </Link>
        ),
    },
    {
      field: "delete",
      headerName: "Delete",
      sortable: false,
      renderCell: (params) =>
        usertype === 1 || usertype === 4 ? (
          //user.r_usertype !== 2 || null ? (
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
      await APIClient.post("/api/TopMenu/delete/" + selectedItem.id);
      setApiData((prevData) =>
        prevData.filter((item) => item.id !== selectedItem.id)
      );
      setIsDeleting(false);
      setModalMessage("Data deleted successfully");
      // setSnackbarOpen(true);
      setTimeout(() => {
        setSuccessDialogOpen(true);
      }, 1000);
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
        const response = await APIClient.get(apis.Getallcustom);
        const dataWithIds = response.data.map((row, index) => ({
          id1: index + 1,
          ...row,
          menu_url: `/menu/${row.menu_url}`,
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
        <div className="pagetitle">
         
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">Home</li>
              <li className="breadcrumb-item">Custom</li>
              <li className="breadcrumb-item active">Custom Table </li>
            </ol>
          </nav>
          <h2 className="maintitle">Custom Table</h2>
        </div>
     
        <Box sx={{ height: 400, width: "100%", backgroundColor: "white" }}>
        <div className="d-flex justify-content-left" style={{ marginLeft: "1px" }}>
            <Link to="/custom/custom">
              <button
                type="button"
                className="btn btn-info"
                style={{
                  color: "white",
                  backgroundColor: "blue",
                  marginRight: 10,
                }}
              >
                Add New
              </button>
            </Link>
            <Link to="/custom/custom">
              <button
                type="button"
                className="btn btn-info"
                style={{ color: "white", backgroundColor: "blue", width: 90 }}
              >
                Back
              </button>
            </Link>
           
            <Link to="/customapproval">
              <button type="button" className="btn btn-primary" style={{ color: "white", backgroundColor: "blue",marginLeft: "10px" }}>
                approval list
              </button>
            </Link>
            <Link to="/custompublisher">
              <button type="button" className="btn btn-primary" style={{ color: "white", backgroundColor: "blue",marginLeft: "10px" }}>
               publisher  list
              </button>
            </Link> 
          </div>
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
      <Dialog
        open={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
      >
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <Alert severity="success">Data deleted successfully!</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccessDialogOpen(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    </div>
  );
};

export default CustomTable;
