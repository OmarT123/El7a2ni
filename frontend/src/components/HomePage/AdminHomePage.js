import { useState, createContext, useContext } from "react";
import { Container, Grid } from "@mui/material";
import SquareCard from "../SquareCard";
import MedicationIcon from "@mui/icons-material/Medication";
import PersonIcon from "@mui/icons-material/Person";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MedicineView from "../MedicineView";
import HomeNavBar from "./HomeNavBar";
import AdminsView from "../AdminsView";
import PatientsView from "../PatientsView";
import HealthPackagesView from "../HealthPackagesView";
import EmployeesView from "../AdminEmployees/EmployeesView";
import { minHeight } from "@mui/system";
import ProfilePage from "../ProfilePage";
import { HomePageContext } from "../../pages/HomePage";

export const Context = createContext();

const AdminHomePage = () => {
  const [page, setPage] = useState("home");
  const { user } = useContext(HomePageContext);
  const Home = () => {
    return (
      <>
        <Grid item xs={12} sm={4}>
          <SquareCard
            title="MEDICINE"
            body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales."
            icon={MedicationIcon}
            isLearnMore={false}
            changeFunction={() => setPage("medicine")}
            closeFunction={() => setPage("home")}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SquareCard
            title="EMPLOYEES"
            body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales."
            icon={LocalHospitalIcon}
            isLearnMore={false}
            changeFunction={() => setPage("employees")}
            closeFunction={() => setPage("home")}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SquareCard
            title="PATIENTS"
            body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales."
            icon={PersonIcon}
            isLearnMore={false}
            changeFunction={() => setPage("patients")}
            closeFunction={() => setPage("home")}
          />
        </Grid>
        <Grid item xs={0} sm={1.5} />
        <Grid item xs={12} sm={5}>
          <SquareCard
            title="ADMINS"
            body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales."
            icon={SupervisorAccountIcon}
            isLearnMore={false}
            changeFunction={() => setPage("admins")}
            closeFunction={() => setPage("home")}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <SquareCard
            title="HEALTH PACKAGES"
            body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales."
            icon={HealthAndSafetyIcon}
            isLearnMore={false}
            changeFunction={() => setPage("healthPackages")}
            closeFunction={() => setPage("home")}
          />
        </Grid>
      </>
    );
  };

  return (
    <>
      <Context.Provider value={{ page, setPage, user }}>
        <HomeNavBar homeButton={() => setPage("home")} setPage={setPage} />

        <Container sx={{ mt: 3 }}>
          <Grid container spacing={5} sx={{ minHeight: "80vh" }}>
            {page === "profile" ? (
              <ProfilePage userData={user} />
            ) : page === "home" ? (
              <Home />
            ) : page === "medicine" ? (
              <MedicineView userType={"admin"} />
            ) : page === "employees" ? (
              <EmployeesView userType={"admin"} />
            ) : page === "patients" ? (
              <PatientsView userType={"admin"} />
            ) : page === "admins" ? (
              <AdminsView />
            ) : (
              <HealthPackagesView userType={"admin"} />
            )}
          </Grid>
        </Container>
      </Context.Provider>
    </>
  );
};

export default AdminHomePage;
