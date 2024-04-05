import { Box, Typography } from "@mui/material";
import "./style.css"; 

const Footer = () => {
  return (
    <Box className="footer">
      <Typography variant="body1" sx={{ padding: "5px" }}>
        &copy; mariopizza
      </Typography>
    </Box>
  );
};

export default Footer;
