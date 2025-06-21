/**
 * Application Constants
 *
 * This file centralizes all constants used across the application.
 * Import from this file instead of defining constants in individual files.
 */


import Constants from 'expo-constants';


// Set your IP in .env or app.config.js
const getApiConfig = () => {
  // Priority: env vars > hostUri > fallback
  const envBaseUrl = process.env.NODE_ENV === "production" ? process.env.EXPO_PUBLIC_BASE_URL : process.env.EXPO_PUBLIC_LOCAL_URL;
  const envApiUrl = process.env.EXPO_PUBLIC_API_URL;

  if (envBaseUrl && envApiUrl) {
    return {
      baseUrl: envBaseUrl,
      apiUrl: envApiUrl
    };
  }

  // Fallback to hostUri logic
  const hostUri = Constants?.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(":")[0];
    return {
      baseUrl: `http://${ip}:8081`,
      apiUrl: `http://${ip}:5001/api/v1`
    };
  }

  // Final fallback
  return {
    baseUrl: 'http://localhost:8081',
    apiUrl: 'http://localhost:5001/api/v1'
  };
};

const { baseUrl, apiUrl } = getApiConfig();

// export const API_URL = `${apiUrl}`;
export const API_URL = "https://4a69-129-0-226-162.ngrok-free.app/api/v1";
export const BASE_URL = `${baseUrl}`;

console.log("\n\n the API URL", API_URL);
console.log('\n\n the BASE URL', BASE_URL);


// Authentication Constants
export const AUTH_TOKEN_NAME = "accessToken";
export const REFRESH_TOKEN_NAME = "refreshToken";
export const COOKIE_NAME = "auth_token";
export const REFRESH_COOKIE_NAME = "refresh_token";
export const COOKIE_MAX_AGE = 7200; // 20 seconds
export const JWT_EXPIRATION_TIME = "1d"; // 20 seconds
export const REFRESH_TOKEN_EXPIRY = "30d"; // 30 days
export const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

// Refresh Token Constants
export const REFRESH_BEFORE_EXPIRY_SEC = 60; // Refresh token 1 minute before expiry

// Google OAuth Constants
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
export const GOOGLE_REDIRECT_URI = `${process.env.EXPO_PUBLIC_BASE_URL}/api/auth/callback`;
export const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

// Github OAuth Constants
export const GITHUB_CLIENT_ID = process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID!;
export const GITHUB_CLIENT_SECRET = process.env.EXPO_PUBLIC_GITHUB_CLIENT_SECRET!;

// Apple OAuth Constants
// export const APPLE_CLIENT_ID = "com.beto.expoauthexample.web";
// export const APPLE_CLIENT_SECRET = process.env.APPLE_CLIENT_SECRET!;
// export const APPLE_REDIRECT_URI = `${process.env.EXPO_PUBLIC_BASE_URL}/api/auth/apple/callback`;
// export const APPLE_AUTH_URL = "https://appleid.apple.com/auth/authorize";


// export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const APP_SCHEME = process.env.EXPO_PUBLIC_SCHEME;
export const JWT_SECRET = process.env.JWT_SECRET!;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

// Cookie Settings
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "Lax" as const,
  path: "/",
  maxAge: COOKIE_MAX_AGE,
};

export const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "Lax" as const,
  path: "/api/auth/refresh", // Restrict to refresh endpoint only
  maxAge: REFRESH_TOKEN_MAX_AGE,
};
