import * as jose from "jose";
import { COOKIE_NAME, JWT_SECRET } from "@/utils/env-constant";

export async function GET(request: Request) {
    try {
        // Get the cookie from the request
        const cookieHeader = request.headers.get("cookie");
        if (!cookieHeader) {
            return Response.json({ error: "Not authenticated" }, { status: 401 });
        }

        // Parse cookies and their attributes
        const cookies: Record<string, Record<string, string>> = {};

        cookieHeader.split(";").forEach((cookie) => {
            const trimmedCookie = cookie.trim();

            // Check if this is a cookie-value pair or an attribute
            if (trimmedCookie.includes("=")) {
                const [key, value] = trimmedCookie.split("=");
                const cookieName = key.trim();

                // Initialize the cookie entry if it doesn't exist
                if (!cookies[cookieName]) {
                    cookies[cookieName] = { value: value };
                } else {
                    cookies[cookieName].value = value;
                }
            } else if (trimmedCookie.toLowerCase() === "httponly") {
                // Handle HttpOnly attribute
                const lastCookieName = Object.keys(cookies).pop();
                if (lastCookieName) {
                    cookies[lastCookieName].httpOnly = "true";
                }
            } else if (trimmedCookie.toLowerCase().startsWith("expires=")) {
                // Handle Expires attribute
                const lastCookieName = Object.keys(cookies).pop();
                if (lastCookieName) {
                    cookies[lastCookieName].expires = trimmedCookie.substring(8);
                }
            } else if (trimmedCookie.toLowerCase().startsWith("max-age=")) {
                // Handle Max-Age attribute
                const lastCookieName = Object.keys(cookies).pop();
                if (lastCookieName) {
                    cookies[lastCookieName].maxAge = trimmedCookie.substring(8);
                }
            }
        });

        // Get the auth token from cookies
        if (!cookies[COOKIE_NAME] || !cookies[COOKIE_NAME].value) {
            return Response.json({ error: "Not authenticated" }, { status: 401 });
        }

        const token = cookies[COOKIE_NAME].value;

        try {
            // Verify the token
            const verified = await jose.jwtVerify(
                token,
                new TextEncoder().encode(JWT_SECRET)
            );

            // Calculate cookie expiration time
            let cookieExpiration: number | null = null;

            // If we have Max-Age, use it to calculate expiration
            if (cookies[COOKIE_NAME].maxAge) {
                const maxAge = parseInt(cookies[COOKIE_NAME].maxAge, 10);
                // Calculate when the cookie will expire based on Max-Age
                // We don't know exactly when it was set, but we can estimate
                // using the token's iat (issued at) claim if available
                const issuedAt =
                    (verified.payload.iat as number) || Math.floor(Date.now() / 1000);
                cookieExpiration = issuedAt + maxAge;
            }

            // Return the user data from the token payload along with expiration info
            return Response.json({
                ...verified.payload,
                cookieExpiration,
            });
        } catch (error) {
            // Token is invalid or expired
            return Response.json({ error: "Invalid token" }, { status: 401 });
        }
    } catch (error) {
        console.error("Session error:", error);
        return Response.json({ error: "Server error" }, { status: 500 });
    }
}
export async function POST(request: Request) {
    try {
        const { user } = await request.json();

        // Create a new JWT token
        const token = await new jose.SignJWT(user)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt(Math.floor(Date.now() / 1000))
            .setExpirationTime("2h")
            .sign(new TextEncoder().encode(JWT_SECRET));

        // Set the cookie with the token
        const headers = new Headers();
        headers.append(
            "Set-Cookie",
            `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=7200; SameSite=Strict`
        );

        return Response.json({ message: "Logged in successfully" }, { headers });
    } catch (error) {
        console.error("Session error:", error);
        return Response.json({ error: "Server error" }, { status: 500 });
    }
}
export async function DELETE(request: Request) {
    try {
        // Clear the cookie by setting its Max-Age to 0
        const headers = new Headers();
        headers.append(
            "Set-Cookie",
            `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`
        );

        return Response.json({ message: "Logged out successfully" }, { headers });
    } catch (error) {
        console.error("Session error:", error);
        return Response.json({ error: "Server error" }, { status: 500 });
    }
}
// This code handles user session management using JWT tokens and cookies.
// It provides three main functions: GET, POST, and DELETE.
//
// 1. GET: Retrieves the user session by verifying the JWT token stored in cookies.
//    - If the token is valid, it returns the user data and cookie expiration time.
//    - If the token is invalid or expired, it returns a 401 Unauthorized response.
//
// 2. POST: Creates a new JWT token for the user and sets it in a cookie.
//    - The cookie is marked as HttpOnly, has a Max-Age of 2 hours, and is set to SameSite=Strict.
//    - This function is typically used for user login.
//
// 3. DELETE: Clears the user session by setting the Max-Age of the cookie to 0.
//    - This effectively logs the user out by removing the cookie from the browser.
//    - It returns a success message along with the updated headers.
//
// The code uses the jose library for JWT handling and sets appropriate cookie attributes for security.
// It also includes error handling for various scenarios, such as missing cookies or server errors.
// Overall, this code provides a secure and efficient way to manage user sessions in a web application.
// The JWT_SECRET and COOKIE_NAME constants are used to sign and verify the JWT tokens and to name the cookie, respectively.
// The JWT_SECRET should be kept secret and not exposed in the client-side code.
// The COOKIE_NAME is used to identify the cookie in the request and response headers.
// The code is designed to be used in a server-side environment, such as a Node.js application, where it can handle HTTP requests and manage user sessions securely.
// The JWT token is signed with the HS256 algorithm, which is a symmetric key algorithm.
// The token includes the user data in its payload, which can be accessed after verification.
// The cookie is set with the HttpOnly attribute to prevent client-side scripts from accessing it, enhancing security against XSS attacks.
// The SameSite attribute is set to Strict to prevent CSRF attacks by ensuring that the cookie is only sent in first-party contexts.
// The Max-Age attribute is set to 7200 seconds (2 hours) for the JWT token, after which the token will expire and the user will need to log in again.
// The code is structured to handle errors gracefully, returning appropriate HTTP status codes and messages for different scenarios.
// The use of async/await syntax allows for cleaner and more readable asynchronous code.
// The code is modular and can be easily integrated into a larger application, making it a good choice for managing user sessions in modern web applications.
// The JWT token can be used for authentication and authorization in subsequent API requests, allowing the server to verify the user's identity and permissions.