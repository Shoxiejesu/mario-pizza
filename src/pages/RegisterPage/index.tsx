import React, { useState } from 'react';
import './style.css'; 
import UsersService from '../../services/UsersService';
import User_rolesService from '../../services/User_rolesService';
import { t } from 'i18next';



interface MarkedPosition {
  x: number;
  y: number;
  image: string;
}

interface RegisterPageProps {}

const RegisterPage: React.FC<RegisterPageProps> = () => {
  const [usersUsername, setUsersUsername] = useState('');
  const [usersPassword, setUsersPassword] = useState('');
  const [usersFirstname, setUsersFirstname] = useState('');
  const [usersLastname, setUsersLastname] = useState('');
  const [usersAddress, setUsersAddress] = useState('');
  

  const [lastUsersId, setLastUsersId] = useState<number>(() => {
    const storedUsersId = localStorage.getItem('lastUsersId');
    return storedUsersId ? parseInt(storedUsersId) : 2; 
  });
  
  const generateUsersId = () => {
    const newUsersId = lastUsersId + 1;
    setLastUsersId(newUsersId); // Mettre à jour le dernier ID client
    localStorage.setItem('lastUsersId', newUsersId.toString()); // Stocker le nouvel ID localement
    return newUsersId;
  };
  

  const handleSaveUsers = async () => {
    try {
      // Vérifier si toutes les informations sont remplies
      if (!usersUsername || !usersPassword || !usersFirstname || !usersLastname || !usersAddress) {
        alert('Veuillez remplir toutes les informations pour créer un compte.');
        return;
      }
      const newUsersId = generateUsersId();
      


      const newUsers = {
        id: newUsersId,
        username: usersUsername,
        password: usersPassword,
        firstname: usersFirstname,
        lastname: usersLastname,
        address: usersAddress, 
      };

      const savedUsers = await UsersService.save(newUsers);

      const userRole = {
        user_id: savedUsers.id,
        role_id: 1, 
      };
      const savedUserRole = await User_rolesService.save(userRole);



      alert('Inscription réussie! Vous allez être redirigé vers la liste des pizzas.');
      window.location.href = '/PizzaListPage';
      

      
      localStorage.setItem('loggedInUser', JSON.stringify(savedUsers));    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du client:', error);
    }
  };

  

  return (


          


      <div className="table-container register">

        

          <div className="table-cell">
            <form>
              <input placeholder={t("common.loginPlaceholder")} type="text" value={usersUsername} onChange={(e) => setUsersUsername(e.target.value)} />
              <input placeholder={t("common.passwordPlaceholder")} type="text" value={usersPassword} onChange={(e) => setUsersPassword(e.target.value)} />
              <input placeholder={t("common.firstnamePlaceholder")} type="text" value={usersFirstname} onChange={(e) => setUsersFirstname(e.target.value)} />
              <input  placeholder={t("common.lastnamePlaceholder")} type="text" value={usersLastname} onChange={(e) => setUsersLastname(e.target.value)} />
              <input placeholder={t("common.addressPlaceholder")} type="text" value={usersAddress} onChange={(e) => setUsersAddress(e.target.value)} />
            </form>
          </div>
          <div className="button-container">

          <button onClick={handleSaveUsers}>{t("common.registervalide")}</button>
          </div>

    </div>
  );
};

export default RegisterPage;