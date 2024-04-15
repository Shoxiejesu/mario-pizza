import Order from "../models/order";
import AuthenticationService from "./AuthenticationService";

class OrderService {
  static async save(newOrder: Order): Promise<Order> {
    return fetch(`http://localhost:8080/order/`, {
      method: "POST",
      body: JSON.stringify(newOrder),
      headers: {
        "Content-Type": "application/json",
        authorization: AuthenticationService.getJwt(),
      },
    })
      .then((order) => order.json())
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }
}

export default OrderService;
