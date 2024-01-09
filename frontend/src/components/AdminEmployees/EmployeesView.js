import React, { useState, useEffect } from "react";
import Popup from "../Popup";
import { Container, Grid } from "@mui/material";
import SquareCard from "../SquareCard";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PharmacistsStage from "./PharmacistsStage";
import DoctorsStage from "./DoctorsStage";

const paperStyle = {
  width: "1200px",
  margin: "auto",
  padding: 16,
  marginTop: "30px",
};

const listStyle = {
  marginTop: 16,
};

const EmployeesView = ({ userType }) => {
  const [stage, setStage] = useState("first");
  const [alert, setAlert] = useState(null);

  const FirstStage = () => {
    return (
      <>
        <Grid container spacing={5} sx={{ minHeight: "100vh" }}>
          <Grid item xs={12} sm={12} />
          <Grid item xs={0} sm={2} />
          <Grid item xs={12} sm={3.5}>
            <SquareCard
              title="DOCTORS"
              body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales."
              icon={LocalHospitalIcon}
              isLearnMore={false}
              changeFunction={() => setStage("doctors")}
              closeFunction={() => setStage("home")}
            />
          </Grid>
          <Grid item xs={0} sm={1} />
          <Grid item xs={12} sm={3.5}>
            <SquareCard
              title="PHARMACISTS"
              body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales."
              icon={LocalHospitalIcon}
              isLearnMore={false}
              changeFunction={() => setStage("pharmacists")}
              closeFunction={() => setStage("home")}
            />
          </Grid>
        </Grid>
      </>
    );
  };

  return (
    <>
      {stage === "first" ? (
        <FirstStage />
      ) : stage === "doctors" ? (
        <DoctorsStage
          setAlert={setAlert}
          setStage={setStage}
          userType={userType}
        />
      ) : (
        <PharmacistsStage setAlert={setAlert} setStage={setStage} userType={"admin"} />
      )}
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

export default EmployeesView;
