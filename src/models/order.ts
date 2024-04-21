import OrderLine from "./OrderLine";

export default class Order {
    total_amount: string;
    orderLines: OrderLine[]; // Lignes de commande associées à la commande

  
    constructor(
      total_amount: string,
      orderLines: OrderLine[],
  
    ) {
      this.total_amount = total_amount;
      this.orderLines = orderLines;

    }
  }
  