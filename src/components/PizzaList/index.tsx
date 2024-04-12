import React, { useEffect, useState } from 'react';
import './style.css';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, Typography } from '@mui/material';
import PizzaService from '../../services/PizzaService';
import Pizza from '../../models/pizza';
import { t } from 'i18next';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import OrderService from '../../services/OrderService';
import Order from '../../models/order';

const PizzaListPage: React.FC = () => {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [selectedPizzas, setSelectedPizzas] = useState<{ [key: number]: number }>({});
  const [cart, setCart] = useState<number>(0);
  const [showCartDetails, setShowCartDetails] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null); // State for user ID

  useEffect(() => {
    async function fetchPizzas() {
      try {
        const fetchedPizzas = await PizzaService.getAll();
        setPizzas(fetchedPizzas);
      } catch (error) {
        console.error('Error fetching pizzas:', error);
      }
    }

    fetchPizzas();
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    if (user && user.id) {
      setUserId(user.id);
    } else {
      console.error('No user ID available.');
      // Gérer le cas où l'ID de l'utilisateur n'est pas disponible
    }
  }, []);
  

  const handleAddPizza = (index: number) => {
    const newSelectedPizzas = { ...selectedPizzas };
    newSelectedPizzas[index] = (newSelectedPizzas[index] || 0) + 1;
    setSelectedPizzas(newSelectedPizzas);

    let total = 0;
    Object.values(newSelectedPizzas).forEach(quantity => {
      total += quantity;
    });
    setCart(total);
  };

  const handleRemovePizza = (index: number) => {
    const newSelectedPizzas = { ...selectedPizzas };
    if (newSelectedPizzas[index] && newSelectedPizzas[index] > 0) {
      newSelectedPizzas[index]--;
      setSelectedPizzas(newSelectedPizzas);
    }
  
    let total = 0;
    Object.values(newSelectedPizzas).forEach(quantity => {
      total += quantity;
    });
    setCart(total);
  };

  const handleShowCartDetails = () => {
    setShowCartDetails(!showCartDetails);
  };
  const handleSaveOrder = async () => {
    try {
      // Recuperer date actuel pour l'envoyer 
      const currentDate = new Date();
      
      // Format the date viens de stack
      const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}`;
      if (userId !== null) {

      const order = new Order(
        0,
        userId,
        formattedDate,
        totalPrice.toFixed(2)
      );
      await OrderService.save(order);
        setSelectedPizzas({});
        setCart(0);
        alert('Commande enregistrée avec succès !');
      } else {
        console.error('No user ID available.');
        alert('Impossible de trouver l\'identifiant de l\'utilisateur.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la commande:', error);
      alert('Une erreur est survenue lors de l\'enregistrement de la commande.');
    }
  };
  
  const getUserIdFromLocalStorage = () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    console.log('ID utilisateur récupéré:', user.id);
    return user.id || -1;
  };
  
  const totalPrice = Object.entries(selectedPizzas).reduce((acc, [index, quantity]) => {
    const pizza = pizzas[parseInt(index)];
    return acc + (pizza.price * quantity);
  }, 0);

  return (
    <div>
      <IconButton onClick={handleShowCartDetails} className="cart-icon">
        <ShoppingCartIcon />
      </IconButton>

      <div className={`cart-details ${showCartDetails ? 'show-cart-details' : ''}`}>
        <Typography variant="h4">Détails du panier</Typography>
        {/* Afficher les détails du panier ici */}
        {Object.entries(selectedPizzas).map(([index, quantity]) => (
          <div key={index}>
            <Typography>{pizzas[parseInt(index)].name} - {quantity}</Typography>
          </div>
        ))}
        <Typography variant="h4">Prix total: {totalPrice.toFixed(2)} €</Typography>
        <button onClick={handleSaveOrder}>Valider la commande</button>
      </div>

      {pizzas.length > 0 ? (
        <ul className="pizza-list">
          {pizzas.map((pizza, index) => (
            <li key={index} className="pizza-item">
              <div className="pizza-info">
                <img src={pizza.image} alt={t("pizza." + pizza.id)} style={{ width: 200, marginRight: '1em' }} />
                <Box display="flex" flexDirection="column" alignItems="flex-start">
                  <Typography variant="h6" fontWeight="bold">{t("pizza." + pizza.id)}</Typography>
                  <Typography variant="body2" style={{ fontStyle: 'italic', color: 'grey', marginBottom: '0.5em' }}>{t("description." + pizza.id)}</Typography>
                  <Box display="flex" alignItems="center">
                    <Typography className="pizza-price">{pizza.price + " €"}</Typography>
                    <IconButton onClick={() => handleAddPizza(index)} className="button-icon">
                      <button className="button" type="button">+</button>
                    </IconButton>
                    <Typography>{selectedPizzas[index] || 0}</Typography>
                    <IconButton onClick={() => handleRemovePizza(index)} className="button-icon">
                      <button className="button" type="button">-</button>
                    </IconButton>
                  </Box>
                </Box>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucune pizza disponible.</p>
      )}
    </div>
  );
};

export default PizzaListPage;