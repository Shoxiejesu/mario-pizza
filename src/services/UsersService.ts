import Users from "../models/users";
import AuthenticationService from "./AuthenticationService";

// Service class for handling client-related operations
class UsersService {
 
 
 
 // Method to save a new client
 static async save(newUsers: Users): Promise<Users> {
    return fetch(`http://localhost:8080/users/`, {
      method: "POST",
      body: JSON.stringify(newUsers),
      headers: {
        "Content-Type": "application/json",
        authorization: AuthenticationService.getJwt(),
      },
    })
      .then((users) => users.json())
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }

}

export default UsersService;
