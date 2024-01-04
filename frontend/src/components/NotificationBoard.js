import Box from "@mui/material/Box";

const notifications = ["notification 1", "notification 2", "notification 3"];

const Notification = ({ children }) => {
  return (
    <Box sx={{ width: "100%" }}>
      <p>{children}</p>
    </Box>
  );
};

const NotificationBoard = ({ onClose }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.25)",
          position: "relative",
          padding: "20px",
          width: "80%",
          maxWidth: "800px",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "8px",
            right: "8px",
            cursor: "pointer",
          }}
          onClick={onClose}
        >
          &times;
        </Box>
        <Box
          sx={{
            borderBottom: "1px solid #ccc",
            paddingBottom: "10px",
            marginBottom: "20px",
            textAlign: "center", // Centers the title text
          }}
        >
          <h2 style={{ color: "#4E4FEB", fontWeight: "bold" }}>
            Notifications
          </h2>
        </Box>
        {notifications.map((notify) => (
          <Notification>{notify}</Notification>
        ))}
      </Box>
    </Box>
  );
};

export default NotificationBoard;
