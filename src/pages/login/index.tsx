import React from "react";
import { Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import * as yup from "yup";
import AuthenticationService from "../../services/AuthenticationService";
import UsersService from "../../services/UsersService"; // Importer le service UsersService

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
    onSubmit: async (values) => {
      try {
        // Authentification de l'utilisateur
        const response = await AuthenticationService.login(values.login, values.password);

        // Vérification de la réponse pour l'authentification réussie
        if (response) {
          // Stockage de l'authentification réussie dans le state
          setIsAuthenticated(true);

          // Récupération des informations de l'utilisateur à partir du service UsersService
          const user = await UsersService.getUserByUsername(values.login);

          // Vérification si l'utilisateur existe
          if (user) {
            // Stockage de l'ID de l'utilisateur connecté pour l'utiliser dans le save panier plus tard
            localStorage.setItem('userId', user.id.toString());

            console.log('ID de l\'utilisateur connecté :', user.id);

          
            console.log('Connexion réussie !');
          } else {
            setError(true);
            console.log('Utilisateur non trouvé.');
          }
        } else {
          
          setError(true);
          console.log('La connexion a échoué. Veuillez vérifier vos identifiants.');
        }
      } catch (error) {
        // Gestion des erreurs lors de l'authentification
        console.error('Erreur lors de la connexion:', error);
        setError(true);
      }
    },
  });

  const redirectToRegisterPage = () => {
    handleAutomaticLogin();
    onRegisterClick();
  };

  const handleAutomaticLogin = async () => {
    try {
      // Login automatique pour permettre a un nouveau user de push dans la table ses info avec des identifiant temporaire
      const response = await AuthenticationService.login("User d'inscription", "yanni12345");

      if (response) {
        const user = await UsersService.getUserByUsername("User d'inscription");

        // Vérification si l'utilisateur existe
        if (user) {
          // On stock l'id  dans le localstorage pour le recuperer dans la pizzalist ensuite
          localStorage.setItem('userId', user.id.toString());
          console.log('Connexion automatique réussie !');
        } else {
          setError(true);
          console.log('Utilisateur non trouvé.');
        }
      } else {
        setError(true);
        console.log('La connexion automatique a échoué.');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion automatique:', error);
      setError(true);
    }
  };

  return (
    <div className="login-container">
      {error && <Typography color="error">{t("common.loginError")}</Typography>}
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
