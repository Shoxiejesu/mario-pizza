export default class Users {
    id: number;
    username: string;
    password: string; 
    firstname: string;
    lastname: string;
    address: string;
  
    constructor(
        id: number,
        username: string,
        password: string, 
        firstname: string,
        lastname: string,
        address: string,
    ) {
      this.id=id
      this.username = username;
      this.password = password;
      this.firstname = firstname;
      this.lastname = lastname;
      this.address = address;
    }
  }
  