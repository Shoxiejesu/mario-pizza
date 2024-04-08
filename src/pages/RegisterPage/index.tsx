// VehiclePage.tsx

import React, { useState } from 'react';
import './style.css'; 
import UsersService from '../../services/UsersService';
import User_rolesService from '../../services/User_rolesService';


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
    const storedUsersId = localStorage.getItem('lastClientId');
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
      const newUsersId = generateUsersId();

      const newUsers = {
        id: newUsersId,
        username: usersUsername,
        password: usersPassword,
        firstname: usersFirstname,
        lastname: usersLastname,
        address: usersAddress, 
      };

      // Appeler la méthode save du service Client pour enregistrer le nouveau client
      const savedUsers = await UsersService.save(newUsers);

      
      const userRole = {
        user_id: savedUsers.id,
        role_id: 1, // Supposons que 1 est l'ID du rôle que vous souhaitez assigner
      };
  
      // Enregistrer le rôle de l'utilisateur
      const savedUserRole = await User_rolesService.save(userRole);
      
      console.log('Client enregistré avec succès:', savedUsers);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du client:', error);
    }
  };

  

  return (


          


      <div className="table-container">
      <p className="Informations">Fiche informations </p>

        

          <div className="table-cell">
            <h2>Inscription</h2>
            <form>
              <label>Numéro de Téléphone  :</label>
              <input type="text" value={usersUsername} onChange={(e) => setUsersUsername(e.target.value)} />
              <label>Mot de passe  :</label>
              <input type="text" value={usersPassword} onChange={(e) => setUsersPassword(e.target.value)} />
              <label>Prénom :</label>
              <input type="contact2" value={usersFirstname} onChange={(e) => setUsersFirstname(e.target.value)} />
              <label>Nom :</label>
              <input type="numeropermis" value={usersLastname} onChange={(e) => setUsersLastname(e.target.value)} />
              <label>Adresse :</label>
              <input type="numeropermis" value={usersAddress} onChange={(e) => setUsersAddress(e.target.value)} />
            </form>
          </div>
          <button onClick={handleSaveUsers}>Enregistrer le client</button>

    </div>
  );
};

export default RegisterPage;
