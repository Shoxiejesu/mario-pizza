import React, { useEffect, useState } from "react";
import "./style.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, IconButton, Typography } from "@mui/material";
import PizzaService from "../../services/PizzaService";
import Pizza from "../../models/pizza";
import { t } from "i18next";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import OrderService from "../../services/OrderService";

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

    // Limite de 10 par pizza
    if ((newSelectedPizzas[index] || 0) < 10) {
      newSelectedPizzas[index] = (newSelectedPizzas[index] || 0) + 1;
      setSelectedPizzas(newSelectedPizzas);

      let total = 0;
      Object.values(newSelectedPizzas).forEach((quantity) => {
        total += quantity;
      });
      setCart(total);
    }
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
      // On convertit en tableau les info de selectedPizza
      if (totalPrice <= 0) {
        throw new Error('Le prix total de la commande doit être supérieur à 0.');
      }
      const orderLines = Object.entries(selectedPizzas).map(
        ([pizzaIndex, quantity]) => {
          if (quantity > 0) {

          return {
            // Corrige le bug de decalage de l'id Pizza qui commencer a 0 au lieu de 1

            piz_id: parseInt(pizzaIndex) + 1,
            quantity: quantity,
          };
        }        else {
          throw new Error('La quantité de pizza doit être supérieure à 0.');
        }
      }
      );

      const orderData = {
        total_amount: totalPrice.toFixed(2),
        orderLines: orderLines,
      };

      console.log("Order before saving:", orderData);
      const savedOrder = await OrderService.save(orderData);
      console.log("Saved order:", savedOrder);

      // Retour a 0 du panier une fois la commande validé
      setSelectedPizzas({});
      setCart(0);

      alert("Commande enregistrée avec succès ! 30 minutes de délai d'attente");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la commande :", error);

      alert(
        "Erreur lors de l'enregistrement de la commande. Veuillez réessayer."
      );
    }
  };

  const totalPrice = Object.entries(selectedPizzas).reduce(
    (acc, [index, quantity]) => {
      // on recup la pizza en fonction de son id
      const pizza = pizzas[parseInt(index)];
      // calcule prix de la pizza en fonction de la quantité et on l'ajoute au total du panier
      return acc + pizza.price * quantity;
    },
    0
  );

  return (
    <div>
      <IconButton onClick={handleShowCartDetails} className="cart-icon">
        <ShoppingCartIcon />
      </IconButton>

      <div className={`cart-details ${showCartDetails ? "show-cart-details" : ""}`}>

        <Typography variant="h4">{t("common.detailsPanier")}</Typography>
        {}
        {Object.entries(selectedPizzas).map(([index, quantity]) => (
          <div key={index}>
            <Typography>
              {pizzas[parseInt(index)].name} - {quantity}
            </Typography>
          </div>
        ))}
        <Typography variant="h4">
          {t("common.prixTotal")}: {totalPrice.toFixed(2)} €
        </Typography>
        <button
          onClick={handleSaveOrder}
          style={{
            backgroundColor: "green",
            color: "white",
            padding: "5px 10px",
            borderRadius: "5px",
            border: "none",
          }}
          onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => { 
            (e.target as HTMLButtonElement).style.backgroundColor = "lightgreen";
          }} 
          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => { 
            (e.target as HTMLButtonElement).style.backgroundColor = "green";
          }} 
        >
          &#10003; {t("common.validerCommande")}
        </button>{" "}
      </div>
      <Typography variant="h4" gutterBottom className="left-align">{t("common.choose")}</Typography> {}
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

                    <div className="quantity-controls">
                      <IconButton
                        onClick={() => handleRemovePizza(index)}
                        className="button-icon minus"
                      >
                        -
                      </IconButton>

                      <Typography>{selectedPizzas[index] || 0}</Typography>
                      <IconButton
                        onClick={() => handleAddPizza(index)}
                        className="button-icon plus"
                      >
                        +
                      </IconButton>
                    </div>
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
