import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import SearchBar from "./SearchBar";
import axios from "axios";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

const paperStyle = {
  width: "1200px",
  margin: "auto",
  padding: 16,
};

const listStyle = {
  marginTop: 16,
};

const MedicineView = () => {
  const [items, setItems] = useState([
    "Medicine 1",
    "Medicine 2",
    "Medicine 3",
    "Medicine 4",
    "Medicine 5",
    "Medicine 6",
  ]);
  const [medicine, setMedicine] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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
    setMedicine(newMed)
  }

  return (
    <>
      <SearchBar updateMedicine={updateMedicine} />
      <Paper style={paperStyle} elevation={3}>
        <List style={listStyle}>
          {medicine.map((item, index) => (
            <ListItem key={index} button onClick={() => handleItemClick(item)}>
              <ListItemText
                primary={`${item.name.toUpperCase()}`}
                secondary={
                  <React.Fragment>
                    <p>Active Ingredient: {item.activeIngredient}</p>
                    <p>Amount Sold: {item.amountSold}</p>
                    <p>Archived: {item.archived.toString()}</p>
                    {/* <p>Created At: {item.createdAt}</p> */}
                    <p>Medicinal Use: {item.medicinalUse}</p>
                    <p>Price: {item.price}</p>
                    <p>Stock Quantity: {item.stockQuantity}</p>
                  </React.Fragment>
                }
              />
              {/* {item.picture && ( */}
              <img src={"med.jpg"} width="230px" height="230px" />
              {/* )} */}
            </ListItem>
          ))}
        </List>
      </Paper>
    </>
  );
};

export default MedicineView;
