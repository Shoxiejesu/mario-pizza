import User from "./User";

export default class LoginResponse {
  jwt: string;
  expiration: string;
  user: User;
  refreshToken: string;
  constructor(
    jwt: string,
    expiration: string,
    user: User,
    refreshToken: string
  ) {
    this.jwt = jwt;
    this.expiration = expiration;
    this.user = user;
    this.refreshToken = refreshToken;
  }
}
