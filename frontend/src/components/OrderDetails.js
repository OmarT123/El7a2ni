import React from "react";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Box, Grid } from "@mui/material";

const OrderDetails = ({ order }) => {
  return (
    <Box sx={{ m: "30px" }}>
      <Typography variant="h4">Order ID: {order._id}</Typography>
      <Typography>
        <strong>Status: </strong>
        {order.status}
      </Typography>
      <Typography>
        <strong>Address: </strong>
        {order.address}
      </Typography>
      <Typography>
        <strong>First Name: </strong>
        {order.First_Name}
      </Typography>
      <Typography>
        <strong>Last Name: </strong>
        {order.Last_Name}
      </Typography>

      <Typography variant="h4">Items:</Typography>
      <Grid container spacing={3}>
        {order.items.map((item, index) => (
          <Grid item xs={12} sm={4}>
            <List>
              <ListItem>
                <Typography>
                  <strong>Medicine: </strong>
                  {item.medicine.name}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography>
                  <strong>Quantity: </strong>
                  {item.quantity}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography>
                  <strong>Price: </strong>
                  {item.medicine.price}
                </Typography>
              </ListItem>
            </List>
          </Grid>
        ))}
      </Grid>

      <Typography>
        <strong>Total: </strong>
        {order.total}
      </Typography>
      {order.discount !== 0 && (
        <Typography>
          <strong>Discount:</strong> {order.discount}%
        </Typography>
      )}
      <Typography>
        <strong>Payment method: </strong>
        {order.paymentMethod}
      </Typography>
    </Box>
  );
};

export default OrderDetails;
