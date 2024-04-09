import React, { useEffect, useState } from 'react';
import './style.css';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, Typography } from '@mui/material';
import PizzaService from '../../services/PizzaService';
import Pizza from '../../models/pizza';
import { t } from 'i18next';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';


const PizzaListPage: React.FC = () => {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [selectedPizzas, setSelectedPizzas] = useState<{ [key: number]: number }>({});
  const [cart, setCart] = useState<number>(0);
  const [showCartDetails, setShowCartDetails] = useState<boolean>(false);

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

  const handleAddPizza = (index: number) => {
    const newSelectedPizzas = { ...selectedPizzas };
    newSelectedPizzas[index] = (newSelectedPizzas[index] || 0) + 1;
    setSelectedPizzas(newSelectedPizzas);

    // Calculer le nombre total de pizzas dans le panier
    let total = 0;
    Object.values(newSelectedPizzas).forEach(quantity => {
      total += quantity;
    });
    setCart(total);
  };

  const handleShowCartDetails = () => {
    setShowCartDetails(!showCartDetails);
  };

  const cartDetails = Object.entries(selectedPizzas).map(([index, quantity]) => {
    const pizza = pizzas[parseInt(index)];
    return (
      <div key={index}>
        <Typography>{pizza.name} - {quantity}</Typography>
      </div>
    );
  });

  const totalPrice = Object.entries(selectedPizzas).reduce((acc, [index, quantity]) => {
    const pizza = pizzas[parseInt(index)];
    return acc + (pizza.price * quantity);
  }, 0);
  
  const handleRemovePizza = (index: number) => {
    const newSelectedPizzas = { ...selectedPizzas };
    if (newSelectedPizzas[index] && newSelectedPizzas[index] > 0) {
      newSelectedPizzas[index]--;
      setSelectedPizzas(newSelectedPizzas);
    }
  
    // Recalculer le nombre total de pizzas dans le panier
    let total = 0;
    Object.values(newSelectedPizzas).forEach(quantity => {
      total += quantity;
    });
    setCart(total);
  };
  

  return (
    <div>
    <IconButton onClick={handleShowCartDetails} className="cart-icon">
      <ShoppingCartIcon />
    </IconButton>

    <div className={`cart-details ${showCartDetails ? 'show-cart-details' : ''}`}>
      <Typography variant="h4">Détails du panier</Typography>
      {cartDetails}
      <Typography variant="h4">Prix total: {totalPrice.toFixed(2)} €</Typography>
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


                  <Box display="flex" alignItems="center">
  <IconButton onClick={() => handleAddPizza(index)} className="button-icon">
    <button className="button" type="button">
      <span className="button__text"></span>
      <span className="button__icon">
        <svg className="svg" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <line x1="12" x2="12" y1="5" y2="19"></line>
          <line x1="5" x2="19" y1="12" y2="12"></line>
        </svg>
      </span>
    </button>
  </IconButton>

  <Typography>{selectedPizzas[index] || 0}</Typography>

  <IconButton onClick={() => handleRemovePizza(index)} className="button-icon">
    <button className="button" type="button">
      <span className="button__text"></span>
      <span className="button__icon">
        <svg className="svg" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <line x1="5" x2="19" y1="12" y2="12"></line>
        </svg>
      </span>
    </button>
  </IconButton>
</Box>



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
