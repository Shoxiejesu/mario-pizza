import user_roles from "../models/user_roles";
import User_roles from "../models/user_roles";
import AuthenticationService from "./AuthenticationService";

class User_rolesService {
 
 
 
 static async save(newUser_roles: User_roles): Promise<User_roles> {
    return fetch(`http://localhost:8080/user_roles/`, {
      method: "POST",
      body: JSON.stringify(newUser_roles),
      headers: {
        "Content-Type": "application/json",
        authorization: AuthenticationService.getJwt(),
      },
    })
      .then((user_roles) => user_roles.json())
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }

}

export default User_rolesService;
