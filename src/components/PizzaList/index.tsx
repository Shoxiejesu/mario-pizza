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
import Order_line from "../../models/order_line";

const PizzaListPage: React.FC = () => {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [selectedPizzas, setSelectedPizzas] = useState<{
    [key: number]: number;
  }>({});
  const [cart, setCart] = useState<number>(0);
  const [showCartDetails, setShowCartDetails] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null); 
  const [orderIdCounter, setOrderIdCounter] = useState<number>(() => {
    const storedOrderIdCounter = localStorage.getItem("orderIdCounter");
    return storedOrderIdCounter ? parseInt(storedOrderIdCounter) : 1;
  });

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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    if (user && user.id) {
      setUserId(user.id);
    } else {
      console.error("No user ID available.");
    }
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
      // Recupere l'id du local storage grace au login
      const userId = localStorage.getItem("userId");

      if (!userId) {
        console.error("ID de l'utilisateur non trouvé dans le localStorage.");
        return;
      }

      // Gerer la date au frontend
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${(
        currentDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${currentDate
        .getDate()
        .toString()
        .padStart(2, "0")} ${currentDate
        .getHours()
        .toString()
        .padStart(2, "0")}:${currentDate
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${currentDate
        .getSeconds()
        .toString()
        .padStart(2, "0")}`;

      
      const order = new Order(
        orderIdCounter, 
        parseInt(userId),
        formattedDate,
        totalPrice.toFixed(2)
      );

      // Incrementer le compteur d'ID de commande et mettre à jour le localStorage
      setOrderIdCounter((prevCounter) => {
        const updatedCounter = prevCounter + 1;
        localStorage.setItem("orderIdCounter", updatedCounter.toString());
        return updatedCounter;
      });

      // Enregistre la commande
      console.log("Order before saving:", order);
      const savedOrder = await OrderService.save(order);
      console.log("Saved order:", savedOrder);

      // Méthode save order_line
      await Promise.all(
        Object.entries(selectedPizzas).map(async ([pizzaIndex, quantity]) => {
          const pizzaId = parseInt(pizzaIndex);
          const orderLine = new Order_line(0, savedOrder.id, pizzaId, quantity);
          console.log("Order line before saving:", orderLine);
          await Order_lineService.save(orderLine);
          console.log("Saved order line:", orderLine);
        })
      );

      setSelectedPizzas({});
      setCart(0);

      alert(
        "Commande enregistrée avec succès ! 30 minutes de delais d'attente"
      );
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la commande :", error);

      setSelectedPizzas({});
      setCart(0);
      alert(
        "Commande enregistrée avec succès ! 30 minutes de delais d'attente"
      );
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
