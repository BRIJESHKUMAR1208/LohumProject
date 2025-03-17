import { useState, useEffect } from "react";
import APIClient from "../../../../API/APIClient";
import apis from "../../../../API/API.json";
import { Link, useParams } from "react-router-dom";
import EditFooterServices from "./EditFooterServices";
import EditFooterData from "./EditFooterData";
import EditFooterDec from "./EditFooterDec";
import EditFooterAddress from "./EditFooterAddress";

const IndexEditFooter = () => {
  const [data, setData] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await APIClient.get(apis.getfooterbyid + id);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchData();
  }, [id]);
  return (
    <div>
      <div>
        <div>
          <main id="main" className="main">
            <div className="pagetitle">
              {/* <h1>Create Footer</h1> */}
              <nav>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">Home</li>
                  <li className="breadcrumb-item">Footer</li>
                  <li className="breadcrumb-item active">
                    Edit Footer 
                  </li>
                </ol>
              </nav>
            </div>
           
            {data.footertype === 1 && <EditFooterDec />}
            {data.footertype === 2 && <EditFooterServices />}
            {data.footertype === 3 && <EditFooterAddress />}
            {data.footertype === 4 && <EditFooterData />}
          </main>
        </div>
      </div>
    </div>
  );
};

export default IndexEditFooter;
