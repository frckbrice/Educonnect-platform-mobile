
// libraries imports
import { AuthUSer } from '@/components/auth/type';
import {
    AuthError,
    AuthRequest,
    AuthRequestConfig,
    AuthRequestPromptOptions,
    AuthSessionResult,
} from 'expo-auth-session';
import * as jose from 'jose';

// local imports
import { tokenCache } from '@/utils/cache';
import { AUTH_TOKEN_NAME, BASE_URL, REFRESH_TOKEN_NAME } from '@/utils/env-constant';
import { Router } from 'expo-router';


// delay function to wait for a specified time
export const delay = (ms: number, fct: (() => void)) => new Promise(resolve => setTimeout(() => { resolve(fct()) }, ms));






// set the token name
export const restoreSession = async (
    refreshInProgressRef: React.RefObject<boolean>,
    setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>,
    setAccessToken?: React.Dispatch<React.SetStateAction<string | null>>,
    setRefreshToken?: React.Dispatch<React.SetStateAction<string | null>>,
    setUser?: React.Dispatch<React.SetStateAction<AuthUSer | null>>,
    isWeb?: boolean,
    refreshToken?: string,
) => {
    setIsLoading && setIsLoading(true);
    try {

        if (isWeb) {
            // For Web: Check if we have a session cookie by making a request to a session endpoint.
            const sessionResponse = await fetch(`${BASE_URL}/api/auth/session`, {
                method: 'GET',
                credentials: 'include'
            });

            if (sessionResponse.ok) {
                const userData = await sessionResponse.json();
                setUser && setUser(userData as AuthUSer);
            } else {
                console.log('No active web session found');
                // if no session user, we are trying to refresh the cookie
                try {
                    await refreshAccessToken(refreshInProgressRef);
                } catch (error) {
                    console.error(`\n\n Failed to refresh token on startup`)
                }
            }
        } else {
            // in the native: we try to use the stored token first
            const accessToken = await tokenCache?.getToken(AUTH_TOKEN_NAME);
            const refreshToken = await tokenCache?.getToken(REFRESH_TOKEN_NAME);

            if (accessToken) {
                try {
                    // check if the access token is still valid
                    const decoded = jose.decodeJwt(accessToken);
                    const exp = (decoded as { exp: number }).exp;
                    const now = Math.floor(Date.now() / 1000);

                    if (exp && exp > now) {
                        // the access token is still valid
                        setAccessToken && setAccessToken(accessToken);

                        if (refreshToken)
                            setRefreshToken && setRefreshToken(refreshToken);

                        setUser && setUser(decoded as AuthUSer);
                    } else if (refreshToken) {
                        // token expired but still have the refresh token
                        console.warn('\n token expired but remain the refresh token');
                        // set the refresh token state and attempt to refresh the token
                        setRefreshToken && setRefreshToken(refreshToken);
                        try {
                            await refreshAccessToken(refreshInProgressRef, refreshToken);
                        } catch (e) {
                            console.error(`\n Failed to refresh token on startup`)
                        }
                    }

                } catch (error) {
                    console.error('\n\n error decoding the token: ', error);
                    if (refreshToken) {
                        // token expired but still have the refresh token
                        console.warn('\n after error decoding the token, token expired but remain the refresh token');
                        // set the refresh token state and attempt to refresh the token
                        setRefreshToken && setRefreshToken(refreshToken);
                        try {
                            await refreshAccessToken(refreshInProgressRef, refreshToken);
                        } catch (e) {
                            console.error(`\n Failed to refresh token on startup`)
                        }
                    } else console.error('\n\n No user authenticated!!!')
                }
            }

        }
    } catch (error) {
        console.error('Error restoring the session', error);
    } finally {
        setIsLoading && setIsLoading(false);
    }
};

