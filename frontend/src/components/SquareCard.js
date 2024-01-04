import React from "react";
import { Card, CardContent, Typography, Link, Box } from "@mui/material";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import InfoIcon from '@mui/icons-material/Info';

const SquareCard = ({ title, body, icon: IconComponent = InfoIcon, link,isLearnMore = true, changeFunction, backgroundColor = "#1976D2"}) => {
  const handleClick = () => {
    if (changeFunction) {
      changeFunction()
    }
    else
      window.location.href=link
  };
  return (
    <Card
      onClick={handleClick}
      sx={{
        width: 350,
        height: 270,
        position: "relative",
        backgroundColor: backgroundColor,
        color: "#FFF",
        padding: "15px",
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-10px)",
          boxShadow: "0px 10px 10px -5px #1976D2",
          cursor: 'pointer'
        },
      }}
    >
      <CardContent>
        <Typography variant="h5" sx={{ minHeight: "60px" }}>
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ minHeight: "100px", lineHeight: "25px", fontSize: "15px" }}
        >
          {body}
        </Typography>
        {isLearnMore && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link
              href="#"
              underline="none"
              color="#FFF"
              sx={{ display: "block", mt: 1 }}
            >
              Learn More
            </Link>
            <ArrowRightAltIcon sx={{ marginLeft: 1, paddingTop: 0.5 }} />
          </Box>
        )}
      </CardContent>
      <IconComponent
        sx={{
          position: "absolute",
          bottom: -30,
          right: -30,
          margin: "-10px",
          width: 150,
          height: 150,
          fill: "#CFCFCF",
        }}
      />
    </Card>
  );
};

export default SquareCard;
