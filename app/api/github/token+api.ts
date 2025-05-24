import * as jose from "jose";
import {
    JWT_EXPIRATION_TIME,
    JWT_SECRET,
    REFRESH_TOKEN_EXPIRY,
    API_URL,
    JWT_REFRESH_SECRET,
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
} from "@/utils/env-constant";

const MAX_RETRIES = 3;
let attempts = 0;
let success = false;


export async function POST(request: Request) {

    console.log("welcome to github oauth token reponse handler")
    const body = await request.text();  // because the body is url encoded and not json 
    const params = new URLSearchParams(body);
    const code = params.get("code") as string;
    // const platform = (params.get("platform") as string) || "native"; // Default to native if not specified


    if (!code) {
        return Response.json(
            { error: "Missing authorization code" },
            { status: 400 }
        );
    }

    console.log("\n\n from github token, received code: ", code);
    const access_token = await fetchGithubAccessToken(code);
    console.log("github access_token", access_token);

    if (!access_token) return Response.json({
        error: "Failed to fetch access token",
        accessToken: null,
        refreshToken: null
    }, { status: 500 })


    const userInfo = await fetchUserInfo(access_token);
    console.log("github userInfo", userInfo);


    if (!userInfo) {
        return Response.json(
            { error: "Missing user info" },
            { status: 400 }
        );
    }

    console.log("persisting user data to database");
    // persist the data to the database with retry in case of failure
    try {
        await persistData(userInfo, access_token);
    } catch (error) {
        // prevent to sent back tokens while the user data are not persisted to database
        return Response.json({
            error: "Failed to persist user data",
            accessToken: null,
            refreshToken: null
        }, { status: 500 })
    }
    const { accessToken, refreshToken } = await createTokens("", userInfo);

    return Response.json({
        accessToken,
        refreshToken,
    });
}


// function to create a new access token and refresh token
async function createTokens(id_token: string, userData?: any) {

    let accessToken = "";
    let refreshToken = "";
    // Current timestamp in seconds
    let user;
    const issuedAt = Math.floor(Date.now() / 1000);


    const sub = crypto.randomUUID();

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
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ ...userData })
        });

        if (!res.ok) {
            const text = await res.text(); // get raw HTML/text if not valid JSON
            console.error('Response not OK:', res.status, text);
        } else {
            const data = await res.json();
            console.log('response data from api server', data);

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

// fetch gitbuh access token
async function fetchGithubAccessToken(code: string) {
    try {
        const tokenResponse = await fetch(
            "https://github.com/login/oauth/access_token",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}`,
            }
        );
        const tokenData = await tokenResponse.json();
        const access_token = tokenData.access_token;

        return access_token;
    } catch (error) {
        console.error("Error fetching access token:", error);
        return null;
    }

}

// fetch github user info
const fetchUserInfo = async (token: string) => {
    try {
        const userResponse = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const userData = await userResponse.json();

        return {
            name: userData.name,
            email: userData.email,
            avatar: userData.avatar_url,
            html_url: userData.html_url,
        };
    } catch (error) {
        console.error("Error fetching user info:", error);
        return null;
    }
};

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
