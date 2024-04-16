// SignupResponse.ts
export default interface SignupResponse {
    jwt: string;
    expiration: string;
    refreshToken: string;
    user: {
      id: number;
      username: string;
      firstname: string;
      lastname: string;
      address: string;
    };
  }
  