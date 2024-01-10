import { Box, Container, Grid } from "@mui/material";
import SquareCard from "../SquareCard";
import HomeNavBar from "./HomeNavBar";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { useState } from "react";
import ProfilePage from "../ProfilePage";
import { HomePageContext } from "../../pages/HomePage";
import { useContext } from "react";
import MedicationIcon from "@mui/icons-material/Medication";
import HealingIcon from '@mui/icons-material/Healing';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import AssignmentIcon from '@mui/icons-material/Assignment';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import MedicineView from "../MedicineView";
import DoctorsStage from "../AdminEmployees/DoctorsStage";
import HealthPackagesView from "../HealthPackagesView";
import PatientPage from "../PatientPage";
import PharmacistsStage from "../AdminEmployees/PharmacistsStage";
import Chat from "../Chat";

const PatientHomePage = () => {
    const [page, setPage] = useState("home");
    const { user } = useContext(HomePageContext);
    const [chat, setChat] = useState(false);
    const [chatterID, setChatterID] = useState('');
    const [chatterName, setChatterName] = useState('');

    const Home = () => {
        return (
            <>
               
                    <Grid item xs={12} sm={12} />
                    <Grid item xs={12} sm={4}>
                        <SquareCard
                            title="MEDICAL FILE"
                            body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales."
                            icon={AssignmentIcon}
                            isLearnMore={false}
                            changeFunction={() => setPage("medicalFile")}
                            closeFunction={() => setPage("home")}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <SquareCard
                            title="APPOINTMENTS"
                            body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales."
                            icon={AccessAlarmIcon}
                            isLearnMore={false}
                            changeFunction={() => setPage("appointments")}
                            closeFunction={() => setPage("home")}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} >
                        <SquareCard
                            title="MEDICINE"
                            body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales."
                            icon={VaccinesIcon}
                            isLearnMore={false}
                            changeFunction={() => setPage("medicine")}
                            closeFunction={() => setPage("home")}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <SquareCard
                            title="HEALTH PACKAGE"
                            body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales."
                            icon={MedicationIcon}
                            isLearnMore={false}
                            changeFunction={() => setPage("healthPackage")}
                            closeFunction={() => setPage("home")}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <SquareCard
                            title="DOCTORS"
                            body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales."
                            icon={LocalHospitalIcon}
                            isLearnMore={false}
                            changeFunction={() => setPage("doctors")}
                            closeFunction={() => setPage("home")}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <SquareCard
                            title="PHARMACISTS"
                            body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales."
                            icon={HealingIcon}
                            isLearnMore={false}
                            changeFunction={() => setPage("pharmacists")}
                            closeFunction={() => setPage("home")}
                        />
                    </Grid>
            </>
        );
    };

    return (
        <>
            <HomeNavBar homeButton={() => setPage("home")} setPage={setPage} />
            <Container sx={{ mt: 3 }}>
                <Grid container spacing={5}>
                    {page === "profile" ? (
                        <ProfilePage userData={user} />
                    ) : page === "home" ? (
                        <Home />
                    ) : page === "medicine" ? (
                        <MedicineView userType={"patient"} />
                    ) : page === "doctors" ? (
                        <DoctorsStage
                            setStage={() => setPage("home")}
                            together={true}
                            userType={"patient"}
                            setChat={setChat}
                            setChatterID={setChatterID}
                            setChatterName={setChatterName}
                        />
                    ) : page === "pharmacists" ? (
                        <PharmacistsStage
                            setStage={() => setPage('home')}
                            together={true}
                            userType='patient'
                            setChat={setChat}
                            setChatterID={setChatterID}
                            setChatterName={setChatterName}
                        />
                    ) : page === "appointments" ? (
                        "Appointment page from omar"
                    ) : page === "healthPackages " ? (
                        <HealthPackagesView userType={"patient"} />
                    ) : (
                        <PatientPage/>
                    )}
                    {chat && <Chat partner={chatterID} name={chatterName} setChat={setChat} />}
                </Grid>
            </Container>
        </>
    );

}

export default PatientHomePage;