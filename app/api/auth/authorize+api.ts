import {
    GOOGLE_CLIENT_ID,
    BASE_URL,
    APP_SCHEME,
    GOOGLE_AUTH_URL,
    GOOGLE_REDIRECT_URI,
    GOOGLE_CLIENT_SECRET
} from '@/utils/env-constant';



// this endpoint is used when the user authorize to connect it account to
// google website. it triggers and send back to google by the server.
export async function GET(request: Request) {

    if (!GOOGLE_CLIENT_ID) {
        return Response.json(
            { error: "Missing GOOGLE_CLIENT_ID environment variable" },
            { status: 500 }
        );
    }

    const url = new URL(request.url);
    let idClientId: string;

    const internalClient = url.searchParams.get("client_id");
    const redirectUri = url.searchParams.get("redirect_uri");

    let platform;

    if (redirectUri === APP_SCHEME + "://") {
        platform = "mobile";
    } else if (redirectUri === BASE_URL) {
        platform = "web";
    } else {
        return Response.json({ error: "Invalid redirect_uri" }, { status: 400 });
    }

    // use state to drive redirect back to platform
    let state = platform + "|" + url.searchParams.get("state");

    if (internalClient === "google") {
        idClientId = GOOGLE_CLIENT_ID;
    } else {
        return Response.json({ error: "Invalid client" }, { status: 400 });
    }

    // additional enforcement
    if (!state) {
        return Response.json({ error: "Invalid state" }, { status: 400 });
    }


    const params = new URLSearchParams({
        client_id: idClientId,
        redirect_uri: GOOGLE_REDIRECT_URI, // this is the same as the one set on google console.
        response_type: "code", // this code is sent by google and be used to exchange with id client.
        scope: url.searchParams.get("scope") || "identity",
        state: state, // the platform is defined here.
        prompt: "select_account", // here we indicate that we need to select an account from the list.
    });

    // make a server redirect to google
    return Response.redirect(GOOGLE_AUTH_URL + "?" + params.toString());
}