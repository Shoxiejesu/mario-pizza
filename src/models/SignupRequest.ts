// SignupRequest.ts
export default class SignupRequest {
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    address: string;
  
    constructor(
      username: string,
      password: string,
      firstname: string,
      lastname: string,
      address: string
    ) {
      this.username = username;
      this.password = password;
      this.firstname = firstname;
      this.lastname = lastname;
      this.address = address;
    }
  }
  