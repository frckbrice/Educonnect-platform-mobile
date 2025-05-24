import * as jose from "jose";
import {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
    COOKIE_NAME,
    REFRESH_COOKIE_NAME,
    COOKIE_MAX_AGE,
    JWT_EXPIRATION_TIME,
    JWT_SECRET,
    COOKIE_OPTIONS,
    REFRESH_TOKEN_EXPIRY,
    REFRESH_COOKIE_OPTIONS,
    API_URL,
    JWT_REFRESH_SECRET,
} from "@/utils/env-constant";

const MAX_RETRIES = 3;
let attempts = 0;
let success = false;

function fetchGoogleAccessToken(code: string) {
    return fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: GOOGLE_REDIRECT_URI,
            grant_type: "authorization_code",
            code: code,
        }),
    });
}

// function to create a new access token and refresh token
async function createTokens(id_token: string, userData?: any) {

    let accessToken = "";
    let refreshToken = "";
    // Current timestamp in seconds
    let user;
    const issuedAt = Math.floor(Date.now() / 1000);
    if (id_token) {
        const userInfo = jose.decodeJwt(id_token) as object;

        // Create a new object without the exp property from the original token
        const { exp, ...userInfoWithoutExp } = userInfo as any;

        // User id
        const sub = (userInfo as { sub: string }).sub;

        // Generate a unique jti (JWT ID) for the refresh token
        const jti = crypto.randomUUID();

        // Create access token (short-lived)
        accessToken = await new jose.SignJWT(userInfoWithoutExp)
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime(JWT_EXPIRATION_TIME)
            .setSubject(sub)
            .setIssuedAt(issuedAt)
            .sign(new TextEncoder().encode(JWT_SECRET));

        // Create refresh token (long-lived)
        refreshToken = await new jose.SignJWT({
            sub,
            jti, // Include a unique ID for this refresh token
            type: "refresh",
            // Include all user information in the refresh token
            // This ensures we have the data when refreshing tokens
            name: (userInfo as any).name,
            email: (userInfo as any).email,
            picture: (userInfo as any).picture,
            given_name: (userInfo as any).given_name,
            family_name: (userInfo as any).family_name,
            email_verified: (userInfo as any).email_verified,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime(REFRESH_TOKEN_EXPIRY)
            .setIssuedAt(issuedAt)
            .sign(new TextEncoder().encode(JWT_REFRESH_SECRET));

        user = {
            name: (userInfo as any).name,
            email: (userInfo as any).email,
            picture: (userInfo as any).picture,
            email_verified: (userInfo as any).email_verified,
        }
    } else {

        const sub = crypto.randomUUID();

        // Current timestamp in seconds
        const issuedAt = Math.floor(Date.now() / 1000);

        // Generate a unique jti (JWT ID) for the refresh token
        const jti = crypto.randomUUID();
        // Create access token (short-lived)
        accessToken = await new jose.SignJWT(userData)
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime(JWT_EXPIRATION_TIME)
            .setSubject(sub)
            .setIssuedAt(issuedAt)
            .sign(new TextEncoder().encode(JWT_SECRET));

        // Create refresh token (long-lived)
        refreshToken = await new jose.SignJWT({
            sub,
            jti, // Include a unique ID for this refresh token
            type: "refresh",
            // Include all user information in the refresh token
            // This ensures we have the data when refreshing tokens
            name: (userData as any).name,
            email: (userData as any).email,
            picture: (userData as any).picture,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime(REFRESH_TOKEN_EXPIRY)
            .setIssuedAt(issuedAt)
            .sign(new TextEncoder().encode(JWT_REFRESH_SECRET));

    }


    // Return the tokens
    return {
        accessToken,
        refreshToken,
        issuedAt,
        user
    }
}

// persist data to database
async function persistDataToDatabase(userData: object, accessToken: string) {
    try {
        // make the api call here to persist the user to database
        const res = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...userData })
        });

        if (!res.ok) {
            const text = await res.text(); // get raw HTML/text if not valid JSON
            console.error('Response not OK:', res.status, text);
        } else {
            const data = await res.json();
            console.log('tokens', data);

            if (!data.success) {
                return Response.json(
                    {
                        error: data.error,
                        message: data.message,
                    },
                    {
                        status: 400,
                    }
                );
            }
        }
    } catch (error) {
        console.error("Error sending data to api server:", error);
        return Response.json(
            { error: "Faile to persist user data" },
            { status: 500 }
        );
    }
}

