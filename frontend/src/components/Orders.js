import React, { useState, useEffect } from "react";
import { Paper, Grid, Typography, Button } from "@mui/material";
import axios from "axios";
import Popup from "./Popup";
import OrderDetails from "./OrderDetails";

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

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [alert, setAlert] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/pastOrders");
      setOrders(response.data.orders);
    } catch (error) {
      console.log("Error fetching previous orders:", error);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  const cancelOrder = async (Id) => {
    try {
      const response = await axios.put("/cancelOrder", { orderId: Id });
      if (response.data.success) {
        setAlert(response.data);
        fetchOrders();
      } else
        setAlert({
          title: "Something went Wrong",
          message: "Please try again at a later time",
        });
    } catch (error) {
      console.error("Error cancelling the order:", error);
    }
  };
  return (
    <Paper style={paperStyle} elevation={3}>
      {orders &&
        orders.map((order, index) => {
          console.log(order);
          return (
            <div key={index}>
              <OrderDetails order={order} />
              <div>
                <Button
                  style={{ backgroundColor: "red", color: "white" }}
                  sx={{ ml: "30px" }}
                  onClick={() => cancelOrder(order._id)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          );
        })}
      {orders.length === 0 && (
        <Typography variant="h3">NO Previous Orders To Show</Typography>
      )}
      {alert && (
        <Popup
          onClose={() => setAlert(null)}
          title={alert.title}
          message={alert.message}
          showButtons={false}
        />
      )}
    </Paper>
  );
};

export default Orders;
