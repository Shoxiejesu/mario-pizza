import React, { useState } from "react";
import "./style.css";
import AuthenticationService from "../../services/AuthenticationService";
import { t } from "i18next";

interface RegisterPageProps {}

const RegisterPage: React.FC<RegisterPageProps> = () => {
  const [usersUsername, setUsersUsername] = useState("");
  const [usersPassword, setUsersPassword] = useState("");
  const [usersFirstname, setUsersFirstname] = useState("");
  const [usersLastname, setUsersLastname] = useState("");
  const [usersAddress, setUsersAddress] = useState("");

  
  const handleSaveUsers = async () => {
    try {
      // Vérifier si toutes les informations sont remplies
      if (
        !usersUsername ||
        !usersPassword ||
        !usersFirstname ||
        !usersLastname ||
        !usersAddress
      ) {
        alert("Veuillez remplir toutes les informations pour créer un compte.");
        return;
      }
      

      const newUser = {
        username: usersUsername,
        password: usersPassword,
        firstname: usersFirstname,
        lastname: usersLastname,
        address: usersAddress,
      };

      // Appel de la méthode de AuthenticationService pour enregistrer l'utilisateur
      const response = await AuthenticationService.signup(newUser);

      if (response) {
        // Succès de l'inscription
        alert("Inscription réussie! Vous allez être redirigé vers la liste des pizzas.");

        window.location.href = "/PizzaListPage";

      } else {
        // Échec de l'inscription
        alert("Une erreur s'est produite lors de l'inscription.");
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du client:", error);
      alert("Une erreur s'est produite lors de l'inscription.");
    }
  };

  return (
    <div className="table-container register">
      <div className="table-cell">
        <form>
          <input
            placeholder={t("common.loginPlaceholder")}
            type="text"
            value={usersUsername}
            onChange={(e) => setUsersUsername(e.target.value)}
          />
          <input
            placeholder={t("common.passwordPlaceholder")}
            type="text"
            value={usersPassword}
            onChange={(e) => setUsersPassword(e.target.value)}
          />
          <input
            placeholder={t("common.firstnamePlaceholder")}
            type="text"
            value={usersFirstname}
            onChange={(e) => setUsersFirstname(e.target.value)}
          />
          <input
            placeholder={t("common.lastnamePlaceholder")}
            type="text"
            value={usersLastname}
            onChange={(e) => setUsersLastname(e.target.value)}
          />
          <input
            placeholder={t("common.addressPlaceholder")}
            type="text"
            value={usersAddress}
            onChange={(e) => setUsersAddress(e.target.value)}
          />
        </form>
      </div>
      <div className="button-container">
        <button onClick={handleSaveUsers}>{t("common.registervalide")}</button>
      </div>
    </div>
  );
};

export default RegisterPage;
