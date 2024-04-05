import { Box, MenuItem, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import "./style.css";

const Welcome = () => {
  const { t } = useTranslation();

  let aToZ: string[] = [];

  let i: number;
  for (i = 0; i < 26; i++) {
    aToZ.push(String.fromCharCode(65 + i));
  }

  return (
    <Box>

      
      <Box role="menubar" display="flex" justifyContent="center">
        <MenuItem>
          <NavLink to="/PizzaListPage">      <Typography variant="h2">{t("common.welcome")}</Typography>
</NavLink>
        </MenuItem>
        
      </Box>

    </Box>
  );
};

export default Welcome;
