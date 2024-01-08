import { Container, Typography, Avatar, Grid, Box } from "@mui/material";

const ProfilePage = ({ userData }) => {
  console.log(userData);

  return (
    <>
      <Container maxWidth="md" sx={{ height: "100%", marginTop: 15 }}>
        <Box
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          <Avatar
            sx={{ width: 200, height: 200 }}
            alt={"Profile"}
            src="profile.jpg"
          />
          <Box sx={{ width: "300px" }} />
          <Grid
            container
            sx={{ width: "1000px" }}
            spacing={3}
            justifyContent="center"
          >
            <Grid item xs={12} sm={12} align="center">
              <Typography variant="h4">{userData.name}</Typography>
              <Typography variant={userData.name ? "subtitle1": 'h4'} sx={{ color: "#555" }}>
                {userData.username}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} align="left">
              {userData.email && (
                <Typography variant="subtitle1">
                  <strong>Email:</strong> {userData.email}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6} align="left">
              {userData.birthdate && (
                <Typography variant="subtitle1">
                  <strong>Birthdate:</strong> {userData.birthdate}
                </Typography>
              )}
            </Grid>
            <Grid item xs={0} sm={12} />
            <Grid item xs={12} sm={6} align="left">
              {userData.phoneNumber && (
                <Typography variant="subtitle1">
                  <strong>Phone Number:</strong> {userData.phoneNumber}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6} align="left">
              {userData.wallet && (
                <Typography variant="subtitle1">
                  <strong>Wallet:</strong> ${userData.wallet / 100}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} align="center">
              {userData.emergencyContact && (
                <Typography variant="subtitle1">
                  <strong>Emergency Contact:</strong>{" "}
                  {userData.emergencyContact.name} (
                  {userData.emergencyContact.relation})
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default ProfilePage;
