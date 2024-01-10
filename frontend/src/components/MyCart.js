import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import Fab from "@mui/material/Fab";
import Popup from "./Popup";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Grid,
  TextField,
  Select,
  InputLabel,
  MenuItem,
  Box,
} from "@mui/material";

const paperStyle = {
  width: "1200px",
  margin: "auto",
  marginTop: "50px",
  padding: 16,
  minHeight: "450px",
};

const listStyle = {
  marginTop: 16,
};

const MyCart = ({ user, setPage }) => {
  const [cartItems, setCartItems] = useState([]);
  const [amount, setAmount] = useState(0);
  const [wallet, setwallet] = useState(0);
  const [alert, setAlert] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const [loading, setLoading] = useState(true); // New loading state
  const [checkout, setCheckout] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [apartmentNum, setApartmentNum] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [oldAddresses, setOldAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  const changeAddress = async () => {
    const address = selectedAddress.split(",");
    setStreetAddress(address[0]);
    setApartmentNum(address[1]);
    setCity(address[2]);
    setState(address[3]);
    setZipCode(parseInt(address[4]));
  };
  const handleCheckout = async () => {
    if (
      firstName === "" ||
      lastName === "" ||
      streetAddress === "" ||
      city === "" ||
      state === "" ||
      zipCode === "" ||
      paymentMethod === ""
    )
      setAlert({
        title: "Insufficient Data",
        message: "Please fill all fields",
      });
    else {
      const body = {};
      body[
        "address"
      ] = `${streetAddress},${apartmentNum},${city},${state},${zipCode}`;
      body["firstName"] = `${firstName}`;
      body["lastName"] = `${lastName}`;
      if (paymentMethod === "card") {
        await axios
          .get("/payWithCardCart", { params: body })
          .then((res) => (window.location.href = res.data.url));
      } else if (paymentMethod === "wallet") {
        const response = await axios
          .get("/payWithWalletCart", { params: body })
          .then((res) => {
            if (res.data.success) {
              setPage("orders");
            }else {
                setAlert({title:'Insufficient funds', message:'We were not able to process your order due to low funds'})
            }
          });
      } else if (paymentMethod === "cash") {
        const response = await axios.get("/cashOnDelivery", { params: body });
        if (response.data.success) {
          setPage("orders");
        }
      } else {
        setAlert({
          title: "Insufficient Data",
          message: "Please fill all fields",
        });
      }
    }
  };

  const handleAddressSelect = (event) => {
    const selectedValue = event.target.value;
    setSelectedAddress(selectedValue);
  };

  const fetchCartItems = async () => {
    try {
      const response = await axios.get("/viewMyCart");
      if (response.data.success) {
        const cartData = response.data.cart;
        setwallet(response.data.wallet);
        setCartItems(cartData.items);
        setAmount(cartData.amountToBePaid);
      } else {
        setAlert({
          title: "Error Occurred",
          message: response.data.error,
        });
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false); // Set loading to false once the data is fetched
    }
  };

  const getOldAddresses = async () => {
    await axios
      .get("/getAllAddresses")
      .then((res) => setOldAddresses(res.data));
  };

  const removeFromCart = async (medicineId) => {
    try {
      const response = await axios.put("/removeFromCart", { medicineId });
      fetchCartItems();
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const increaseQuantity = async (medicineId) => {
    try {
      const response = await axios.put("/increaseByOne", { medicineId });
      fetchCartItems();
    } catch (error) {
      console.error("Error increasing quantity:", error);
    }
  };

  const decreaseQuantity = async (medicineId) => {
    try {
      const response = await axios.put("/decreaseByOne", { medicineId });
      fetchCartItems();
    } catch (error) {
      console.error("Error decreasing quantity:", error);
    }
  };

  const handleItemExpand = (item) => {
    setExpandedItem(item.name === expandedItem ? null : item.name);
  };

  useEffect(() => {
    fetchCartItems();
  }, [cartItems, amount]);

  useEffect(() => {
    getOldAddresses();
  }, []);

  return (
    <>
      <Paper style={paperStyle} elevation={3}>
        {!loading && <Typography variant="h4">Wallet: {wallet}$</Typography>}
        {loading ? (
          <CircularProgress
            sx={{
              position: "absolute",
              top: "40%",
              left: "50%",
              transform: "translate(-40%, -50%)",
            }}
          />
        ) : cartItems.length > 0 ? (
          <>
            {cartItems.map((item, index) => (
              <>
                <List style={listStyle} key={index}>
                  <React.Fragment>
                    <ListItem
                      button
                      onClick={() => handleItemExpand(item.medicine)}
                    >
                      <ListItemText
                        primary={item.medicine.name.toUpperCase()}
                        secondary={
                          <React.Fragment>
                            <p>
                              <strong>Price:</strong> {item.medicine.price}$
                            </p>
                            <p>
                              <strong>Quantity:</strong> {item.quantity}
                            </p>
                          </React.Fragment>
                        }
                      />
                      <img
                        src={item.medicine.picture || "med.jpg"}
                        alt={"Medicine"}
                        width="230px"
                        height="230px"
                      />
                    </ListItem>
                    <Collapse
                      in={item.medicine.name === expandedItem}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Fab onClick={() => increaseQuantity(item.medicine._id)}>
                        {" "}
                        <AddIcon sx={{ cursor: "pointer", m: "50px" }} />{" "}
                      </Fab>
                      <Fab onClick={() => decreaseQuantity(item.medicine._id)}>
                        {" "}
                        <IndeterminateCheckBoxIcon
                          sx={{ cursor: "pointer", m: "50px" }}
                        />{" "}
                      </Fab>
                      <Fab onClick={() => removeFromCart(item.medicine._id)}>
                        {" "}
                        <RemoveShoppingCartIcon
                          sx={{ cursor: "pointer", m: "50px" }}
                        />{" "}
                      </Fab>
                    </Collapse>
                  </React.Fragment>
                </List>
              </>
            ))}
            <Typography variant="h5">Total: {amount}$</Typography>
            <Button
              variant="contained"
              sx={{ m: "30px" }}
              onClick={() => setCheckout((prev) => !prev)}
            >
              Proceed to Checkout
            </Button>
            <Collapse in={checkout}>
              <Grid
                container
                spacing={2}
                sx={{ width: "80%", ml: "10%", my: 2 }}
              >
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Street Address"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Apartment Number"
                    value={apartmentNum}
                    onChange={(e) => setApartmentNum(e.target.value)}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="ZIP codes"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <InputLabel id="paymentMethod">Payment Method</InputLabel>
                  <Select
                    fullWidth
                    labelId="paymentMethod"
                    id="payment"
                    label="Payment Method"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                  >
                    <MenuItem value="card">Credit Card</MenuItem>
                    <MenuItem value="wallet">Wallet</MenuItem>
                    <MenuItem value="cash">Cash on Delivery</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12} sm={10}>
                  <InputLabel id="addresses">Past Addresses</InputLabel>
                  <Select
                    fullWidth
                    labelId="addresses"
                    id="payment"
                    label="Past Addresses"
                    value={selectedAddress}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                  >
                    {oldAddresses.map((address, index) => (
                      <MenuItem key={index} value={address}>
                        {address}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item sm={2}>
                  <Box sx={{ height: "20px" }} />
                  <Button
                    variant="contained"
                    onClick={changeAddress}
                    sx={{ height: "57px" }}
                    fullWidth
                  >
                    Use Address
                  </Button>
                </Grid>
              </Grid>
              <Grid item xs={12} />
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  sx={{ width: "78%", ml: "11.5%", my: 2 }}
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
              </Grid>
            </Collapse>
          </>
        ) : (
          <Typography variant="h4">The cart is empty.</Typography>
        )}
      </Paper>
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

export default MyCart;
