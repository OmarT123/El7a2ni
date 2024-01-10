import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import Fab from "@mui/material/Fab";
import Popup from "./Popup";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress for the loading indicator

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

    const fetchCartItems = async () => {
        try {
            const response = await axios.get('/viewMyCart');
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
            console.error('Error fetching cart items:', error);
        } finally {
            setLoading(false); // Set loading to false once the data is fetched
        }
    };
    useEffect(() => {

        fetchCartItems();
    }, [cartItems, amount]);

    const removeFromCart = async (medicineId) => {
        try {
            const response = await axios.put('/removeFromCart', { medicineId });
            fetchCartItems();
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    const increaseQuantity = async (medicineId) => {
        try {
            const response = await axios.put('/increaseByOne', { medicineId });
            fetchCartItems();
        } catch (error) {
            console.error('Error increasing quantity:', error);
        }
    };

    const decreaseQuantity = async (medicineId) => {
        try {
            const response = await axios.put('/decreaseByOne', { medicineId });
            fetchCartItems();
        } catch (error) {
            console.error('Error decreasing quantity:', error);
        }
    };

    const handleItemExpand = (item) => {
        setExpandedItem(item.name === expandedItem ? null : item.name);
    };

    return (
        <>
            <Paper style={paperStyle} elevation={3}>
                {!loading && <Typography variant='h4'>Wallet: {wallet}$</Typography>}
                {loading ? (
                    <CircularProgress sx={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-40%, -50%)' }} />
                ) : (
                    cartItems.length > 0 ? <>{
                        cartItems.map((item, index) => (
                            <>
                                <List style={listStyle} key={index}>
                                    <React.Fragment>
                                        <ListItem button onClick={() => handleItemExpand(item.medicine)}>
                                            <ListItemText
                                                primary={item.medicine.name.toUpperCase()}
                                                secondary={
                                                    <React.Fragment>
                                                        <p><strong>Price:</strong> {item.medicine.price}$</p>
                                                        <p><strong>Quantity:</strong> {item.quantity}</p>
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
                                        <Collapse in={item.medicine.name === expandedItem} timeout="auto" unmountOnExit>
                                            <Fab onClick={() => increaseQuantity(item.medicine._id)}> <AddIcon sx={{ cursor: "pointer", m: "50px" }} /> </Fab>
                                            <Fab onClick={() => decreaseQuantity(item.medicine._id)}> <IndeterminateCheckBoxIcon sx={{ cursor: "pointer", m: "50px" }} /> </Fab>
                                            <Fab onClick={() => removeFromCart(item.medicine._id)}> <RemoveShoppingCartIcon sx={{ cursor: "pointer", m: "50px" }} /> </Fab>
                                        </Collapse>
                                    </React.Fragment>
                                </List>
                            </>
                        ))
                    }
                        <Typography variant='h5'>Total: {amount}$</Typography>
                        <Button variant="contained" sx={{ m: "30px" }} onClick={()=>setPage('Checkout')}>
                          Proceed to Checkout
                        </Button>
                    </> : (
                        <Typography variant='h4'>
                            The cart is empty.
                        </Typography>
                    )
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