import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import APIClient from "../../../../API/APIClient";
import apis from "../../../../API/API.json";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";

const PublisherList = () => {
  const [departments, setDepartments] = useState([]);
  const storedUserString = localStorage.getItem("usertype");
  const usertype = JSON.parse(storedUserString);

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await APIClient.get(apis.Deptpublisherlist);
      const formattedData = response.data.map((row, index) => ({
        id: index + 1,
        did: row.did,
        dname: row.dname,
      }));
      setDepartments(formattedData);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to load departments.");
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
          <Link to={"/Department/PublishDeptEdit/" + params.row.did}>
            <EditIcon style={{ cursor: "pointer" }} />
          </Link>
        ) : (
          <Link to={"/Department/PublishDeptEdit/"+params.row.did}>
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
            <li className="breadcrumb-item active">Department Publish List</li>
          </ol>
        </nav>
        <h1 className="mb-3">Department Publish List</h1>

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
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 500 } },
            }}
          />
        </Box>
      </div>
    </div>
  );
};

export default PublisherList;
