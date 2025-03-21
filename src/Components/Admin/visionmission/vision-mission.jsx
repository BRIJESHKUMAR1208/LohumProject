import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Box,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

const VisionMissionForm = () => {
  const [header, setHeader] = useState("");
  const [headerDescription, setHeaderDescription] = useState("");
  const [headerImg, setHeaderImg] = useState(null);
  const [visionMissionDetails, setVisionMissionDetails] = useState([]);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [titlePara, setTitlePara] = useState("");

  const handleAddVisionMission = () => {
    if (image && title && titlePara) {
      setVisionMissionDetails([
        ...visionMissionDetails,
        { image, title, titlePara },
      ]);
      setImage(null);
      setTitle("");
      setTitlePara("");
    }
  };

  const handleDelete = (index) => {
    const updatedDetails = visionMissionDetails.filter((_, i) => i !== index);
    setVisionMissionDetails(updatedDetails);
  };

  return (
    <div>
      <main id="main" className="main">
        <div className="formdata">
          <Card>
            <CardContent>
              <form>
                <h2>Vision Mission Form</h2>
                <Paper sx={{ padding: 2, marginBottom: 2 }}>
                  <TextField
                    fullWidth
                    label="Header"
                    value={header}
                    onChange={(e) => setHeader(e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Header Description"
                    value={headerDescription}
                    onChange={(e) => setHeaderDescription(e.target.value)}
                    margin="normal"
                  />
                  {/* <label>Header Image</label> */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setHeaderImg(e.target.files[0])}
                    style={{ display: "none" }}
                    id="header-img-upload"
                  />
                  <label htmlFor="header-img-upload">
                    <Button variant="outlined" component="span">
                      <AddPhotoAlternateIcon /> Choose Image
                    </Button>
                  </label>
                  {headerImg && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: 2,
                      }}
                    >
                      <img
                        width="100"
                        height="100"
                        style={{
                          maxWidth: "100px",
                          maxHeight: "100px",
                          objectFit: "cover",
                        }}
                        src={URL.createObjectURL(headerImg)}
                      />
                    </Box>
                  )}
                </Paper>
                <Divider sx={{ marginY: 2 }} />
                <Paper sx={{ padding: 2 }}>
                  <h3>Vision Mission Details</h3>
                  <TextField
                    fullWidth
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Title Paragraph"
                    value={titlePara}
                    onChange={(e) => setTitlePara(e.target.value)}
                    margin="normal"
                  />
                  {/* <label>Image</label> */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    style={{ display: "none" }}
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Button variant="outlined" component="span">
                      <AddPhotoAlternateIcon /> Choose Image
                    </Button>
                  </label>{" "}
                  <br />
                  {image && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: 2,
                      }}
                    >
                      <img
                        width="100"
                        height="100"
                        style={{
                          maxWidth: "100px",
                          maxHeight: "100px",
                          objectFit: "cover",
                        }}
                        src={URL.createObjectURL(image)}
                      />
                    </Box>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddVisionMission}
                    sx={{ marginTop: 2 }}
                  >
                    Add
                  </Button>
                  <br />
                </Paper>
                {visionMissionDetails.length > 0 && (
                  <Table>
                    <TableHead sx={{ backgroundColor: "#FFE2E2" }}>
                      <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Title Paragraph</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {visionMissionDetails.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <img
                              width="50"
                              height="50"
                              style={{ objectFit: "cover" }}
                              src={URL.createObjectURL(item.image)}
                            />
                          </TableCell>
                          <TableCell>{item.title}</TableCell>
                          <TableCell>{item.titlePara}</TableCell>
                          <TableCell>
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </form>
            </CardContent>
            <Button variant="contained" color="primary" sx={{ margin: 2 }}>
              Submit
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default VisionMissionForm;
