import { useState, useEffect } from "react";
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

const Header = ({ onDataChange = () => {} }) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth < 991) {
      onDataChange((prev) => (prev === "show" ? "" : "show"));
    } else {
      onDataChange((prev) => (prev === "hide" ? "" : "hide"));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handlePasswordChange = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/changepassword");
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        width: "100%", // Full width
        background: "#d3d3d3",
        color:"#172C73",
        transition: "0.3s",
        boxShadow: hasScrolled ? 3 : 0,
        left: 0,
        minHeight: { xs: "30px", sm: "40px" }, // Responsive height
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          minHeight: { xs: "30px", sm: "40px" }, // Responsive Toolbar height
          padding: { xs: "0 8px", sm: "0 16px" }, // Adjust padding for small screens
        }}
      >
        {/* Sidebar Toggle Button */}
        <IconButton 
          edge="start" 
          color="inherit" 
          onClick={toggleSidebar}
          sx={{ padding: { xs: "4px", sm: "8px" } }} // Reduce padding on small screens
        >
          <MenuIcon fontSize="small" />
        </IconButton>

        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            textAlign: "center",
            fontSize: { xs: "12px", sm: "16px" }, // Adjust font size
          }}
        >
        LOHUM
        </Typography>

        {/* User Profile Menu */}
        <Box>
          <IconButton 
            color="inherit" 
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ padding: { xs: "4px", sm: "8px" } }} // Reduce padding on small screens
          >
            <AccountCircleIcon fontSize="small" />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={handlePasswordChange}>Change Password</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
