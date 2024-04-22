import React, { useEffect, useState } from "react";
import "./style.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, IconButton, Typography } from "@mui/material";
import PizzaService from "../../services/PizzaService";
import Pizza from "../../models/pizza";
import { t } from "i18next";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import OrderService from "../../services/OrderService";
import Order from "../../models/order";

import Order_lineService from "../../services/Order_lineService";
import Order_line from "../../models/OrderLine";

const PizzaListPage: React.FC = () => {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);

  const [selectedPizzas, setSelectedPizzas] = useState<{
    [key: number]: number;
  }>({});
  
  
  const [cart, setCart] = useState<number>(0);
  const [showCartDetails, setShowCartDetails] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null); 


  useEffect(() => {
    async function fetchPizzas() {
      try {
        const fetchedPizzas = await PizzaService.getAll();
        setPizzas(fetchedPizzas);
      } catch (error) {
        console.error("Error fetching pizzas:", error);
      }
    }

    fetchPizzas();
  }, []);

  
  const handleAddPizza = (index: number) => {
    
    const newSelectedPizzas = { ...selectedPizzas };

    newSelectedPizzas[index] = (newSelectedPizzas[index] || 0) + 1;
    setSelectedPizzas(newSelectedPizzas);

    let total = 0;
    Object.values(newSelectedPizzas).forEach((quantity) => {
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

    if (newSelectedPizzas[index] === 0) {
      delete newSelectedPizzas[index];
    }

    let total = 0;
    Object.values(newSelectedPizzas).forEach((quantity) => {
      total += quantity;
    });
    setCart(total);
  };

  const handleShowCartDetails = () => {
    setShowCartDetails(!showCartDetails);
  };

  const handleSaveOrder = async () => {
    try {
      const orderLines = Object.entries(selectedPizzas).map(([pizzaIndex, quantity]) => {
        return {
          piz_id: parseInt(pizzaIndex+1),
          quantity: quantity
        };
      });
  
      const orderData = {
        total_amount: totalPrice.toFixed(2),
        orderLines: orderLines
      };
  
      // Enregistrer la commande et les lignes de commande
      console.log("Order before saving:", orderData);
      const savedOrder = await OrderService.save(orderData);
      console.log("Saved order:", savedOrder);
  
      // Réinitialiser le panier après avoir enregistré la commande
      setSelectedPizzas({});
      setCart(0);
  
      // Afficher un message de succès
      alert("Commande enregistrée avec succès ! 30 minutes de délai d'attente");
    } catch (error) {
      // Gérer les erreurs d'enregistrement de la commande
      console.error("Erreur lors de l'enregistrement de la commande :", error);
  
  
      // Afficher un message d'erreur
      alert("Erreur lors de l'enregistrement de la commande. Veuillez réessayer.");
    }
  };
  

  const totalPrice = Object.entries(selectedPizzas).reduce(
    (acc, [index, quantity]) => {
      const pizza = pizzas[parseInt(index)];
      return acc + pizza.price * quantity;
    },
    0
  );

  return (
    <div>
      <IconButton onClick={handleShowCartDetails} className="cart-icon">
        <ShoppingCartIcon />
      </IconButton>

      <div
        className={`cart-details ${showCartDetails ? "show-cart-details" : ""}`}
      >
        <Typography variant="h4">Détails du panier</Typography>
        {}
        {Object.entries(selectedPizzas).map(([index, quantity]) => (
          <div key={index}>
            <Typography>
              {pizzas[parseInt(index)].name} - {quantity}
            </Typography>
          </div>
        ))}
        <Typography variant="h4">
          Prix total: {totalPrice.toFixed(2)} €
        </Typography>
        <button onClick={handleSaveOrder}>Valider la commande</button>
      </div>

      {pizzas.length > 0 ? (
        <ul className="pizza-list">
          {pizzas.map((pizza, index) => (
            <li key={index} className="pizza-item">
              <div className="pizza-info">
                <img
                  src={pizza.image}
                  alt={t("pizza." + pizza.id)}
                  style={{ width: 200, marginRight: "1em" }}
                />
                      <span style={{ marginRight: "1em" }}>{index + 1}</span>

                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-start"
                >
                  <Typography variant="h6" fontWeight="bold">
                    {t("pizza." + pizza.id)}
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{
                      fontStyle: "italic",
                      color: "grey",
                      marginBottom: "0.5em",
                    }}
                  >
                    {t("description." + pizza.id)}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Typography className="pizza-price">
                      {pizza.price + " €"}
                    </Typography>
                    <IconButton
                      onClick={() => handleAddPizza(index)}
                      className="button-icon"
                    >
                      <button className="button" type="button">
                        +
                      </button>
                    </IconButton>
                    <Typography>{selectedPizzas[index] || 0}</Typography>
                    <IconButton
                      onClick={() => handleRemovePizza(index)}
                      className="button-icon"
                    >
                      <button className="button" type="button">
                        -
                      </button>
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
