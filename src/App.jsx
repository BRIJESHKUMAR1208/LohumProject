import { useState } from "react";
//import { useLocation,useNavigate } from "react-router-dom"; // Import useLocation
import Sidebar from "./Components/Sidebar/Sidebar";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import Router from "./Routes/routes";
import "./App.css";

function App() {
  const [sidebarData, setSidebarData] = useState("");
  // const location = useLocation(); // Get the current route
  // const navigate = useNavigate();

  const handleSidebarDataChange = (data) => {
    setSidebarData(data);
  };
  return (
    <>
      <Sidebar data={sidebarData} />
      <div className="wrapper d-flex flex-column min-vh-100">
        <Header onDataChange={handleSidebarDataChange} />
        <Router />
        <Footer />
      </div>
    </>
  );
}

export default App;
