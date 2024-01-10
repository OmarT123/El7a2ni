import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
// import SearchBar from "./SearchBar";
import axios from "axios";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import {
  Button,
  Container,
  Box,
  Avatar,
  Grid,
  TextField,
  Input,
  InputLabel,
} from "@mui/material";
import Popup from "./Popup";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import AddToCartForm from "./AddToCartForm";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const paperStyle = {
  width: "1200px",
  margin: "auto",
  padding: 16,
  minHeight: "450px",
};

const listStyle = {
  marginTop: 16,
};

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

const MedicineView = ({ userType, setPage }) => {
  const [medicine, setMedicine] = useState([]);
  const [stage, setStage] = useState("first");
  const [alert, setAlert] = useState(null);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [showResetButton, setShowResetButton] = useState(false);
  const [back, setBack] = useState(false);

  const SearchBar = () => {
    const [searchName, setSearchName] = useState("");
    const [searchMedicinal, setSearchMedicinal] = useState("");
    const [expandSearchOptions, setExpandSearchOptions] = useState(false);

    const handleExpandOptionsClick = () => {
      setExpandSearchOptions(!expandSearchOptions);
    };

    const handleSearch = async () => {
      try {
        const response = await axios.get("/searchMedicine", {
          params: { name: searchName, medicinal: searchMedicinal },
        });

        if (response.data.success) {
          setMedicine(response.data.results);
          setShowResetButton(true);
        } else {
          setAlert(response.data);
        }
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };

    const handleResetSearchClick = async () => {
      setSearchMedicinal("");
      setSearchName("");
      setShowResetButton(false);
      try {
        const res = await axios.get("/viewMedicineUser");
        const medicinesData = res.data;
        setMedicine(medicinesData);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };

    const closePopup = () => {
      setAlert(null);
    };

    return (
      <Box
        style={{
          width: "100%",
          borderBottom: "2px solid rgba(0, 0, 0, 0.12)",
          boxSizing: "border-box",
          paddingBottom: "15px",
          marginBottom: "15px",
        }}
      >
        <Box display="flex" alignItems="center" padding="12px">
          <TextField
            label="Search"
            variant="outlined"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            margin="dense"
            InputProps={{
              style: {
                color: "black",
                borderBottom: "none",
              },
            }}
            sx={{ width: "79%" }}
          />
          <Box marginLeft="8px" display="flex">
            <Button
              variant="outlined"
              onClick={handleSearch}
              style={{
                color: "black",
                cursor: "pointer",
                minHeight: "60px",
              }}
              sx={{
                height: "55px",
                "&:hover": { backgroundColor: "#2196F3", color: "white" },
              }}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              onClick={handleExpandOptionsClick}
              style={{
                color: "black",
                marginLeft: "8px",
                cursor: "pointer",
              }}
              sx={{ "&:hover": { backgroundColor: "#2196F3", color: "white" } }}
            >
              {expandSearchOptions ? "Hide Options" : "Show Options"}
            </Button>
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
          </Box>
        </Box>
        <Collapse in={expandSearchOptions}>
          <TextField
            label="Medicinal Use..."
            variant="outlined"
            margin="dense"
            id="medicinalUse"
            name="medicinalUse"
            value={searchMedicinal}
            onChange={(e) => setSearchMedicinal(e.target.value)}
            InputProps={{
              style: {
                borderBottom: "none",
              },
            }}
            sx={{ marginLeft: "11px", width: "77.5%" }}
          />
        </Collapse>
        {alert && (
          <Popup
            onClose={closePopup}
            title={alert.title}
            message={alert.message}
            showButtons={false}
          />
        )}
      </Box>
    );
  };

  const fetchMedicines = async () => {
    try {
      const res = await axios.get("/viewMedicineUser");
      const medicinesData = res.data;
      // console.log(medicinesData)
      setMedicine(medicinesData);
      setBack(false);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  const handleGetSubstitute = async (medicine) => {
    try {
      setMedicine([]);
      setBack(true);
      const { activeIngredient } = medicine;
      const response = await axios.get('/getSubMedicines', { params: { activeIngredient } });
      const substitutedMedicines = response.data.medicines;

      if (substitutedMedicines.length === 0) {
      } else {
        setMedicine(substitutedMedicines);
      }
    } catch (error) {
      console.error('Error fetching substitute medicines:', error);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const Home = () => {
    const [expandedItem, setExpandedItem] = useState(null);
    const [addMedicineExpanded, setAddMedicineExpanded] = useState(false);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stockQuantity, setStockQuantity] = useState("");
    const [activeIngredient, setActiveIngredient] = useState("");
    const [medicinalUse, setMedicinalUse] = useState("");
    const [salesReportDateExpanded, setSalesReportDateExpanded] = useState(false);
    const [salesReport, setSalesReport] = useState('');
    const [filterReportsExpanded, setFilterReportsExpanded] = useState(false);
    const [filteredReports, setFilteredReports] = useState('');

    const handleSalesReportClick = () => {
      setSalesReportDateExpanded(!salesReportDateExpanded);
    };

    const handleFilterReportsClick = () => {
      setFilterReportsExpanded(!filterReportsExpanded);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      const response = await axios.get("/getMonthlyMedicineReport", { params: { month: data.get("salesReportDate") } });
      setSalesReport(response.data);
    }

    const handleSubmitFilter = async (e, medicineID) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      const response = await axios.get("/getSaleReport", { params: { medicine: medicineID, month: data.get("salesReportFilterDate") } });
      setFilteredReports(response.data);
    }

    const handleItemExpand = (item) => {
      setExpandedItem(item.name === expandedItem ? null : item.name);
      setSelectedMedicine(item);
    };

    const addMedicine = async (e) => {
      e.preventDefault();

      if (
        name === "" ||
        price === 0 ||
        medicinalUse === "" ||
        activeIngredient === "" ||
        stockQuantity === ""
      )
        setAlert({
          title: "Insufficient Data",
          message: "Please fill all fields",
        });
      else {
        const body = {
          name,
          price,
          stockQuantity,
          medicinalUse,
          activeIngredient,
        };
        const response = await axios.post("/addMedicine", body);
        if (response.data.success) {
          setAlert(response.data);
          fetchMedicines();
          setAddMedicineExpanded(false);
        } else {
        }
      }
    };

    return (
      <>
        <Box fullWidth sx={{ display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Typography variant="h4" sx={{ m: "30px" }}>
              Medicine
            </Typography>
           { userType === "pharmacist" && <Fab
              style={buttonStyle}
              onClick={() => setAddMedicineExpanded((prev) => !prev)}
            >
              {addMedicineExpanded ? (
                <ClearIcon style={iconStyle} />
              ) : (
                <AddIcon style={iconStyle} />
              )}
            </Fab>}
            {userType !== "patient" && !salesReportDateExpanded && !addMedicineExpanded && <Button variant="contained" sx={{ m: "30px", marginLeft: '800px' }} onClick={handleSalesReportClick}>
              Sales Report
            </Button>}
            {userType === "patient" && <ShoppingCartIcon onClick={()=>setPage('MyCart')} sx={{ marginLeft: '860px', marginTop:"35px", cursor:"pointer" }}/>}
            <Box component={"form"} onSubmit={(e) => handleSubmit(e)} sx={{ display: 'flex', alignItems: 'center' }}>
              {salesReportDateExpanded && !addMedicineExpanded && <TextField
                id="salesReportDate"
                label="Sales Report Date"
                type="date"
                placeholder="Sales Report Date"
                required
                name="salesReportDate"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ width: "70%", marginLeft: '200px', marginTop: '25px' }}
              />}
              {salesReportDateExpanded && !addMedicineExpanded && <Button variant="contained" sx={{ m: "30px", marginTop: '54px' }} type="submit">
                Submit
              </Button>}
            </Box>
          </Box>
          <Collapse in={addMedicineExpanded} timeout="auto" unmountOnExit>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                ml: 1.5,
                width: "99%",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Name"
                      variant="outlined"
                      value={name}
                      fullWidth
                      onChange={(e) => setName(e.target.value)}
                      sx={{ marginBottom: "10px" }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Price"
                      variant="outlined"
                      value={price}
                      fullWidth
                      onChange={(e) => setPrice(e.target.value)}
                      sx={{ marginBottom: "10px" }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Stock Quantity"
                      variant="outlined"
                      value={stockQuantity}
                      fullWidth
                      onChange={(e) => setStockQuantity(e.target.value)}
                      sx={{ marginBottom: "10px" }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Medicinal Use"
                      variant="outlined"
                      value={medicinalUse}
                      fullWidth
                      onChange={(e) => setMedicinalUse(e.target.value)}
                      sx={{ marginBottom: "10px" }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Active Ingredient"
                      variant="outlined"
                      value={activeIngredient}
                      fullWidth
                      onChange={(e) => setActiveIngredient(e.target.value)}
                      sx={{ marginBottom: "10px" }}
                    />
                  </Grid>
                  <Grid xs={12} sm={1} />
                  <Grid item xs={12} sm={5.5}></Grid>
                </Grid>
              </Box>
              <Button
                variant="contained"
                onClick={addMedicine}
                sx={{ width: "100%" }}
                fullWidth
              >
                Add Medicine
              </Button>
            </Box>
          </Collapse>
        </Box>

        <SearchBar updateMedicine={setMedicine} />
        <Paper style={paperStyle} elevation={3}>
          <List style={listStyle}>
            {medicine &&
              medicine.map((item, index) => (
                <React.Fragment key={index}>
                  {(!item.archived || userType==="admin" || userType==="pharmacist") &&
                  <ListItem button onClick={() => handleItemExpand(item)}>
                    <ListItemText
                      primary={`${item.name.toUpperCase()}`}
                      secondary={
                        <React.Fragment>
                          <p>Active Ingredient: {item.activeIngredient}</p>
                          {userType === "pharmacist" && (
                            <p>Amount Sold: {item.amountSold}</p>
                          )}
                          {userType !== "patient" && (
                            <p>Archived: {item.archived.toString()}</p>
                          )}
                          <p>
                            Require Prescription :{" "}
                            {item.prescriptionMedicine ? 'true' : 'false'}
                          </p>

                          <p>Medicinal Use: {item.medicinalUse}</p>
                          <p>Price: {item.price}</p>
                          {userType === "pharmacist" && (
                            <p>Stock Quantity: {item.stockQuantity}</p>
                          )}
                        </React.Fragment>
                      }
                    />
                    <img
                      src={item.picture || "med.jpg"}
                      alt={"Medicine"}
                      width="230px"
                      height="230px"
                    />
                  </ListItem>
                  }
                  <Collapse in={item.name === expandedItem} timeout="auto" unmountOnExit>
                    {userType === "pharmacist" &&
                      <>
                        {!filterReportsExpanded && (
                          <Button variant="contained" sx={{ m: "30px" }} onClick={handleFilterReportsClick}>
                            Sales Report
                          </Button>
                        )}

                        {filterReportsExpanded && (
                          <Box component={"form"} onSubmit={(e) => handleSubmitFilter(e, item._id)} sx={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                              id="salesReportFilterDate"
                              label="Sales Report Date"
                              type="date"
                              placeholder="Sales Report Date"
                              required
                              name="salesReportFilterDate"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              sx={{ width: "70%", marginLeft: '200px', marginTop: '25px' }}
                            />
                            <Button variant="contained" sx={{ m: "30px", marginTop: '54px' }} type="submit">
                              Submit
                            </Button>
                          </Box>
                        )}
                        <Button
                          variant="contained"
                          sx={{ m: "30px" }}
                          onClick={() => setStage("details")}
                        >
                          View Details and Edit
                        </Button>
                      </>
                    }

                    {userType === "patient" &&
                      <> {item.stockQuantity > 0 && (
                        <AddToCartForm key={item._id} medicine={item} setAlert={setAlert} />
                      )}
                        {item.stockQuantity <= 0 && (
                          <Button
                            variant="contained"
                            sx={{ m: "30px" }}
                            onClick={() => handleGetSubstitute(item)}
                          >
                            View Alternatives
                          </Button>
                        )}
                      </>
                    }
                  </Collapse>
                </React.Fragment>
              ))
            }
          </List>
        </Paper>
        {salesReport && <Popup title={"Sales report on: " + salesReport.month.substr(0, 7)} content={salesReport} onClose={() => setSalesReport(null)} showButtons={false} />}
        {filteredReports && filteredReports.month && <Popup title={"Sales report on: " + filteredReports.month.substr(0, 7)} content={filteredReports} onClose={() => setFilteredReports(null)} showButtons={false} />}
        {back && (
          <Button
            variant="contained"
            sx={{ m: "30px" }}
            onClick={() => fetchMedicines()}
          >
            Back
          </Button>
        )}
      </>
    );
  };

  const MedicineDetails = () => {
    const [editMode, setEditMode] = useState(false);
    const [price, setPrice] = useState("");
    const [activeIngredient, setActiveIngredient] = useState("");
    const [archived, setArchived] = useState("");
    const [amountSold, setAmountSold] = useState("");
    const [medicinalUse, setMedicinalUse] = useState("");
    const [stockQuantity, setStockQuantity] = useState("");
    const [image, setImage] = useState("");
    const [alert, setAlert] = useState(null);

    const editMedicine = async (e) => {
      e.preventDefault();
      if (!editMode) setEditMode(true);
      else {
        const MedicineData = {};
        MedicineData["name"] = selectedMedicine.name;
        if (amountSold !== "") MedicineData["amountSold"] = amountSold;
        if (image !== "") MedicineData["picture"] = image;
        if (medicinalUse !== "") MedicineData["medicinalUse"] = medicinalUse;
        if (activeIngredient !== "")
          MedicineData["activeIngredient"] = activeIngredient;
        if (price !== "") MedicineData["price"] = price;
        if (stockQuantity !== "") MedicineData["stockQuantity"] = stockQuantity;

        const response = await axios.put("/editMedicine", MedicineData);
        if (response.data.success) {
          setSelectedMedicine({ ...selectedMedicine, ...MedicineData });
          setEditMode(false);
          setAlert(response.data);
        }
      }
    };

    function convertToBase64(type, c) {
      //Read File
      var selectedFile = document.getElementById("inputFile" + c).files;
      //Check File is not Empty
      if (selectedFile.length > 0) {
        // Select the very first file from list
        var fileToLoad = selectedFile[0];
        const lastFourLetters = fileToLoad.name.slice(-4);
        if (lastFourLetters !== ".jpg" && lastFourLetters !== ".png") {
          setAlert({
            title: "incompatible file type",
            message: "only upload jpg or png images",
          });
          return;
        }
        // FileReader function for read the file.
        var fileReader = new FileReader();
        var base64;
        // Onload of file read the file content
        fileReader.onload = function (fileLoadedEvent) {
          base64 = fileLoadedEvent.target.result;
          setImage(base64);
        };
        // Convert data to base64
        fileReader.readAsDataURL(fileToLoad);
      }
    }
    const handleArchive = async (e) => {
      e.preventDefault();
      const body = { id: selectedMedicine._id };
      const response = await axios.put("/archiveMedicine", body);
      if (response.data.success) {
        const newArchive = !selectedMedicine.archived;
        setAlert(response.data);
        setSelectedMedicine({ ...selectedMedicine, archived: newArchive });
      } else {
        setAlert({
          title: "Something Went Wrong",
          message: "Please try again at a later time",
        });
      }
    };
    const prescriptionMedicine = async (e) => {
      e.preventDefault();
      const body = { id: selectedMedicine._id };
      const response = await axios.put("/setPrescriptionMedicine", body);
      if (response.data.success) {
        const newPrescription = !selectedMedicine.prescriptionMedicine;
        setAlert(response.data);
        setSelectedMedicine({ ...selectedMedicine, prescriptionMedicine: newPrescription });
      } else {
        setAlert({
          title: "Something Went Wrong",
          message: "Please try again at a later time",
        });
      }
    };




    return (
      <>
        <Fab
          onClick={() => {
            setStage("first");
            fetchMedicines();
          }}
          color="primary"
          size="small"
          sx={{
            position: "absolute",
            top: "25%",
            left: "6%",
            transform: "translateY(-50%)",
          }}
        >
          <KeyboardArrowLeftIcon />
        </Fab>
          <Container maxWidth="md" sx={{ marginTop: 15, minHeight: "400px" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <img
              style={{ width: 200, height: 200 }}
              alt={"Profile"}
              src={selectedMedicine.picture}
            />
            <Box sx={{ width: "300px" }} />
            <Grid
              container
              sx={{ width: "1000px" }}
              spacing={3}
              justifyContent="center"
            >
              <Grid item xs={12} sm={12} align="center">
                <Typography variant={"h4"}>
                  {selectedMedicine.name.toUpperCase()}
                </Typography>
              </Grid>
              <Grid item xs={0} sm={12} />
              <Grid item xs={12} sm={6} align="left">
                <Typography variant="subtitle1">
                  <strong>Active Ingredient:</strong>{" "}
                  {selectedMedicine.activeIngredient}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} align="left">
                <Typography variant="subtitle1">
                  <strong>Amount Sold:</strong> {selectedMedicine.amountSold}
                </Typography>
              </Grid>
              <Grid item xs={0} sm={12} />
              <Grid item xs={12} sm={6} align="left">
                <Typography variant="subtitle1">
                  <strong>Archived:</strong>{" "}
                  {selectedMedicine.archived ? "true" : "false"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} align="left">
                <Typography variant="subtitle1">
                  <strong>Require Prescription:</strong>{" "}
                  {selectedMedicine.prescriptionMedicine ? "true" : "false"}
                </Typography>
              </Grid>
              <Grid item xs={0} sm={12} />
              <Grid item xs={12} sm={6} align="left">
                <Typography variant="subtitle1">
                  <strong>Medicinal Use:</strong>{" "}
                  {selectedMedicine.medicinalUse}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} align="left">
                <Typography variant="subtitle1">
                  <strong>Price:</strong> ${selectedMedicine.price}
                </Typography>
              </Grid>
              <Grid item xs={0} sm={12} />
              <Grid item xs={12} sm={6} align="left">
                <Typography variant="subtitle1">
                  <strong>Stock Quantity:</strong>{" "}
                  {selectedMedicine.stockQuantity}
                </Typography>
              </Grid>
              <Grid item xs={0} sm={6} />

              <Grid item xs={0} sm={12} />
              <Grid item xs={12} sm={3} align="left">
                <Button variant="contained" onClick={editMedicine}>
                  {editMode ? "Save" : "Edit"} Medicine
                </Button>
              </Grid>
              <Grid item xs={12} sm={3} align="left">
                <Button variant="contained">Sales Report</Button>
              </Grid>
              <Grid item xs={12} sm={3} align="left">
                <Button variant="contained" onClick={handleArchive}>
                  {selectedMedicine.archived ? "Unarchive" : "archive"}
                </Button>
              </Grid>
              <Grid item xs={12} sm={3} align="left">
                <Button variant="contained" onClick={prescriptionMedicine}>
                  {selectedMedicine.prescriptionMedicine ? "Set to a Non-prescription medicine " : "Set to a prescription medicine"}
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Collapse
            in={editMode}
            timeout="auto"
            unmountOnExit
            sx={{ mt: "40px" }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={5.5}>
                <TextField
                  fullWidth
                  id="activeIngredient"
                  label="Active Ingredient"
                  value={activeIngredient}
                  onChange={(e) => setActiveIngredient(e.target.value)}
                />
              </Grid>
              <Grid item sx={1} />
              <Grid item xs={12} sm={5.5}>
                <TextField
                  fullWidth
                  id="medicinalUse"
                  label="Medicinal Use"
                  value={medicinalUse}
                  onChange={(e) => setMedicinalUse(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={5.5}>
                <TextField
                  fullWidth
                  id="price"
                  label="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </Grid>
              <Grid item sx={1} />
              <Grid item xs={12} sm={5.5}>
                <TextField
                  fullWidth
                  id="stockQuantity"
                  label="Stock Quantity"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                />
              </Grid>
              <Grid item sx={1} />
              <Grid item xs={12} sm={5.5}>
                <InputLabel htmlFor="inputFile3">
                  Upload Medicine Picture:
                </InputLabel>
                <Input
                  id="inputFile3"
                  type="file"
                  onChange={(e) => convertToBase64("license", 3)}
                  style={{ marginTop: "7px" }}
                />
              </Grid>
            </Grid>
          </Collapse>
        </Container>
        {alert && (
          <Popup
            onClose={() => setAlert(null)}
            title={alert.title}
            message={alert.message}
            showButtons={false}
          />
        )}
      </>
    );
  };

  return (
    <>
      {stage === "first" ? <Home /> : <MedicineDetails />}
      {alert && (
        <Popup
          onClose={() => setAlert(null)}
          title={alert.title}
          message={alert.message}
          showButtons={false}
        />
      )}

    </>
  );
};

export default MedicineView;
