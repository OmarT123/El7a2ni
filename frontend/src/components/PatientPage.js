import React, { useState, useEffect, useRef } from "react";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import axios from "axios";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import html2pdf from "html2pdf.js";
import UploadIcon from "@mui/icons-material/Upload";
import {
  Button,
  TextField,
  Box,
  Avatar,
  InputLabel,
  Input,
  Select,
  MenuItem,
  Fab,
} from "@mui/material";
import { Container, Grid } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";

const buttonStyle = {
  backgroundColor: "#1976D2",
  color: "#fff",
  borderRadius: "50%",
  width: "56px",
  height: "56px",
  cursor: "pointer",
  marginTop: "20px",
  "&:hover": {
    backgroundColor: "#1565C0",
  },
};
const iconStyle = {
  fontSize: "2rem",
};

const pdfStyle = {
  display: "none",
};

const PatientPage = ({
  selectedPatient,
  setSelectedPatient,
  setAlert,
  userType,
}) => {
  const [healthRecords, setHealthRecords] = useState(null);
  const [expandUpload, setExpandUpload] = useState(false);
  const [uploadedHealthRecord, setUploadedHealthRecord] = useState("");
  const [prescriptions, setPrescriptions] = useState(null);
  const [medicine, setMedicine] = useState(null);
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [showResetButton, setShowResetButton] = useState(false);
  const [addMedicineExpanded, setAddMedicineExpanded] = useState("");

  const handleFilterExpandClick = () => {
    setFilterExpanded(!filterExpanded);
  };

  const handleAddMedicineExpanded = (item) => {
    console.log(item._id, addMedicineExpanded);
    setAddMedicineExpanded(item._id === addMedicineExpanded ? null : item._it);
  };

  const addPresriptionItemstoCart = async (e, prescription) => {
    e.preventDefault();
    const body = { prescription: prescription };
    const response = await axios.post("/addPrescriptionToCart", body);
    setAlert({ title: "", message: response.data.message });
    fetchPrescriptions();
  };

  const PrescriptionItem = ({ prescription, number }) => {
    const [selectedMedicineId, setSelectedMedicineId] = useState("");

    const prescriptionItemRef = useRef();

    const downloadPrescription = async () => {
      // Hide buttons before generating PDF
      const buttons = document.querySelectorAll(".exclude-from-pdf");
      buttons.forEach((button) => {
        button.style.display = "none";
      });

      const content = prescriptionItemRef.current;

      const pdfOptions = {
        margin: 10,
        filename: "Prescription.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      // Generate PDF
      const pdf = await html2pdf().from(content).set(pdfOptions).save();

      // Show buttons again after generating PDF
      buttons.forEach((button) => {
        button.style.display = "block";
      });
    };

    const handleAddMedicine = async (e) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      if (selectedMedicineId && data.get("dosage")) {
        try {
          const response = await axios.post("/addToPrescription", {
            prescriptionId: prescription._id,
            medId: selectedMedicineId,
            dosage: data.get("dosage"),
          });
          if (response.data.success) {
            setAlert(response.data);
            fetchPrescriptions();
          }
        } catch (error) {
          console.error(
            "Error adding medicine to prescription:",
            error.message
          );
        }
      } else {
        setAlert({
          title: "Incomplete Data",
          message: "Please select both medicine and dosage.",
        });
      }
    };
    const MedicineItem = ({ med, index }) => {
      const [newDosage, setNewDosage] = useState("");

      const handleDosageUpdate = async (e, medicineId) => {
        e.preventDefault();
        const newDosageObj = {
          dosage: newDosage,
          medicineId,
          prescriptionId: prescription._id,
        };
        const response = await axios.put("/addDosage", newDosageObj);
        if (response.data.success) {
          fetchPrescriptions();
        } else {
          setAlert({
            title: "Something went Wrong",
            message: "Please try again at a later time",
          });
        }
      };
      const handleDeleteMedicine = async (e, prescriptionId, medId) => {
        e.preventDefault();
        try {
          const response = await axios.post("/deleteFromPrescription", {
            prescriptionId,
            medId,
          });
          if (response.data.success) {
            setAlert(response.data);
            fetchPrescriptions();
          } else {
            setAlert({
              title: "Something went Wrong",
              message: "Please try again at a later time",
            });
          }
        } catch (error) {
          console.error(
            "Error deleting medicine from prescription:",
            error.message
          );
        }
      };

      return (
        <ListItem key={index}>
          <Grid container spacing={2} alignItems={"center"}>
            <Grid item xs={12} sm={3}>
              {med.dosage}x {med.medId.name}
            </Grid>
            {userType === "doctor" && (
              <>
                {" "}
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    value={newDosage}
                    type="number"
                    onChange={(e) => setNewDosage(e.target.value)}
                    label="New Dosage"
                    className="exclude-from-pdf"
                  />
                </Grid>
                <Grid item sm={2} />
                <Grid item xs={12} sm={2}>
                  <Button
                    variant="contained"
                    onClick={(e) => handleDosageUpdate(e, med.medId._id)}
                    className="exclude-from-pdf"
                  >
                    Update
                  </Button>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    variant="contained"
                    onClick={(e) => {
                      handleDeleteMedicine(e, prescription._id, med.medId._id);
                    }}
                    className="exclude-from-pdf"
                  >
                    Delete
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </ListItem>
      );
    };

    return (
      <Paper
        ref={prescriptionItemRef}
        sx={{ padding: "20px", display: "flex", flexDirection: "column" }}
      >
        {prescription.filled && (
          <Button className="exclude-from-pdf" onClick={downloadPrescription}>
            Download
          </Button>
        )}
        <Typography variant="h5">Prescription {number + 1}:</Typography>
        {!prescription.filled && (
          <Typography variant="substitute1">Not Filled</Typography>
        )}
        <Typography variant="substitute1">
          Date: {prescription.createdAt.substr(0, 10)}
        </Typography>
        <List>
          {prescription &&
            prescription.medicines &&
            prescription.medicines.map((med, index) => (
              <>
                <MedicineItem med={med} index={index} />
              </>
            ))}
          {prescription && prescription.doctor && (
            <Typography variant="h5">
              Doctor name: {prescription.doctor.name}
            </Typography>
          )}
          {prescription.sentToPharmacy && prescription.filled && (
            <Typography variant="substitute1">
              This prescription has been sent to cart before.
            </Typography>
          )}
          {!prescription.sentToPharmacy && prescription.filled && (
            <Button
              variant="contained"
              sx={{ mt: "10px" }}
              onClick={(e) => addPresriptionItemstoCart(e, prescription._id)}
            >
              Add Prescription Items to Cart
            </Button>
          )}
        </List>
        {userType === "doctor" && (
          <>
            <Button
              variant="contained"
              sx={{ mt: "10px" }}
              className="exclude-from-pdf"
              onClick={(e) => handleAddMedicineExpanded(prescription)}
            >
              {prescription.filled ? "Add Medicine" : "Fill Prescription"}
            </Button>
              <Grid
                container
                spacing={3}
                sx={{ mt: 2 }}
                component="form"
                noValidate
                onSubmit={handleAddMedicine}
              >
                <Grid item xs={12} sm={6}>
                  <InputLabel id="select-label">Select Option</InputLabel>
                  <Select
                    fullWidth
                    labelId="select-label"
                    id="select"
                    value={selectedMedicineId}
                    onChange={(e) => setSelectedMedicineId(e.target.value)}
                    label="Select Medicine"
                  >
                    {medicine &&
                      medicine.map((med) => (
                        <MenuItem value={med._id} sx={{ maxHeight: "50px" }}>
                          <img
                            src={med.picture}
                            height="40px"
                            width="50px"
                            style={{ marginRight: "30px" }}
                          />{" "}
                          {med.name}
                        </MenuItem>
                      ))}
                  </Select>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="dosage"
                    type="number"
                    label="Dosage"
                    name="dosage"
                    sx={{ mt: 3 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button variant="contained" type="submit">
                    Add
                  </Button>
                </Grid>
              </Grid>
          </>
        )}
      </Paper>
    );
  };

  function convertToBase64(type, c) {
    //Read File
    var selectedFile = document.getElementById("inputFile" + c).files;
    //Check File is not Empty
    if (selectedFile.length > 0) {
      // Select the very first file from list
      var fileToLoad = selectedFile[0];
      // FileReader function for read the file.
      var fileReader = new FileReader();
      var base64;
      // Onload of file read the file content
      fileReader.onload = function (fileLoadedEvent) {
        base64 = fileLoadedEvent.target.result;
        setUploadedHealthRecord(base64);
      };
      // Convert data to base64
      fileReader.readAsDataURL(fileToLoad);
    }
  }

  const addHealthRecord = async () => {
    if (uploadedHealthRecord.substring(0, 20) !== "data:application/pdf")
      setAlert({
        title: "Incorrect File Type",
        message: "Please upload your documents in the PDF format only.",
      });
    else {
      const body = { id: selectedPatient._id, base64: uploadedHealthRecord };
      const response = await axios.put(
        "/uploadHealthRecord?id=" + selectedPatient._id,
        body
      );
      if (response.data.success) {
        setAlert(response.data);
        fetchHealthRecords();
      } else {
        setAlert({
          title: "Something went Wrong",
          message: "Please try again at a later time",
        });
      }
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const response = await axios.get("/viewPatientPrescriptions", {
        params: { id: selectedPatient._id },
      });
      if (response.data.success) {
        setPrescriptions(response.data.prescriptions);
      }
    } catch (error) {
      console.error("Error fetching prescriptions: ", error);
    }
  };

  const fetchHealthRecords = async () => {
    const response = await axios.get("/getHealthRecords", {
      params: { id: selectedPatient._id },
    });
    if (response.data.success) {
      setHealthRecords(response.data.healthRecords);
    }
  };

  const fetchMedicine = async () => {
    try {
      console.log("before");
      const res = await axios.get("/viewMedicineUser");
      console.log("after");
      const medicinesData = res.data;
      console.log(res.data);
      setMedicine(medicinesData);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  const fetchPatientPrescriptions = async () => {
    try {
      const response = await axios.get("/viewMyPrescriptions");
      if (response.data.success) {
        setPrescriptions(response.data.prescriptions);
      }
    } catch (error) {
      console.error("Error fetching prescriptions: ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const body = {};
    const date = data.get("FilterDate");
    const filled = data.get("filled");
    const doctor = data.get("doctor");
    if (!date && !filled && !doctor)
      return setAlert({
        title: "Missing fields",
        message: "You have to select at least one element to filter.",
      });
    if (date) body["date"] = date;
    if (filled === "true" || filled === "false")
      body["filled"] = filled === "true" ? true : false;
    if (doctor) body["doctor"] = doctor;
    const response = await axios.get("/filterPrescriptionByDateDoctorStatus", {
      params: body,
    });
    if (response.data.success) {
      setShowResetButton(true);
      setPrescriptions(response.data.prescriptions);
    } else {
      setAlert({ title: "", message: response.data.message });
    }
  };

  const handleResetSearchClick = async () => {
    setPrescriptions("");
    setShowResetButton(false);
    setFilterExpanded(false);
    fetchPatientPrescriptions();
  };

  useEffect(() => {
    console.log("patient profile");
    fetchHealthRecords();
    console.log("hr fetched");
    fetchMedicine();
    console.log("med fetched");
    if (userType === "doctor") {
      fetchPrescriptions();
    } else {
      fetchPatientPrescriptions();
    }
  }, []);

  return (
    <>
      <Typography variant="h3" sx={{ textAlign: "center" }}>
        My Medical Folder
      </Typography>
      <Container maxWidth="md" sx={{ height: "100%", marginTop: 15 }}>
        {userType === "doctor" && (
          <Box
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <Avatar
              sx={{ width: 200, height: 200 }}
              alt={"Profile"}
              src="profile.jpg"
            />
            <Box sx={{ width: "300px" }} />
            <Grid
              container
              sx={{ width: "1000px" }}
              spacing={3}
              justifyContent="center"
            >
              <Grid item xs={12} sm={12} align="center">
                <Typography variant="h4">
                  {selectedPatient.name && selectedPatient.name.toUpperCase()}
                </Typography>
                <Typography
                  variant={selectedPatient.name ? "subtitle1" : "h4"}
                  sx={{ color: "#555" }}
                >
                  {selectedPatient.username}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} align="left">
                {selectedPatient.email && (
                  <Typography variant="subtitle1">
                    <strong>Email:</strong> {selectedPatient.email}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6} align="left">
                {selectedPatient.birthDate && (
                  <Typography variant="subtitle1">
                    <strong>Birthdate:</strong>
                    {new Date(selectedPatient.birthDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      }
                    )}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={0} sm={12} />
              <Grid item xs={12} sm={6} align="left">
                {selectedPatient.gender && (
                  <Typography variant="subtitle1">
                    <strong>Gender:</strong>
                    {selectedPatient.gender}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6} align="left">
                {selectedPatient.mobileNumber && (
                  <Typography variant="subtitle1">
                    <strong>Phone Number:</strong>{" "}
                    {selectedPatient.mobileNumber}
                  </Typography>
                )}
              </Grid>
              <Grid item sm={12} />
              <Grid
                item
                xs={12}
                sm={selectedPatient.emergencyContact ? 12 : 6}
                align={selectedPatient.emergencyContact ? "center" : "left"}
              >
                {selectedPatient.emergencyContact && (
                  <Typography variant="subtitle1">
                    <strong>Emergency Contact:</strong>{" "}
                    {selectedPatient.emergencyContact.name} (
                    {selectedPatient.emergencyContact.relation}),{" "}
                    {selectedPatient.emergencyContact.mobileNumber}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={0} sm={6} />
            </Grid>
          </Box>
        )}
        <hr />
        <Typography variant="h5" sx={{ my: "30px" }}>
          Health Records
        </Typography>
        <Button
          variant="contained"
          onClick={() => setExpandUpload((prev) => !prev)}
          sx={{ mb: "10px" }}
        >
          Add Health Record
        </Button>
        <Collapse in={expandUpload}>
          <InputLabel htmlFor="healthRecord">Upload Health Record:</InputLabel>
          <Input
            id="inputFile1"
            type="file"
            onChange={(e) => convertToBase64("id", 1)}
            style={{ marginTop: "7px" }}
          />
          <Button variant="conatined" onClick={addHealthRecord}>
            <UploadIcon />
          </Button>
        </Collapse>
        {healthRecords && (
          <>
            <Box sx={{ height: "50px" }} />
            <Box>
              <Grid container spacing={3}>
                {healthRecords &&
                  healthRecords.map((hr) => (
                    <Grid item xs={12} sm={6}>
                      <iframe
                        title="PDF Viewer"
                        src={hr}
                        width="90%"
                        height="350px"
                      />
                    </Grid>
                  ))}
              </Grid>
            </Box>
          </>
        )}
        <hr />
        <Typography variant="h5" sx={{ my: "30px", mr: "30px" }}>
          Prescriptions
        </Typography>
        {userType === "patient" && !filterExpanded && !showResetButton && (
          <Button
            variant="contained"
            sx={{ marginLeft: "600px", marginTop: "-125px" }}
            onClick={handleFilterExpandClick}
          >
            Filter Prescriptions
          </Button>
        )}
        <Box
          component={"form"}
          onSubmit={(e) => handleSubmit(e)}
          sx={{ display: "flex", alignItems: "center" }}
        >
          {filterExpanded && !showResetButton && (
            <>
              <TextField
                id="FilterDate"
                label="Flter by Date"
                type="date"
                placeholder="Filter by Date"
                name="FilterDate"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ width: "100%", marginLeft: "100px" }}
              />
              <TextField
                id="filled"
                label="Choose filled/unfilled"
                select
                name="filled"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ width: "100%", marginLeft: "50px" }}
              >
                <MenuItem value={true}>Filled</MenuItem>
                <MenuItem value={false}>Not Filled</MenuItem>
              </TextField>
              <TextField
                id="doctor"
                label="Enter doctor name"
                type="text"
                placeholder="Enter doctor name"
                name="doctor"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ width: "100%", marginLeft: "50px" }}
              />
            </>
          )}
          {showResetButton && (
            <Button
              variant="outlined"
              onClick={handleResetSearchClick}
              style={{
                color: "black",
                marginLeft: "8px",
                cursor: "pointer",
              }}
              sx={{
                "&:hover": { backgroundColor: "#2196F3", color: "white" },
              }}
            >
              Reset Search
            </Button>
          )}
          {filterExpanded && !showResetButton && (
            <Button variant="contained" sx={{ m: "30px" }} type="submit">
              Submit
            </Button>
          )}
        </Box>
        {prescriptions && (
          <Grid container spacing={3}>
            {prescriptions &&
              prescriptions.map((prescription, index) => (
                <Grid item xs={12} sm={12} key={index}>
                  <PrescriptionItem
                    prescription={prescription}
                    number={index}
                  />
                </Grid>
              ))}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default PatientPage;
