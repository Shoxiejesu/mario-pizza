import React from "react";
import { Box, MenuItem, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

const Welcome = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Box role="menubar" display="flex" justifyContent="center">
        <MenuItem>
          <NavLink
            to="/PizzaListPage"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography
              variant="h2"
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: "24px",
                textAlign: "center",
                marginTop: "30px",
                color: "#666",
                textShadow: "1px 1px 1px rgba(0, 0, 0, 0.1)",
              }}
            >
              {t("common.welcome")}
            </Typography>
          </NavLink>
        </MenuItem>
      </Box>
    </Box>
  );
};

export default Welcome;