// set the refreshToken function
export const refreshAccessToken = async (
    refreshInProgressRef: React.RefObject<boolean>,
    tokenToUse?: string,
    refreshToken?: string,
    setUser?: React.Dispatch<React.SetStateAction<AuthUSer | null>>,
    isWeb?: boolean,
) => {
    // to prevent multiple sumultaneous attempts
    if (refreshInProgressRef?.current) {
        console.warn('\n\n Token refresh in progress');
        return null;
    }

    if (!refreshInProgressRef) {
        console.warn('\n\n refreshInProgressRef is not provided');
        return null;
    }
    refreshInProgressRef.current = true;

    try {

        console.log('\n\n Attempting to refresh the token');

        // use the provided token or fall back to the state
        const currentRefreshToken = tokenToUse || refreshToken;

        if (isWeb) {
            // for web: use the json for the request
            const refreshResponse = await fetch(`${BASE_URL}/api/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ platform: 'web' }),
                credentials: 'include' //  this introduce cookies in the request
            });

            if (!refreshResponse.ok) {
                const errorData = await refreshResponse.json();
                console.error('\n\n token refresh failed!!!', errorData);

                // if refresh fails due to expired token, sign-Ou
                if (refreshResponse.status === 401) {
                    signOut();
                }
                return null;
            }

            // get the most up-to-date user from the session
            const sessionData = await fetch(`${BASE_URL}/api/auth/session`, {
                method: 'GET',
                credentials: 'include'
            });

            if (sessionData.ok) {
                const userData = await sessionData.json();
                // set the most recent user
                setUser && setUser(userData as AuthUSer);
            }
            return null; // web no need access token directly since it use cookies for that.
        } else {
            // For native
            if (!currentRefreshToken) {
                console.error('\n\n No refresh token exists!!!, signing out');
                signOut();
                return null;
            }

            const refreshResponse = await fetch(`${BASE_URL}/api/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    platform: 'native',
                    refreshToken: currentRefreshToken
                }),
            });

            if (!refreshResponse.ok) {
                const errorData = await refreshResponse.json();
                console.error('\n\n token refresh failed!!!', errorData)

                // if refresh fails due to expired token, sign-Ou
                if (refreshResponse.status === 401) {
                    signOut();
                }
                return null;
            }

            // for native: update both tokens
            const tokens = await refreshResponse.json();

            if (tokens.accessToken) {
                // set the states and persists the tokens
                await handleNativeTokens(tokens);

                const decoded = jose.decodeJwt(tokens.accessToken!);
                console.log("inside refresh token: ", { decodedUSer: decoded });

                // check if we have all required user fields
                const hasRequiredUserField = decoded &&
                    (decoded as any).name &&
                    (decoded as any).email &&
                    (decoded as any).picture;

                if (!hasRequiredUserField)
                    console.warn('\n\n Refreshd token is missing some user data: ', decoded)


                setUser && setUser(decoded as AuthUSer);
            }
            return tokens.accessToken;
        }
    } catch (error) {
        console.error('\n\n Error refreshing the token', error);
        // we prefer to sign the user out in case of the error here.
        signOut();
        return null;
    } finally {
        refreshInProgressRef.current = false;
    }
};


export async function handleResponse(
    response: AuthSessionResult | null,
    router: Router,
    request?: AuthRequestConfig | any,
    setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>,
    setError?: React.Dispatch<React.SetStateAction<AuthError | null>>,
    setUser?: React.Dispatch<React.SetStateAction<AuthUSer | null>>,
    isWeb?: boolean,

) {
    // This function is called when Google redirects back to our app
    // The response contains the authorization code that we'll exchange for tokens
    if (response?.type === "success") {
        try {
            setIsLoading && setIsLoading(true);
            // Extract the authorization code from the response
            // This code is what we'll exchange for access and refresh tokens
            const { code } = response.params;

            // Create form data to send to our token endpoint
            // We include both the code and platform information
            // The platform info helps our server handle web vs native differently
            // const formData = new FormData();
            const formData = new URLSearchParams();
            formData.append("code", code);

            // Add platform information for the backend to handle appropriately
            if (isWeb) {
                formData.append("platform", "web");
            }

            // Get the code verifier from the request object
            // This is the same verifier that was used to generate the code challenge
            if (request?.codeVerifier) {
                formData.append("code_verifier", request.codeVerifier);
            } else {
                console.warn("No code verifier found in request object");
            }

            // Send the authorization code to our token endpoint
            // The server will exchange this code with Google for access and refresh tokens
            // For web: credentials are included to handle cookies
            // For native: we'll receive the tokens directly in the response
            const tokenResponse = await fetch(`${BASE_URL}/api/auth/token`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: formData.toString(),
                credentials: isWeb ? "include" : "same-origin", // Include cookies for web
            });

            // const clone = tokenResponse.clone();
            // const json = await clone.json();
            // console.log("token response", json);
            if (isWeb) {
                // For web: The server sets the tokens in HTTP-only cookies
                // We just need to get the user data from the response
                const userData = await tokenResponse.json();

                if (userData.success) {
                    // Fetch the session to get user data
                    // This ensures we have the most up-to-date user information
                    const sessionResponse = await fetch(
                        `${BASE_URL}/api/auth/session`,
                        {
                            method: "GET",
                            credentials: "include", // Include cookies in the request to get the session
                        }
                    );

                    if (sessionResponse.ok) {
                        const sessionData = await sessionResponse.json();
                        console.log("from session response: userData", sessionData);
                        setUser && setUser(sessionData as AuthUSer);
                    }
                }
            } else {
                // For native: The server returns both tokens in the response
                // We need to store these tokens securely and decode the user data
                const tokens = await tokenResponse.json();
                console.log("from token response: tokens", tokens);
                await handleNativeTokens(tokens);
                router.push("/(tabs)");
            }
        } catch (e) {
            console.error("Error handling auth response:", e);
        } finally {
            setIsLoading && setIsLoading(false);
        }
    } else if (response?.type === "cancel") {
        alert("Sign in cancelled");
    } else if (response?.type === "error") {
        setError && setError(response?.error as unknown as AuthError);
    }
}


