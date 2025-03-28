import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuBookIcon from "@mui/icons-material/MenuBook"; // CMS
import ApartmentIcon from "@mui/icons-material/Apartment"; // Department
import SchoolIcon from "@mui/icons-material/School"; // Courses
import PersonIcon from "@mui/icons-material/Person"; // Candidates
import HotelIcon from "@mui/icons-material/Hotel"; // Hostels
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom"; // Rooms
import EventSeatIcon from "@mui/icons-material/EventSeat"; // Book Room
import BuildIcon from "@mui/icons-material/Build"; // Custom
import NewReleasesIcon from "@mui/icons-material/NewReleases"; // What's New
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify"; // Footer
import PanoramaIcon from "@mui/icons-material/Panorama"; // Banner
import AssignmentIcon from "@mui/icons-material/Assignment"; // Tenders
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive"; //Circulars
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; // User
import VisibilityIcon from '@mui/icons-material/Visibility';

const Sidebar = ({ data }) => {
  const [showhide, setShowHide] = useState("show");
  const [openDropdown, setOpenDropdown] = useState(null); // To track which dropdown is open
  //const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 991);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setShowSidebar(window.innerWidth >= 991);
  //   };
  //   handleResize();
  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, [data, showhide]);

  // const toggleSidebar = () => {
  //   setShowSidebar(!showSidebar);
  // };

  const [sidebarActive, setSidebarActive] = useState(false);

  // const[showhide,setshowhide]=useState(prevState => prevState === " " ? "show" : " ");

  //const [showhide, setShowHide] = useState("show"); // Initialize state to 'show' by default

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 991;
      setShowHide(isMobile ? (showhide === "show" ? "" : data) : data); // Set state based on window width and data prop
    };

    handleResize(); // Call once to set initial state

    // handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [data]); // Add 'data' to dependency array, not 'showhide'

  const toggleSidebar = () => {
    setShowHide(showhide === "show" ? "" : showhide); // Toggle between 'show' and empty string
  };

  const toggleDropdown = (key) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  return (
    <>
      <div
        id="sidebar"
        className={`sidebar ${showhide} sidebar-dark sidebar-fixed border-end`}
      >
        <div className="sidebar-header border-bottom">
          <div className="sidebar-brand">
            <Link to="/" className="sidebar-brand">
              <h2 className="logo-title">LOHUM</h2>
            </Link>
          </div>
          <button
            className="btn-close d-lg-none"
            type="button"
            onClick={toggleSidebar}
            aria-label="Close"
          ></button>
        </div>

        <ul className="sidebar-nav" data-coreui="navigation" data-simplebar>
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link">
              <DashboardIcon /> Dashboard
              <span className="badge badge-sm bg-info ms-auto">NEW</span>
            </Link>
          </li>

          {/* Dropdown: User Management */}
          <li className="nav-item">
            <button
              className="nav-link dropdown-toggle"
              onClick={() => toggleDropdown("user")}
            >
              <AccountCircleIcon /> USER
            </button>
            {openDropdown === "user" && (
              <ul className="nav-dropdown">
                <li>
                  <Link to="/User/CreateUser" className="nav-link">
                    Create User
                  </Link>
                </li>
                <li>
                  <Link to="/User/UserTable" className="nav-link">
                    User Table
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Dropdown: Menu Management */}
          <li className="nav-item">
            <button
              className="nav-link dropdown-toggle"
              onClick={() => toggleDropdown("menu")}
            >
              <MenuBookIcon /> CMS
            </button>
            {openDropdown === "menu" && (
              <ul className="nav-dropdown">
                <li>
                  <Link to="/CMS/CreateMenu" className="nav-link">
                    Create Menu
                  </Link>
                </li>
                <li>
                  <Link to="/SubMenu/CreateSubMenu" className="nav-link">
                    Create SubMenu
                  </Link>
                </li>
                <li>
                  <Link to="/MenuSubMenu/MenuSubMenu" className="nav-link">
                    Menu Table
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Dropdown: Department */}
          {/* <li className="nav-item">
            <button
              className="nav-link dropdown-toggle"
              onClick={() => toggleDropdown("department")}
            >
              <ApartmentIcon /> Department
            </button>
            {openDropdown === "department" && (
              <ul className="nav-dropdown">
                <li>
                  <Link to="/Department/DepartmentForm" className="nav-link">
                    Create Department
                  </Link>
                </li>
                <li>
                  <Link to="/Department/AllDepartment" className="nav-link">
                    Department List
                  </Link>
                </li>
              </ul>
            )}
          </li> */}

          {/* Dropdown: Courses */}
          {/* <li className="nav-item">
            <button
              className="nav-link dropdown-toggle"
              onClick={() => toggleDropdown("course")}
            >
              <SchoolIcon /> Courses
            </button>
            {openDropdown === "course" && (
              <ul className="nav-dropdown">
                <li>
                  <Link to="/Course/CreateCourse" className="nav-link">
                    Create Course
                  </Link>
                </li>
                <li>
                  <Link to="/Course/AllCourse" className="nav-link">
                    Course List
                  </Link>
                </li>
              </ul>
            )}
          </li> */}

          {/* Dropdown: Vision-Mission */}
          <li className="nav-item">
            <button
              className="nav-link dropdown-toggle"
              onClick={() => toggleDropdown("Vision-Mission")}
            >
                <VisibilityIcon /> Vision-Mission
            </button>
            {openDropdown === "Vision-Mission" && (
              <ul className="nav-dropdown">
                <li>
                  <Link to="/vision-mission" className="nav-link">
                    Create Vision-Mission
                  </Link>
                </li>
                <li>
                  <Link to="/VisionMissionList" className="nav-link">
                    Vision-Mission List
                  </Link>
                </li>
              </ul>
            )}
          </li>


           
          {/* Dropdown: Gallery */}
          <li className="nav-item">
            <button
              className="nav-link dropdown-toggle"
              onClick={() => toggleDropdown("Gallery")}
            >
              <HotelIcon /> Gallery
            </button>
            {openDropdown === "Gallery" && (
              <ul className="nav-dropdown">
                <li>
                  <Link to="/createGallery" className="nav-link">
                    Create Gallery
                  </Link>
                </li>
                <li>
                  <Link to="/GalleryList" className="nav-link">
                  Gallery List
                  </Link>
                </li>
              </ul>
            )}
          </li>
          {/* Dropdown: Rooms */}
          {/* <li className="nav-item">
            <button
              className="nav-link dropdown-toggle"
              onClick={() => toggleDropdown("room")}
            >
              <MeetingRoomIcon /> Rooms
            </button>
            {openDropdown === "room" && (
              <ul className="nav-dropdown">
                <li>
                  <Link to="/Rooms/CreateRoom" className="nav-link">
                    Create Room
                  </Link>
                </li>
                <li>
                  <Link to="/Rooms/AllRooms" className="nav-link">
                    Room List
                  </Link>
                </li>
              </ul>
            )}
          </li> */}

          {/* Dropdown: Book Room */}
          {/* <li className="nav-item">
            <button
              className="nav-link dropdown-toggle"
              onClick={() => toggleDropdown("bookroom")}
            >
              <EventSeatIcon /> Book Room
            </button>
            {openDropdown === "bookroom" && (
              <ul className="nav-dropdown">
                <li>
                  <Link to="/BookRoom/Bookroom" className="nav-link">
                    Book Room
                  </Link>
                </li>
                <li>
                  <Link to="/BookRoom/Bookroomlist" className="nav-link">
                    Book Room List
                  </Link>
                </li>
              </ul>
            )}
          </li> */}

          {/* Dropdown: Custom */}
          <li className="nav-item">
            <button
              className="nav-link dropdown-toggle"
              onClick={() => toggleDropdown("custom")}
            >
              <BuildIcon /> Custom
            </button>
            {openDropdown === "custom" && (
              <ul className="nav-dropdown">
                <li>
                  <Link to="/custom/custom" className="nav-link">
                    Custom
                  </Link>
                </li>
                <li>
                  <Link to="/custom/CustomTable" className="nav-link">
                    Custom Table
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Dropdown: Whats new */}
          {/* <li className="nav-item">
            <button
              className="nav-link dropdown-toggle"
              onClick={() => toggleDropdown("whatsnew")}
            >
              <NewReleasesIcon /> What's New
            </button>
            {openDropdown === "whatsnew" && (
              <ul className="nav-dropdown">
                <li>
                  <Link to="/WhatsNew/CreateWhatsNew" className="nav-link">
                    What's New
                  </Link>
                </li>
                <li>
                  <Link to="/WhatsNew/WhatsNewTable" className="nav-link">
                    What's New Table
                  </Link>
                </li>
              </ul>
            )}
          </li> */}

          {/* Dropdown: Footer */}
          <li className="nav-item">
            <button
              className="nav-link dropdown-toggle"
              onClick={() => toggleDropdown("footer")}
            >
              <FormatAlignJustifyIcon /> Footer
            </button>
            {openDropdown === "footer" && (
              <ul className="nav-dropdown">
                <li>
                  <Link
                    to="/CMSFooter/CreateFooter/CreateFooterDec"
                    className="nav-link"
                  >
                    Footer Description
                  </Link>
                </li>
                <li>
                  <Link
                    to="/CMSFooter/CreateFooter/CreateFooterAddress"
                    className="nav-link"
                  >
                    Footer Address
                  </Link>
                </li>
                <li>
                  <Link
                    to="/CMSFooter/CreateFooter/CreateFooterServices"
                    className="nav-link"
                  >
                    Footer Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/CMSFooter/CreateFooter/CreateFooterData"
                    className="nav-link"
                  >
                    Footer Data
                  </Link>
                </li>
                <li>
                  <Link
                    to="/CMSFooter/FooterTable/FooterTable"
                    className="nav-link"
                  >
                    Footer Table
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Dropdown: Banner */}
          <li className="nav-item">
            <button
              className="nav-link dropdown-toggle"
              onClick={() => toggleDropdown("banner")}
            >
              <PanoramaIcon /> Banner
            </button>
            {openDropdown === "banner" && (
              <ul className="nav-dropdown">
                <li>
                  <Link to="/Banner/Banner" className="nav-link">
                    Create Banner
                  </Link>
                </li>
                <li>
                  <Link to="/bannerdata" className="nav-link">
                    Banner Table
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Dropdown: Tender */}
          {/* <li className="nav-item">
            <button
              className="nav-link dropdown-toggle"
              onClick={() => toggleDropdown("tender")}
            >
              <AssignmentIcon /> Tenders
            </button>
            {openDropdown === "tender" && (
              <ul className="nav-dropdown">
                <li>
                  <Link to="/CreateTender/Createtender" className="nav-link">
                    Tender Form
                  </Link>
                </li>
                <li>
                  <Link to="/TenderTable/TenderTable" className="nav-link">
                    Tender Table
                  </Link>
                </li>
              </ul>
            )}
          </li> */}

          {/* Dropdown: Circular */}
          {/* <li className="nav-item">
            <button
              className="nav-link dropdown-toggle"
              onClick={() => toggleDropdown("circular")}
            >
              <NotificationsActiveIcon /> Circulars
            </button>
            {openDropdown === "circular" && (
              <ul className="nav-dropdown">
                <li>
                  <Link to="/Circular/CircularForm" className="nav-link">
                    Circular Form
                  </Link>
                </li>
                <li>
                  <Link to="/Circular/CircularTable" className="nav-link">
                    Circular Table
                  </Link>
                </li>
              </ul>
            )}
          </li> */}

          {/* Dropdown: LogoSidebar */}
          <li className="nav-item">
            <button
              className="nav-link dropdown-toggle"
              onClick={() => toggleDropdown("logoSlider")}
            >
              <NotificationsActiveIcon /> Logo Slider
            </button>
            {openDropdown === "logoSlider" && (
              <ul className="nav-dropdown">
                <li>
                  <Link to="/logoSlider/LogoSliderForm" className="nav-link">
                    Logo Slider Form
                  </Link>
                </li>
                <li>
                  <Link to="/logoSlider/LogoSliderTable" className="nav-link">
                    Logo Slider Table
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>

        <div className="sidebar-footer border-top d-none d-md-flex">
          <button
            className="sidebar-toggler"
            onClick={toggleSidebar}
            type="button"
            data-coreui-toggle="unfoldable"
          ></button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
