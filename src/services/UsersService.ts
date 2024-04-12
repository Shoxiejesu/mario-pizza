import Users from "../models/users";
import AuthenticationService from "./AuthenticationService";

// Service class for handling client-related operations
class UsersService {
 
  static async getUserByUsername(username: string): Promise<Users | null> {
    return fetch(`http://localhost:8080/users/${username}`, {
      method: "GET",
      headers: {
        authorization: AuthenticationService.getJwt(),
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("User not found");
        }
        return response.json();
      })
      .catch((error) => {
        console.error(error);
        return null;
      });
}

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
