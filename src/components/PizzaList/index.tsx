import React, { useEffect, useState } from 'react';
import './style.css';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, Typography } from '@mui/material';
import PizzaService from '../../services/PizzaService';
import Pizza from '../../models/pizza';
import { t } from 'i18next';

const PizzaListPage: React.FC = () => {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [selectedPizzas, setSelectedPizzas] = useState<number[]>([]);

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
    const newSelectedPizzas = [...selectedPizzas];
    newSelectedPizzas[index] = (newSelectedPizzas[index] || 0) + 1;
    setSelectedPizzas(newSelectedPizzas);
  };

  return (
    <div>
      <h1> </h1>
      
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
                    <IconButton onClick={() => handleAddPizza(index)}>

                      
<button className="button" type="button">
  <span className="button__text">{t("common.add")}</span>
  <span className="button__icon"><svg className="svg" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><line x1="12" x2="12" y1="5" y2="19"></line><line x1="5" x2="19" y1="12" y2="12"></line></svg></span>
</button>

</IconButton>
                    <Typography>{selectedPizzas[index] || 0}</Typography>
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
