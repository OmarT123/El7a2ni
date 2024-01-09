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

const PatientsSearchBar = ({ setAlert, setPatients }) => {
  const [searchName, setSearchName] = useState("");
  const [searchMedicinal, setSearchMedicinal] = useState("");
  const [expandSearchOptions, setExpandSearchOptions] = useState(false);
  const [showResetButton, setShowResetButton] = useState(false);

  const handleExpandOptionsClick = () => {
    setExpandSearchOptions(!expandSearchOptions);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    // console.log('search button')
    const body = {};
    if (searchName !== "") {
      body["name"] = searchName;
      const response = await axios.get("/viewmypatientsbyname", {
        params: body,
      });
    //   console.log(response.data.filteredPatients)
      if (response.data.succss) {
        setPatients(response.data.filteredPatients);
        setShowResetButton(true);
      }
    }
  };

  const handleResetSearchClick = async (e) => {
    e.preventDefault();
    setSearchName("");
    const response = await axios.get("/viewmypatients");
    setPatients(response.data);
    setShowResetButton(false);
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
    </Box>
  );
};

export default PatientsSearchBar;
