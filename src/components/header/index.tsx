import {
  AppBar,
  Box,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import "./style.css";
import { Logout } from "@mui/icons-material";
import AuthenticationService from "../../services/AuthenticationService";

interface Props {
  isAuthenticated: boolean;
  setIsAuthenticated: Function;
}

const Header = ({ isAuthenticated, setIsAuthenticated }: Props) => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = (
    event: React.MouseEvent<HTMLElement>,
    newLanguage: string
  ) => {
    i18n.changeLanguage(newLanguage);
  };

  return (
    <AppBar
      position="fixed"
      sx={{ backgroundColor: "#3b438b", top: 0, bottom: "auto" }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        margin="0 1em"
      >
        <Box display="flex" alignItems="center">
          <img src="logo.png" alt="Logo" className="logo" />
        </Box>

        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography
            variant="h2"
            sx={{
              fontFamily: "Arial",
              fontSize: "40px",
              color: "#fbc02c",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Mario's Pizza
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" className="menu">
          <Box>
            <ToggleButtonGroup
              value={i18n.language}
              exclusive
              size="small"
              onChange={toggleLanguage}
            >
              <ToggleButton value="fr">
                <Typography
                  fontSize="small"
                  sx={{ width: "20px", height: "20px" }}
                  color="white"
                >
                  FR
                </Typography>
              </ToggleButton>
              <ToggleButton value="nl">
                <Typography
                  fontSize="small"
                  sx={{ width: "20px", height: "20px" }}
                  color="white"
                >
                  NL
                </Typography>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          {isAuthenticated && (
            <>
              <Box>
                <IconButton
                  color="inherit"
                  onClick={() => {
                    AuthenticationService.logout();
                  }}
                  title="logout"
                >
                  <Logout />
                </IconButton>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </AppBar>
  );
};

export default Header;
