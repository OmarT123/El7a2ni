import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Grid, Paper } from "@mui/material";
import axios from "axios";
import Popup from "../components/Popup";

const ContractView = () => {
  const [user, setUser] = useState("");
  const [alert, setAlert] = useState('');

  useEffect(() => {
    axios.get("/loginAuthentication").then((response) => {
      const { success, type, user } = response.data;
      if (success) {
        setUser(user);
      }
    });
  }, []);

  const acceptContract = async () => {
    await axios.put("/acceptContract").then((res) => setAlert(res.data));
    setTimeout(()=>window.location.href = "/",[])
  };

  const rejectContract = async () => {
    await axios.put("/rejectContract").then((res) => setAlert(res.data));
    setTimeout(()=>window.location.href = "/",[])
  };

  return (
    <Paper maxWidth="md" sx={{
      padding:'20px',
      margin: '0 auto'
    }}>
      <Typography variant="h3">Employment Contract</Typography>
      <hr />
      <div
        dangerouslySetInnerHTML={{ __html: user.contract }}
        className="contract"
      />
      <Grid container spacing={3}>
        <Grid item sm={3}>
          <Button variant="contained" onClick={acceptContract}>
            Accept
          </Button>
        </Grid>
        <Grid item sm={3}>
          <Button variant="contained" onClick={rejectContract}>
            Reject
          </Button>
        </Grid>
      </Grid>
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

export default ContractView;