const handleNativeTokens = async (tokens: {
    accessToken: string;
    refreshToken: string;
}, setAccessToken?: React.Dispatch<React.SetStateAction<string | null>>,
    setRefreshToken?: React.Dispatch<React.SetStateAction<string | null>>,
    setUser?: React.Dispatch<React.SetStateAction<AuthUSer | null>>,
) => {
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = tokens;

    // set the token state and persists them.
    if (newAccessToken) {
        setAccessToken && setAccessToken(newAccessToken);
        await tokenCache?.saveToken(AUTH_TOKEN_NAME, newAccessToken);

        const decoded = jose.decodeJwt(newAccessToken);
        setUser && setUser(decoded as AuthUSer);

    }
    if (newRefreshToken) {
        setRefreshToken && setRefreshToken(newRefreshToken);
        await tokenCache?.saveToken(REFRESH_TOKEN_NAME, newRefreshToken)
    }

}

export const fetchWithAuth = async (url: string, options: RequestInit, refreshInProgressRef: React.RefObject<boolean>,
    isWeb: boolean, user?: AuthUSer,
    accessToken?: string,) => {
    if (isWeb) {
        // we include credential to send cookies
        const response = await fetch(url, {
            ...options,
            credentials: 'include'
        });

        // try to refetch in case of the error
        if (response.status === 401) {
            console.log('\n\n API request failed with 401, attempting to refresh the token!');

            await refreshAccessToken(refreshInProgressRef);

            // if we still have the user after the refresh, retry to refresh
            if (user) {
                return fetch(url, {
                    ...options,
                    credentials: 'include'
                });
            }
        }
        return response;
    } else {
        // for native: we use token authorization header
        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${accessToken}`
            }
        });

        // if there is any authentication error, try to refresh the token,
        if (response.status === 401) {
            console.log('\n\n API request failed with status 401, attempting to refresh ...');

            // try to refresh the token  and get the new token directly
            const newAccessToken = await refreshAccessToken(refreshInProgressRef);

            // then retry the request with access token
            if (newAccessToken) {
                return fetch(url, {
                    ...options,
                    headers: {
                        ...options.headers,
                        Authorization: `Bearer ${accessToken}`
                    }
                });
            }
        }

        return response;
    }
}

// set the signIn function
export const signIn = async (
    promptAsync: (options?: AuthRequestPromptOptions) => Promise<AuthSessionResult>,
    request: AuthRequest | null) => {
    console.log("signIn");
    try {
        if (!request) {
            console.log("No request");
            return;
        }

        await promptAsync();
    } catch (e) {
        console.log(e);
    }
};

// set signOut function
export const signOut = async (
    isWeb?: boolean,
    setAccessToken?: React.Dispatch<React.SetStateAction<string | null>>,
    setRefreshToken?: React.Dispatch<React.SetStateAction<string | null>>,
    setUser?: React.Dispatch<React.SetStateAction<AuthUSer | null>>) => {
    if (isWeb) {
        // for web: we need to call the logout end point to clear all cookies 
        try {
            await fetch(`${BASE_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });

        } catch (error) {
            console.error('\n\n Error logging out ', error);
        }
    } else {
        // for native: clear both token and refresh token
        await tokenCache?.deleteToken(AUTH_TOKEN_NAME);
        await tokenCache?.deleteToken(REFRESH_TOKEN_NAME);
        setAccessToken && setAccessToken(null);
        setRefreshToken && setRefreshToken(null);
        setUser && setUser(null);
    }
};