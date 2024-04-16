import React, { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import AuthenticationService from "../../services/AuthenticationService";
import UsersService from "../../services/UsersService"; 

import "./style.css";

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
      .required(
        t("error.required", {
          field: t("common.loginPlaceholder"),
        }).toUpperCase()
      )
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
    onSubmit: async (values) => {
      try {
        // Authentification de l'utilisateur
        const response = await AuthenticationService.login(
          values.login,
          values.password
        );

        if (response) {
          setIsAuthenticated(true);

          const user = await UsersService.getUserByUsername(values.login);

          // Vérification si l'utilisateur existe
          if (user) {
            // Stockage de l'ID de l'utilisateur connecté pour l'utiliser dans le save panier plus tard
            localStorage.setItem("userId", user.id.toString());

            console.log("ID de l'utilisateur connecté :", user.id);

            console.log("Connexion réussie !");
          } else {
            setError(true);
            console.log("Utilisateur non trouvé.");
          }
        } else {
          setError(true);
          console.log(
            "La connexion a échoué. Veuillez vérifier vos identifiants."
          );
        }
      } catch (error) {
        // Gestion des erreurs
        console.error("Erreur lors de la connexion:", error);
        setError(true);
      }
    },
  });

  return (
    <div className="login-container">
      {error && <Typography color="error">{t("common.loginError")}</Typography>}
      <form className="login-form" onSubmit={formik.handleSubmit}>
        <TextField
          placeholder={t("common.loginPlaceholder")}
          type="text"
          InputLabelProps={{ style: { color: "white" } }}
          InputProps={{ style: { color: "white" } }}
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
          InputLabelProps={{ style: { color: "white", background: "white" } }}
          InputProps={{ style: { color: "white" } }}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          name="password"
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />

<Button
  variant="contained"
  type="submit"
  onClick={onRegisterClick} // Appel de la fonction onRegisterClick lors du clic sur le bouton d'inscription
  className="register-button"
>
  {t("common.register")}
</Button>
        <Button variant="contained"  className="connect-button">
          {t("common.connect")}
        </Button>
       

      </form>
    </div>
  );
};

export default Login;
