export type User = {
  user: {
    id: string;
    name: string | null;
    email: string;
    photo: string | null;
    familyName: string | null;
    givenName: string | null;
  };
  scopes: string[];
  /**
   * JWT (JSON Web Token) that serves as a secure credential for your user's identity.
   */
  idToken: string | null;
  /**
   * Not null only if a valid webClientId and offlineAccess: true was
   * specified in configure().
   */
  serverAuthCode: string | null;
};

export type AuthUSer = {
  id: string;
 email:string;
 name:string;
 picture?:string;
 given_name?:string;
 family_name?:string;
 provider?: string;
 exp?: number;
 cookieExpiration?: number; // added for web cookie expiration tracking
};


