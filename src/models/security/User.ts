export default class User {
  username: string;
  firstname: string;
  lastname: string;
  role: string;
  hasPicture: boolean;
  constructor(
    username: string,
    firstname: string,
    lastname: string,
    role: string,
    hasPicture: boolean
  ) {
    this.username = username;
    this.firstname = firstname;
    this.lastname = lastname;
    this.role = role;
    this.hasPicture = hasPicture;
  }
}
