import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import axios from "axios";
import Popup from "./Popup";

const SearchBar = ({ updateMedicine }) => {
  const [searchName, setSearchName] = useState("");
  const [searchMedicinal, setSearchMedicinal] = useState("");
  const [expandSearchOptions, setExpandSearchOptions] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showResetButton, setShowResetButton] = useState(false);

  const handleExpandOptionsClick = () => {
    setExpandSearchOptions(!expandSearchOptions);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get("/searchMedicine", {
        params: { name: searchName, medicinal: searchMedicinal },
      });
      if (response.data.success) {
        updateMedicine(response.data.results);
        setShowResetButton(true)
      } else {
        setAlert(response.data);
      }
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };
  
  const handleResetSearchClick = async () => {
    setSearchMedicinal('');
    setSearchName('');
    setShowResetButton(false);
    try {
        const res = await axios.get("/viewMedicine");
        const medicinesData = res.data;
        updateMedicine(medicinesData);
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
              minHeight:'60px'
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
              color: 'black',
              marginLeft: '8px',
              cursor: 'pointer',
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

export default SearchBar;
