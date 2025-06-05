
// libraries imports
import { AuthUSer } from '@/components/auth/type';
import {
    AuthError,
    AuthRequestConfig,
    DiscoveryDocument,
    makeRedirectUri,
    useAuthRequest
} from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as jose from 'jose';
import React from 'react';
import { Platform } from 'react-native';

// local imports
import { tokenCache } from '@/utils/cache';
import { APP_SCHEME, AUTH_TOKEN_NAME, BASE_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, REFRESH_TOKEN_NAME } from '@/utils/env-constant';
import { useRouter, } from 'expo-router';


WebBrowser.maybeCompleteAuthSession(); //In order to close the popup window on web,

interface IAuthContext {
    user: AuthUSer | null;
    modalVisible: boolean;
    setModalVisible: (modal: boolean) => void;
    signIn: () => void;
    githubSignin: () => void;
    signOut: () => void;
    fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>;
    isLoading: boolean;
    error: AuthError | null;
}

const InitialState: IAuthContext = {
    user: null,
    modalVisible: false,
    setModalVisible: (modal: boolean) => { },
    signIn: () => { },
    githubSignin: () => { },
    signOut: () => { },
    fetchWithAuth: (url: string, options: RequestInit) => Promise.resolve(new Response()),
    isLoading: false,
    error: null as AuthError | null,
}

// set the context from the initial state
const AuthContext = React.createContext(InitialState);

// set the google config from auth-session
const config: AuthRequestConfig = {
    clientId: 'google',
    scopes: ['openid', 'email', 'profile'],
    redirectUri: makeRedirectUri()
}

const discovery: DiscoveryDocument = {
    authorizationEndpoint: `${BASE_URL}/api/auth/authorize`,
    tokenEndpoint: `${BASE_URL}/api/auth/token`
}

