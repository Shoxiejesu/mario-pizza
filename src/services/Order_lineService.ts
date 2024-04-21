import Order_line from "../models/OrderLine";
import AuthenticationService from "./AuthenticationService";

class Order_lineService {
  static async save(newOrder_line: Order_line): Promise<Order_line> {
    return fetch(`http://localhost:8080/order_line/`, {
      method: "POST",
      body: JSON.stringify(newOrder_line),
      headers: {
        "Content-Type": "application/json",
        authorization: AuthenticationService.getJwt(),
      },
    })
      .then((order_line) => order_line.json())
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }
}

export default Order_lineService;
