import { useState, useEffect } from "react";
import EditMenu from "../../Admin/EditMenuSubmeu/EditMenu";
import Publishdata from "../EditMenuSubmeu/Publishdata";
import EditSubmenu from "../EditMenuSubmeu/EditSubmenu";
import Publishsubmenudata  from "../EditMenuSubmeu/Publishsubmenu"
import { Link, useParams } from "react-router-dom";
import APIClient from "../../../API/APIClient";
import apis from "../../../API/API.json";

const Publishindex = () => {
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
    <div>
      <main id="main" className="main">
        <div className="pagetitle">
          {/* <h1>Edit Menu</h1> */}
          {/* <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">Dashboard</li>
              <li className="breadcrumb-item  ">CMS</li>
              <li className="breadcrumb-item active ">Edit Menu</li>
            </ol>
          </nav> */}
        </div>
        <div className="pagetitle-rgt">
          {/* <Link to="/cms/allmenu">
            <button type="button" className="btn btn-info">
              Back
            </button>
          </Link> */}
        </div>

        <div>
          <div>
            {data.submenu_id === 0 && <Publishdata />}
            {data.submenu_id !== 0 && <Publishsubmenudata />}
          </div>
        </div>
      </main>
    </div>
  );
};
export default Publishindex;
