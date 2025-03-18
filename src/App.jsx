import { useState, useEffect } from "react";
import { useLocation,useNavigate } from "react-router-dom"; // Import useLocation
import Sidebar from "./Components/Sidebar/Sidebar";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import Router from "./Routes/routes";
import "./App.css";

function App() {
  const [sidebarData, setSidebarData] = useState("");
   const location = useLocation(); // Get the current route
   const navigate = useNavigate();

  const handleSidebarDataChange = (data) => {
    setSidebarData(data);
  };

  const token = localStorage.getItem("token");
  const isLoginPage = location.pathname === "/";

  // Redirect to login if no token is found (except on login page)
  useEffect(() => {
    if (!token && !isLoginPage) {
      navigate("/");
      //window.location.replace("/");
    }
  }, [token, isLoginPage]);

  if (!token && !isLoginPage) {
    return null; // Prevents unwanted page flashes
  }


  return (
    <>
      {!isLoginPage && <Sidebar data={sidebarData} />}
      <div className="wrapper d-flex flex-column min-vh-100">
        {!isLoginPage && <Header onDataChange={handleSidebarDataChange} />}
        <Router />
        {!isLoginPage && <Footer />}
      </div>
    </>
  );
}

export default App;
