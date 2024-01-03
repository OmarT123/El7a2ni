import { Container, Typography, Icon, Box } from "@mui/material";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MedicationIcon from "@mui/icons-material/Medication";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import EventNoteIcon from "@mui/icons-material/EventNote";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HearingIcon from "@mui/icons-material/Hearing";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";

import ImageSlider from "../components/ImageSlider";
import FeatureCard from "../components/FeatureCard";
import DotLine from "../components/DotLine";
import FunFact from "../components/FunFacts";
import TopLeftIconHeaderText from "../components/TopLeftIconHeaderText";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const traits1 = [
  {
    icon: EventNoteIcon,
    title: "General Treatment",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus dictum eros ut imperdiet.",
  },
  {
    icon: EventNoteIcon,
    title: "Tooth Whitening",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus dictum eros ut imperdiet.",
  },
  {
    icon: MonitorHeartIcon,
    title: "Heart Surgery",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus dictum eros ut imperdiet.",
  },
];

const traits2 = [
  {
    icon: HearingIcon,
    title: "Ear Treatment",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus dictum eros ut imperdiet.",
  },
  {
    icon: VisibilityIcon,
    title: "Vision Problems",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus dictum eros ut imperdiet.",
  },
  {
    icon: BloodtypeIcon,
    title: "Blood Transfusion",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus dictum eros ut imperdiet.",
  },
];

const HomePage = ({ scrollToSection }) => {
  return (
    <>
      <NavBar />
      <ImageSlider scrollToSection={scrollToSection} />

      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          lineHeight: "40px",
          marginBottom: "50px",
        }}
        maxWidth="sm"
      >
        <Typography variant="h4">
          We Are Always Ready To Help You & Your Family
        </Typography>
        <Typography variant="p">
          Lorem ipsum dolor sit amet consectetur adipiscing elit praesent
          aliquet. pretiumts
        </Typography>
        <Icon component={MonitorHeartOutlinedIcon} fontSize="large" />
      </Container>

      <Container
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          textAlign: "center",
          lineHeight: "30px",
          marginBottom: "40px",
        }}
        maxWidth="lg"
      >
        <FeatureCard
          icon={LocalHospitalIcon}
          title="Emergency Help"
          message="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore"
        />
        <DotLine />
        <FeatureCard
          icon={VaccinesIcon}
          title="Emergency Help"
          message="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore"
        />
        <DotLine />
        <FeatureCard
          icon={MedicationIcon}
          title="Emergency Help"
          message="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore"
        />
      </Container>

      <FunFact />

      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          lineHeight: "40px",
          marginY: "50px",
        }}
        maxWidth="sm"
      >
        <Typography variant="h4">
          We Offer Different Services To Improve Your Health
        </Typography>
        <Typography variant="p">
          Lorem ipsum dolor sit amet consectetur adipiscing elit praesent
          aliquet. pretiumts
        </Typography>
        <Icon component={MonitorHeartOutlinedIcon} fontSize="large" />
      </Container>

      <Container sx={{ display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          {traits1.map((item) => (
            <TopLeftIconHeaderText
              icon={item.icon}
              title={item.title}
              text={item.text}
            />
          ))}
        </Box>
        <br></br>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          {traits2.map((item) => (
            <TopLeftIconHeaderText
              icon={item.icon}
              title={item.title}
              text={item.text}
            />
          ))}
        </Box>
      </Container>

      <Footer />
    </>
  );
};

export default HomePage;
