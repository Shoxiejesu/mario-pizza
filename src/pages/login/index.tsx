// Login.js
import React from "react";
import { Button, Card, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import * as yup from "yup";
import AuthenticationService from "../../services/AuthenticationService";

import "./style.css"; // Importer le fichier CSS pour les styles

interface Props {
  setIsAuthenticated: (value: boolean) => void;
  onRegisterClick: () => void;
}

const Login: React.FC<Props> = ({ setIsAuthenticated, onRegisterClick }) => {
  const { t } = useTranslation();

  const [error, setError] = useState<boolean>(false);

  const schema = yup.object().shape({
    login: yup
      .string()
      .required(t("error.required", { field: t("common.loginPlaceholder") }).toUpperCase())
      .min(3, t("error.minLen", { field: "3" })),
    password: yup
      .string()
      .required(t("error.required", { field: t("common.passwordPlaceholder") }))
      .min(4, t("error.minLen", { field: "4" })),
  });

  const formik = useFormik({
    initialValues: {
      login: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      AuthenticationService.login(values.login, values.password).then((response) => {
        setIsAuthenticated(response);
        setError(!response);
      });
    },
  });

  const redirectToRegisterPage = () => {
    handleAutomaticLogin();
    onRegisterClick();
  };

  const handleAutomaticLogin = () => {
    AuthenticationService.login("0782104455", "yanni12345").then((response) => {
      setIsAuthenticated(response);
      setError(!response);
    });
  };

  return (
    <div className="login-container">
      {error && <Typography color="red">{t("common.loginError")}</Typography>}
      <form className="login-form" onSubmit={formik.handleSubmit}>
        <TextField
          placeholder={t("common.loginPlaceholder")}
          type="text"
          InputLabelProps={{ style: { color: 'white' } }}
          InputProps={{ style: { color: 'white' } }}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.login}
          name="login"
          error={formik.touched.login && Boolean(formik.errors.login)}
          helperText={formik.touched.login && formik.errors.login}
        />
        <TextField
          placeholder={t("common.passwordPlaceholder")}
          type="password"
          InputLabelProps={{ style: { color: 'white', background: 'white' } }}
          InputProps={{ style: { color: 'white' } }}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          name="password"
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <Button variant="contained" onClick={redirectToRegisterPage} className="register-button">{t("common.register")}</Button>

        <Button variant="contained" type="submit" className="connect-button">{t("common.connect")}</Button>
      </form>
    </div>
  );
};

export default Login;
