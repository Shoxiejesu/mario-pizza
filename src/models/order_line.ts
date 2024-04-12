export default class Order_line{
    id: number;
    ord_id: number;
    piz_id: number;
    quantity: number;
  
  
    constructor(
      id: number,
      ord_id: number,
      piz_id: number,
      quantity: number,
  
    ) {
      this.id = id;
      this.ord_id = ord_id;
      this.piz_id = piz_id;
      this.quantity = quantity;
    }
  }
  