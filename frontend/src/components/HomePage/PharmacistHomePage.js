import { Box, Container } from "@mui/material";
import HomeNavBar from "./HomeNavBar";
import {useState} from 'react'

const PharmacistHomePage = () => {
    const [page, setPage] = useState('home')

  return (
    <>
      <HomeNavBar homeButton={() => setPage("home")} />
      <Container sx={{minHeight: '80vh'}}>

      </Container>
    </>
  );
};

export default PharmacistHomePage;
