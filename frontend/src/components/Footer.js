import {
  Box,
  Link,
  Typography,
  FormControl,
  OutlinedInput,
  Button,
} from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import SendIcon from "@mui/icons-material/Send";

const quickLinks1 = [
  "Home",
  "About Us",
  "Services",
  "Our Cases",
  "Other Links",
];
const quickLinks2 = [
  "Consulting",
  "Finance",
  "Testimonials",
  "FAQ",
  "Contact Us",
];

const Footer = () => {
  return (
    <footer>
      <Box
        sx={{
          backgroundColor: "#1976D2",
          height: "370px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFF",
          marginTop: '70px'
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "75%",
          }}
        >
          <Box sx={{ maxWidth: "25%" }}>
            <Typography variant="h5">About Us</Typography>
            <Box
              sx={{
                width: "50px",
                height: "3px",
                backgroundColor: "#FFF",
                margin: "10px 0 30px 0",
              }}
            ></Box>
            <Typography variant="p" sx={{ fontSize: "14px" }}>
              Lorem ipsum dolor sit am consectetur adipisicing elit do eiusmod
              tempor incididunt ut labore dolore magna.
            </Typography>
            <br></br>
            <br></br>
            <Typography variant="p" sx={{ fontSize: "14px" }}>
              ADD SOCIAL MEDIA ICONS
            </Typography>
            
          </Box>

          <Box sx={{ maxWidth: "25%" }}>
            <Typography variant="h5">Quick Links</Typography>
            <Box
              sx={{
                width: "50px",
                height: "3px",
                backgroundColor: "#FFF",
                margin: "10px 0 30px 0",
              }}
            ></Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Box>
                {quickLinks1.map((item) => (
                  <Link
                    sx={{
                      color: "white",
                      display: "flex",
                      flexDirection: "row",
                      transition: "transform 0.3s ease-in-out",
                      margin: "0 10px",
                      "&:hover": {
                        cursor: "pointer",
                        textDecoration: "none",
                        transform: "translateX(10px)",
                      },
                    }}
                  >
                    <ArrowRightIcon sx={{ fontSize: "22px" }} />
                    <Typography sx={{ fontSize: "15px" }}>{item}</Typography>
                  </Link>
                ))}
              </Box>
              <Box>
                {quickLinks2.map((item) => (
                  <Link
                    sx={{
                      color: "white",
                      display: "flex",
                      flexDirection: "row",
                      transition: "transform 0.3s ease-in-out",
                      margin: "0 10px",
                      "&:hover": {
                        cursor: "pointer",
                        textDecoration: "none",
                        transform: "translateX(10px)",
                      },
                    }}
                  >
                    <ArrowRightIcon sx={{ fontSize: "22px" }} />
                    <Typography sx={{ fontSize: "15px" }}>{item}</Typography>
                  </Link>
                ))}
              </Box>
            </Box>
          </Box>

          <Box
            sx={{ maxWidth: "25%", display: "flex", flexDirection: "column" }}
          >
            <Typography variant="h5">Open Hours</Typography>
            <Box
              sx={{
                width: "50px",
                height: "3px",
                backgroundColor: "#FFF",
                margin: "10px 0 30px 0",
              }}
            ></Box>
            <Typography variant="p" sx={{ fontSize: "14px" }}>
              Lorem ipsum dolor sit am consectetur adipisicing elit do eiusmod
              tempor incididunt ut labore dolore magna.
            </Typography>
            <br></br>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "90%",
              }}
            >
              <Typography variant="p" sx={{ fontSize: "14px" }}>
                Monday - Friday
              </Typography>
              <Typography variant="p" sx={{ fontSize: "14px" }}>
                8.00 - 20.00
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "90%",
              }}
            >
              <Typography variant="p" sx={{ fontSize: "14px" }}>
                Saturday
              </Typography>
              <Typography variant="p" sx={{ fontSize: "14px" }}>
                8.00 - 18.00
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "90%",
              }}
            >
              <Typography variant="p" sx={{ fontSize: "14px" }}>
                Sunday
              </Typography>
              <Typography variant="p" sx={{ fontSize: "14px" }}>
                Closed
              </Typography>
            </Box>
          </Box>

          <Box sx={{ maxWidth: "25%" }}>
            <Typography variant="h5">Newsletter</Typography>
            <Box
              sx={{
                width: "50px",
                height: "3px",
                backgroundColor: "#FFF",
                margin: "10px 0 30px 0",
              }}
            ></Box>
            <Typography variant="p" sx={{ fontSize: "14px" }}>
              subscribe to our newsletter to get all our news in your inbox..
            </Typography>
            <br></br>
            <br></br>

            <form noValidate autoComplete="off">
              <FormControl
                sx={{ width: "25ch", display: "flex", flexDirection: "row" }}
              >
                <OutlinedInput
                  placeholder="Email Address"
                  sx={{
                    "&.Mui-focused": {
                      borderColor: "white",
                    },
                    "&.MuiOutlinedInput-notchedOutline": {
                      borderColor: "white",
                    },
                    "& input": {
                      color: "rgba(255, 255, 255, 1)",
                    },
                  }}
                />
                <Button
                  variant="conatined"
                  sx={{ maxWidth: "30%", marginLeft: "10px" }}
                >
                  <SendIcon />
                </Button>
              </FormControl>
            </form>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          backgroundColor: "#5AB4FD",
          height: "80px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFF",
        }}
      >
        <Typography variant="p">
          © Copyright 2023 | All Rights Reserved by <strong>El7a2ni.com</strong>
        </Typography>
      </Box>
    </footer>
  );
};

export default Footer;
