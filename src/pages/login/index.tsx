import { Button, Card, InputAdornment, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { KeyOutlined, LoginOutlined } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import * as yup from "yup";
import AuthenticationService from "../../services/AuthenticationService";


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

  // Fonction de redirection vers la page d'inscription
  const redirectToRegisterPage = () => {
    // Appeler la fonction de connexion automatique ici
    handleAutomaticLogin();
    
    onRegisterClick();
  };

  // Fonction pour la connexion automatique
  const handleAutomaticLogin = () => {
    AuthenticationService.login("0782104455", "yanni12345").then((response) => {
      setIsAuthenticated(response);
      setError(!response);
    });
  };

 
  

  return (
    <Card className="login" elevation={10}>
      {error && <Typography color="red">{t("common.loginError")}</Typography>}
      <form onSubmit={formik.handleSubmit}>
        <TextField
          placeholder={t("common.loginPlaceholder")}
          type="text"
          InputProps={{
            startAdornment: <InputAdornment position="start"><LoginOutlined /></InputAdornment>,
          }}
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
          InputProps={{
            startAdornment: <InputAdornment position="start"><KeyOutlined /></InputAdornment>,
          }}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          name="password"
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <Button variant="contained" type="submit">{t("common.connect")}</Button>
        <Button variant="contained" onClick={redirectToRegisterPage}>{t("common.register")}</Button>
      </form>
    </Card>
  );
};

export default Login;
