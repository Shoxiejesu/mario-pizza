export default class Pizza {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;


  constructor(
    id: number,
    name: string,
    description: string,
    image: string,
    price: number,

  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.image = image;
    this.price = price;
  }
}
