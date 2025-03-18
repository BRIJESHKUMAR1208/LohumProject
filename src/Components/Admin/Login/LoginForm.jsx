import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Link, useNavigate } from "react-router-dom";
//import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import APIClient from "../../../API/APIClient";
import apis from "../../../API/API.json";

const LoginForm = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  //const [captcha, setCaptcha] = useState("");
  const [dialogText, setDialogText] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  //const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate email
    // if (!emailRegex.test(user.email)) {
    //   setIsValidEmail(false);
    //   return;
    // }
    // Validate password
    if (!user.password || user.password.length < 6) {
      setIsValidPassword(false);
      return;
    }
    // Check CAPTCHA
    // if (!captcha) {
    //   alert("Please complete CAPTCHA verification");
    //   return;
    // }

    setLoading(true);

    try {
      const response = await APIClient.post(apis.getLogin, user, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        let token = response.data[0].token;
        let usertype = response.data[0].usertype;
        const email = response.data[0].email;
        const name = response.data[0].name;
        const user_id = response.data[0].user_id;
        //let usertype = dt.user;
        //let token = dt.token;
        console.log(token);
        console.log(usertype);
        localStorage.setItem("token", token);
        localStorage.setItem("usertype", usertype);
        localStorage.setItem("email", email);
        localStorage.setItem("name", name);
        localStorage.setItem("user_id", user_id);

        setDialogText("Login successful! Redirecting...");
        setOpenDialog(true);

        setTimeout(() => {
          setOpenDialog(false);
          navigate("/dashboard");
        }, 1500);
      }
    } catch (error) {
      setDialogText(
        error.response?.data?.message ||
          "Invalid credentials, please try again."
      );
      setOpenDialog(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ boxShadow: 3, borderRadius: 2, px: 4, py: 6, mt: 8 }}>
        <Typography component="h1" variant="h5" textAlign="center">
          Admin Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            fullWidth
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            error={!isValidEmail}
            helperText={!isValidEmail ? "Invalid email address" : ""}
          />
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            error={!isValidPassword}
            helperText={
              !isValidPassword ? "Password must be at least 6 characters" : ""
            }
          />
          {/* <ReCAPTCHA sitekey="your-site-key" onChange={setCaptcha} /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        <Link to="/ForgetPassword">Forgot Password?</Link>
      </Box>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Message</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogText}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LoginForm;