const githubConfig: AuthRequestConfig = {
    clientId: GITHUB_CLIENT_ID!,
    clientSecret: GITHUB_CLIENT_SECRET!,
    scopes: ["identity"],
    redirectUri: makeRedirectUri({
        scheme: APP_SCHEME,
    }),
};
// set the github discovery document
const githubDiscovery: DiscoveryDocument = {
    authorizationEndpoint: "https://github.com/login/oauth/authorize",
    tokenEndpoint: "https://github.com/login/oauth/access_token",
    revocationEndpoint: `https://github.com/settings/connections/applications/${GITHUB_CLIENT_ID}`,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [request, response, promptAsync] = useAuthRequest(config, discovery);
    const [user, setUser] = React.useState<AuthUSer | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<AuthError | null>(null);
    const [accessToken, setAccessToken] = React.useState<string | null>(null);
    const [refreshToken, setRefreshToken] = React.useState<string | null>(null);
    const router = useRouter();
    const [githubRequest, githubResponse, githubPromptAsync] = useAuthRequest(githubConfig, githubDiscovery);
    const [authProvider, setAuthProvider] = React.useState<'google' | 'github' | null>(null);
    const [modalVisible, setModalVisible] = React.useState<boolean>(false);

    const hasAlreadyAuthenticateRef = React.useRef(false);


    // check if is a web platform
    const isWeb = Platform.OS === 'web';

    // set refresh variable to avoid multiple refresh token at the same time
    const refreshInProgressRef = React.useRef(false);
    const isMounted = React.useRef(true);

    React.useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    React.useEffect(() => {
        // this function is called when the user hit to continue on Oauth
        handleResponse();
    }, [response, githubResponse]);

    React.useEffect(() => {
        restoreSession();
    }, [isWeb]);


    const restoreSession = async () => {
        setIsLoading(true);
        try {

            if (isWeb) {
                // For Web: Check if we have a session cookie by making a request to a session endpoint.
                const sessionResponse = await fetch(`${BASE_URL}/api/auth/session`, {
                    method: 'GET',
                    credentials: 'include'
                });

                if (sessionResponse.ok) {
                    const userData = await sessionResponse.json();
                    setUser(userData as AuthUSer);
                } else {
                    console.log('No active web session found');
                    // if no session user, we are trying to refresh the cookie
                    try {
                        await refreshAccessToken();
                    } catch (error) {
                        console.error(`\n\n Failed to refresh token on startup`)
                    }
                }
            } else {
                // in the native: we try to use the stored token first
                const accessToken = await tokenCache?.getToken(AUTH_TOKEN_NAME);
                const refreshToken = await tokenCache?.getToken(REFRESH_TOKEN_NAME);

                // console.log({ token: accessToken })
                if (accessToken) {
                    // console.log("in restore session, accessToken", accessToken)
                    try {
                        // check if the access token is still valid
                        const decoded = jose.decodeJwt(accessToken);
                        const exp = (decoded as { exp: number }).exp;
                        const now = Math.floor(Date.now() / 1000);

                        if (exp && exp > now) {
                            console.log("in restore session, token still valid")

                            // the access token is still valid
                            setAccessToken(accessToken);

                            if (refreshToken)
                                setRefreshToken(refreshToken);

                            setUser(decoded as AuthUSer);
                            setTimeout(() => {
                                if (isMounted.current) {
                                    router.push('/(tabs)');
                                }
                            }, 100);
                        } else if (refreshToken) {
                            // log them to check
                            console.log("in restore session, refreshToken", refreshToken ? 'exists' : 'does not exist')

                            // token expired but still have the refresh token
                            console.warn('\n token expired but remain the refresh token');
                            // set the refresh token state and attempt to refresh the token
                            setRefreshToken(refreshToken);
                            try {
                                await refreshAccessToken(refreshToken);
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
                            setRefreshToken(refreshToken);
                            try {
                                await refreshAccessToken(refreshToken);
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
            setIsLoading(false);
        }
    };


    // set the refreshToken function
    const refreshAccessToken = async (tokenToUse?: string) => {

        // to prevent multiple sumultaneous attempts
        if (refreshInProgressRef.current) {
            console.warn('\n\n Token refresh in progress');
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
                    console.error('\n\n token refresh failed!!!', errorData)

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
                    setUser(userData as AuthUSer);
                }
                return null; // web no need access token directly since it use cookies for that.
            } else {
                // For native
                if (!currentRefreshToken) {
                    console.error('\n\n No refresh token exists!!!, signing out');
                    signOut();
                    return null;
                }

                console.log('\n\n Using Refresh token to get the new token');
                try {
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

                        const decoded = jose.decodeJwt(tokens.accessToken!);
                        console.log("inside refresh token: ", { decodedUSer: decoded });

                        // check if we have all required user fields
                        const hasRequiredUserField = decoded &&
                            (decoded as any).name &&
                            (decoded as any).email &&
                            (decoded as any).picture;

                        if (!hasRequiredUserField)
                            console.warn('\n\n Refreshd token is missing some user data: ', decoded)

                        await handleNativeTokens(tokens);
                        setUser(decoded as AuthUSer);
                        // set the states and persists the tokens

                    }
                    return tokens.accessToken;
                } catch (error) {
                    console.error('\n\n Error refreshing the token for native device', error);
                }
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


    async function handleResponse() {
        // This function is called when Google redirects back to our app
        // The response contains the authorization code that we'll exchange for tokens
        if (authProvider === 'google' && response?.type === "success") {
            console.log("\n\n google Oauth login");

            if (hasAlreadyAuthenticateRef.current === true)
                return;
            try {
                setIsLoading(true);
                // Extract the authorization code from the response
                // This code is what we'll exchange for access and refresh tokens
                const { code } = response.params;

                // Create form data to send to our token endpoint
                // We include both the code and platform information
                // The platform info helps our server handle web vs native differently
                // const formData = new FormData();
                const formData = new URLSearchParams(); // we prefer to use URLSearchParams for native and web compatibility
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
                            hasAlreadyAuthenticateRef.current = true;
                            setUser(sessionData as AuthUSer);
                        }
                    }
                } else {
                    // For native: The server returns both tokens in the response
                    // We need to store these tokens securely and decode the user data
                    const tokens = await tokenResponse.json();
                    console.log("from token response: tokens", tokens);
                    hasAlreadyAuthenticateRef.current = true;
                    await handleNativeTokens(tokens);
                }
            } catch (e) {
                console.error("Error handling auth response:", e);
            } finally {
                setIsLoading(false);
            }
        } else if (response?.type === "cancel") {
            alert("Sign in cancelled");
        } else if (response?.type === "error") {
            setError(response?.error as AuthError);
        }

        if (authProvider === 'github' && githubResponse?.type === "success") {
            console.log("\n\n github Oauth login");

            if (hasAlreadyAuthenticateRef.current === true)
                return
            try {
                setIsLoading(true);
                const { code } = githubResponse.params;

                console.log("github response code", code);

                // we prefer to use URLSearchParams for native and web compatibility
                const formData = new URLSearchParams();
                formData.append("code", code);

                if (isWeb) {
                    formData.append("platform", "web");
                }

                if (request?.codeVerifier) {
                    formData.append("code_verifier", request.codeVerifier);
                } else {
                    console.warn("No code verifier found in request object");
                }

                let tokenResponse;
                try {
                    tokenResponse = await fetch(`${BASE_URL}/api/github/token`, {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: formData.toString(),
                        credentials: isWeb ? "include" : "same-origin", // Include cookies for web
                    });

                    // const clone = tokenResponse.clone();
                    // const json = await clone.json();
                    // console.log("token response", json);
                } catch (error) {
                    console.error("error from github token response", error);
                }

                if (isWeb) {
                    const userData = await tokenResponse?.json();

                    if (userData.success) {
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
                            if (!sessionData) return;
                            setUser(sessionData as AuthUSer);
                            hasAlreadyAuthenticateRef.current = true;
                        }
                    }
                } else {
                    const tokens = await tokenResponse?.json();

                    if (tokens.accessToken) {
                        console.log("from github token response: tokens", tokens);
                        hasAlreadyAuthenticateRef.current = true;
                        await handleNativeTokens(tokens);
                    } else {
                        console.error("from github token response: tokens", tokens.error)
                    }

                }
            } catch (e) {
                console.error("Error handling GitHub auth response:", e);
            } finally {
                setIsLoading(false);
            }
        } else if (githubResponse?.type === "cancel") {
            alert("Sign in cancelled");
            hasAlreadyAuthenticateRef.current = false;
        } else if (githubResponse?.type === "error") {
            setError(githubResponse?.error as AuthError);
            hasAlreadyAuthenticateRef.current = false;
        }
    }


    const handleNativeTokens = async (tokens: {
        accessToken: string;
        refreshToken: string;
    }) => {
        console.log("\n\n inside handleNativeTokens \n\n")
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = tokens;

        if (!newAccessToken || !newRefreshToken)
            return console.warn("\n\n no access token or refresh token found");

        // set the token state and persists them.
        if (newAccessToken) {
            setAccessToken(newAccessToken);
            await tokenCache?.saveToken(AUTH_TOKEN_NAME, newAccessToken);

            const decoded = jose.decodeJwt(newAccessToken);
            setUser(decoded as AuthUSer);
            setModalVisible(false);
        }
        if (newRefreshToken) {
            setRefreshToken(newRefreshToken);
            await tokenCache?.saveToken(REFRESH_TOKEN_NAME, newRefreshToken)
        }
        setTimeout(() => {
            if (isMounted.current) {
                router.push('/(tabs)');
            }
        }, 100);// redirect to the home page
    }

    const fetchWithAuth = async (url: string, options: RequestInit) => {
        if (isWeb) {
            // we include credential to send cookies
            const response = await fetch(url, {
                ...options,
                credentials: 'include'
            });

            // try to refetch in case of the error
            if (response.status === 401) {
                console.log('\n\n API request failed with 401, attempting to refresh the token!');

                await refreshAccessToken();

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
                const newAccessToken = await refreshAccessToken();

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
    const signIn = async () => {
        console.log("signIn");
        try {
            if (!request) {
                console.log("No request");
                return;
            }

            setAuthProvider('google'); // 👈 track intent
            await promptAsync();
        } catch (e) {
            console.log(e);
        }
    };

    // set the github signIn function
    const ghSignIn = async () => {
        console.log("ghSignIn");
        try {
            if (!githubRequest) {
                console.log("No request");
                return;
            }

            setAuthProvider('github'); // 👈 track intent
            await githubPromptAsync();
        } catch (e) {
            console.log(e);
        }
    }
    // const handleGithubLogin = async () => {
    // const result = await WebBrowser.openAuthSessionAsync(
    //     request?.url!,
    //     makeRedirectUri({
    //         scheme: APP_SCHEME,
    //     })
    // );

    // if (result.type === "success" && result.url) {
    //     const urlParams = new URLSearchParams(result.url.split("?")[1]);
    //     const code: any = urlParams.get("code");
    //     fetchAccessToken(code);
    // }




    // set signOut function
    const signOut = async () => {
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
            setAccessToken(null);
            setRefreshToken(null);
            setUser(null);
            hasAlreadyAuthenticateRef.current === false
        }
    };


    // const values = {
    //     user,
    //     signIn: () => signIn(promptAsync, request),
    //     signOut: () => signOut(isWeb, setAccessToken, setRefreshToken, setUser),
    //     fetchWithAuth: (url: string, options: RequestInit) => fetchWithAuth(url,
    //         options, refreshInProgressRef, isWeb, user as AuthUSer, accessToken as string),
    //     isLoading,
    //     error
    // }

    const values = {
        user,
        signIn: () => signIn(),
        githubSignin: () => ghSignIn(),
        signOut,
        fetchWithAuth,
        isLoading,
        error,
        modalVisible,
        setModalVisible
    }

    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = React.useContext(AuthContext);
    if (!context)
        throw new Error('useAuth must be used within an AuthProvider');
    return context;
}



