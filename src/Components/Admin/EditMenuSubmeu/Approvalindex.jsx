import { useState, useEffect } from "react";
import EditMenu from "../../Admin/EditMenuSubmeu/EditMenu";
import Approvedata from "./approvedata";
import EditSubmenu from "../EditMenuSubmeu/EditSubmenu";
import Approvesubmenudata  from "../EditMenuSubmeu/Approvesubmenu.jsx"
import { Link, useParams } from "react-router-dom";
import APIClient from "../../../API/APIClient";
import apis from "../../../API/API.json";

const Approvaledit = () => {
  const [data, setData] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    async function fetchData2() {
      try {
        const response = await APIClient.get(apis.getmenudatabyid + id);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchData2();
  }, [id]);

  return (
    <div className="row justify-content-center">
    <div className="formdata">
  
    <div className="card-body">
        <div>
          <div>
            {data.submenu_id === 0 && <Approvedata />}
            {data.submenu_id !== 0 && <Approvesubmenudata />}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
export default Approvaledit;
