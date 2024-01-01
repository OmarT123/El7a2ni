import React, { useState } from "react";

import { Fab, Typography, Box, Button } from "@mui/material";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import SquareCard from "./SquareCard";

const images = [
  <img
    src="slider.jpg"
    alt=""
    style={{ width: "100%", height: "90vh", objectFit: "cover" }}
    sx={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100vw",
      height: "90vh",
      objectFit: "cover",
      zIndex: -1,
    }}
  />,
  <img
    src="slider2.jpg"
    alt=""
    style={{ width: "100%", height: "90vh", objectFit: "cover" }}
  />,
  <img
    src="slider3.jpg"
    alt=""
    style={{ width: "100%", height: "90vh", objectFit: "cover" }}
  />,
];

const ImageSlider = ({ scrollToSection }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prevImage) => (prevImage + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage(
      (prevImage) => (prevImage - 1 + images.length) % images.length
    );
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "125vh",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {images[currentImage]}
        <Box
          className="text"
          sx={{
            textAlign: "center",
            position: "absolute",
            top: "40%",
            left: "10%",
            width: "40%",
          }}
        >
          <Typography variant="h5">
            We Provide <span>Medical</span> Services That You Can{" "}
            <span>Trust!</span>
          </Typography>
          <Typography variant="body1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sed
            nisl pellentesque, faucibus libero eu, gravida quam.
          </Typography>
          <Box className="button" sx={{ marginTop: "20px" }}>
            <Button variant="contained" color="primary" onClick={() => scrollToSection('footer')}>
              Learn More
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "20px",
            width: "75%",
            position: 'absolute',
            top: "70%"
          }}
        >
          <SquareCard title="Emergency Cases" body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales." icon={MedicalServicesIcon}/>
          <SquareCard title="Doctors Timetable" body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales." icon={ViewTimelineIcon}/>
          <SquareCard title="Opening Hours" body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales." icon={AccessTimeIcon}/>
        </Box>
      </Box>

      <Fab
        onClick={prevImage}
        color="primary"
        size="large"
        sx={{
          position: "absolute",
          top: "50%",
          left: "16px",
          transform: "translateY(-50%)",
        }}
      >
        <KeyboardArrowLeftIcon />
      </Fab>
      <Fab
        onClick={nextImage}
        color="primary"
        size="large"
        sx={{
          position: "absolute",
          top: "50%",
          right: "16px",
          transform: "translateY(-50%)",
        }}
      >
        <KeyboardArrowRightIcon />
      </Fab>
    </div>
  );
};

export default ImageSlider;