// function to persist data to database
async function persistData(userData: any, accessToken: string) {
    while (attempts < MAX_RETRIES && !success) {
        try {
            await persistDataToDatabase(userData, accessToken);
            success = true; // If the API call is successful, set success to true
        } catch (error) {
            console.error("Error persisting data to database:", error);
            attempts++;
            if (attempts >= MAX_RETRIES) {
                return Response.json(
                    { error: "Failed to persist user data" },
                    { status: 500 }
                );
            }
            // Optionally, you can add a delay before retrying
            await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
        }
    }
}

export async function POST(request: Request) {
    const body = await request.text();  // because the body is url encoded and not json 
    const params = new URLSearchParams(body);
    const code = params.get("code") as string;
    const platform = (params.get("platform") as string) || "native"; // Default to native if not specified


    if (!code) {
        return Response.json(
            { error: "Missing authorization code" },
            { status: 400 }
        );
    }

    // Handle Google OAuth
    const response = await fetchGoogleAccessToken(code);

    const data = await response.json();

    if (!data.id_token) {
        return Response.json(
            { error: "from google token: Missing required parameters" },
            { status: 400 }
        );
    }

    if (data.error) {
        return Response.json(
            {
                error: data.error,
                error_description: data.error_description,
                message:
                    "OAuth validation error - please ensure the app complies with Google's OAuth 2.0 policy",
            },
            {
                status: 400,
            }
        );
    }

    const { accessToken, refreshToken, issuedAt, user: userInfo } = await createTokens(data.id_token);

    // Handle web platform with cookies
    if (platform === "web") {
        // Create a response with the token in the body
        const response = Response.json({
            success: true,
            issuedAt: issuedAt,
            expiresAt: issuedAt + COOKIE_MAX_AGE,
        });

        // Set the access token in an HTTP-only cookie
        response.headers.set(
            "Set-Cookie",
            `${COOKIE_NAME}=${accessToken}; Max-Age=${COOKIE_OPTIONS.maxAge}; Path=${COOKIE_OPTIONS.path
            }; ${COOKIE_OPTIONS.httpOnly ? "HttpOnly;" : ""} ${COOKIE_OPTIONS.secure ? "Secure;" : ""
            } SameSite=${COOKIE_OPTIONS.sameSite}`
        );

        // Set the refresh token in a separate HTTP-only cookie
        response.headers.append(
            "Set-Cookie",
            `${REFRESH_COOKIE_NAME}=${refreshToken}; Max-Age=${REFRESH_COOKIE_OPTIONS.maxAge
            }; Path=${REFRESH_COOKIE_OPTIONS.path}; ${REFRESH_COOKIE_OPTIONS.httpOnly ? "HttpOnly;" : ""
            } ${REFRESH_COOKIE_OPTIONS.secure ? "Secure;" : ""} SameSite=${REFRESH_COOKIE_OPTIONS.sameSite
            }`
        );
        console.log("Access token set in cookie:");

        return response;
    }

    // persist the data to the database with retry in case of failure
    console.log("persisting user data to database");
    // persist the data to the database with retry in case of failure
    try {
        await persistData(userInfo, accessToken);
    } catch (error) {
        // prevent to sent back tokens while the user data are not persisted to database
        return Response.json({
            error: "Failed to persist user data",
            accessToken: null,
            refreshToken: null
        }, { status: 500 })
    }
    // If the platform is native, return the tokens in the response
    return Response.json({
        accessToken,
        refreshToken,
    });

}
