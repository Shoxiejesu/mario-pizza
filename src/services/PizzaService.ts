import Pizza from "../models/pizza";
import AuthenticationService from "./AuthenticationService";

class PizzaService {
  
  static async getAll(): Promise<Pizza[]> {
    return fetch("http://localhost:8080/pizza/", {
      headers: {
        authorization: AuthenticationService.getJwt(),
      },
    })
      .then((pizzas) => pizzas.json())
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }

  
}

export default PizzaService;
