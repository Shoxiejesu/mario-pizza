export default class Order {
    id: number;
    usr_id: number;
    date: string;
    total_amount: string;
  
  
    constructor(
      id: number,
      usr_id: number,
      date: string,
      total_amount: string,
  
    ) {
      this.id = id;
      this.usr_id = usr_id;
      this.date = date;
      this.total_amount = total_amount;
    }
  }
  