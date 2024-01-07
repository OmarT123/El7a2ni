import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import SearchBar from "./SearchBar";
import axios from "axios";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";

const paperStyle = {
  width: "1200px",
  margin: "auto",
  padding: 16,
};

const listStyle = {
  marginTop: 16,
};

const MedicineView = ({ userType }) => {
  const [medicine, setMedicine] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null);

  const handleItemExpand = (item) => {
    setExpandedItem(item.name === expandedItem ? null : item.name);
  };

  const fetchMedicines = async () => {
    try {
      const res = await axios.get("/viewMedicine");
      const medicinesData = res.data;
      setMedicine(medicinesData);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleItemClick = (item) => {
    alert(`Selected: ${item}`);
  };

  const updateMedicine = (newMed) => {
    setMedicine(newMed);
  };

  return (
    <>
      <SearchBar updateMedicine={updateMedicine} />
      <Paper style={paperStyle} elevation={3}>
        <List style={listStyle}>
          {medicine.map((item, index) => (
            <React.Fragment key={index}>
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
                      {/* <p>Created At: {item.createdAt}</p> */}
                      <p>Medicinal Use: {item.medicinalUse}</p>
                      <p>Price: {item.price}</p>
                      {userType === "pharmacist" && (
                        <p>Stock Quantity: {item.stockQuantity}</p>
                      )}
                    </React.Fragment>
                  }
                />
                {item.picture && (
                  <img
                    src={item.picture}
                    alt={item.name}
                    width="230px"
                    height="230px"
                  />
                )}
              </ListItem>
              <Collapse
                in={item.name === expandedItem}
                timeout="auto"
                unmountOnExit
              >
                {userType === 'admin' && <Button variant='contained' sx={{m:'30px'}}>Sales Report</Button>}
              </Collapse>
              
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </>
  );
};

export default MedicineView;
