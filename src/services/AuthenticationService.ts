import SignupRequest from "../models/SignupRequest";
import SignupResponse from "../models/SignupResponse";
import Login from "../models/security/LoginRequest";
import LoginResponse from "../models/security/LoginResponse";
import Users from "../models/users";

export default class AuthenticationService {
  static async call(login: Login): Promise<LoginResponse | undefined> {
    const response = await fetch("http://localhost:8080/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(login),
    });

    if (response.ok) {
      return await response.json();
    }
  }

  static async login(username: string, password: string): Promise<boolean> {
    await this.call(new Login(username, password)).then((response) => {
      if (response !== undefined) {
        localStorage.setItem("jwt", response.jwt);
        localStorage.setItem("expiration", response.expiration);
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem("user", JSON.stringify(response.user));
      }
    });

    return new Promise((resolve) => resolve(this.isAuthenticated()));
  }




  static getUserId(): number {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      return user.id;
    }
    // Gérer le cas où l'ID de l'utilisateur est null
    throw new Error("User ID not found in local storage");
  }


  
  static logout(): void {
    localStorage.removeItem("jwt");
    localStorage.removeItem("expiration");
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");
    window.location.reload();
  }

  static isAuthenticated(): boolean {
    if (localStorage.getItem("jwt") !== null) {
      const expiration = localStorage.getItem("expiration");

      return expiration !== null && Date.parse(expiration) > Date.now();
    } else {
      return false;
    }
  }

  static getJwt(): any {
    return localStorage.getItem("jwt");
  }


  static getUserFromLocalStorage(): Users | null {
      const userString = localStorage.getItem("user");
      return userString ? JSON.parse(userString) : null;
    }


    static async signup(signupData: SignupRequest): Promise<SignupResponse | null> {
      try {
        const response = await fetch("http://localhost:8080/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(signupData),
        });
    
        if (response.ok) {
          const signupResponse: SignupResponse | null = await response.json();
          if (signupResponse) {
            localStorage.setItem("jwt", signupResponse.jwt);
            localStorage.setItem("expiration", signupResponse.expiration);
            localStorage.setItem("refreshToken", signupResponse.refreshToken);
            localStorage.setItem("user", JSON.stringify(signupResponse.user));
            
            return signupResponse; 
          }
        } else {
          throw new Error("Failed to sign up");
        }
      } catch (error) {
        console.error("Signup error:", error);
        return null; 
      }
    
      return null;
    }
    

}

