import { BASE_URL, APP_SCHEME } from "@/utils/env-constant";

// this code helps unifying the behaviour of the app accross platform.
// either web or mobile.
export async function GET(request: Request) {

    const incomingParams = new URLSearchParams(request.url.split("?")[1]);
    const combinedPlatformAndState = incomingParams.get("state");

    console.log("combinedPlatformAndState", combinedPlatformAndState);

    if (!combinedPlatformAndState) {
        return Response.json({ error: "Invalid state" }, { status: 400 });
    }
    // strip platform to return state as it was set on the client
    // like this "platform + "|" + url.searchParams.get("state")"
    const platform = combinedPlatformAndState.split("|")[0];
    const state = combinedPlatformAndState.split("|")[1];

    const outgoingParams = new URLSearchParams({
        code: incomingParams.get("code")?.toString() || "",
        state,
    });

    return Response.redirect(
        (platform === "web" ? BASE_URL : APP_SCHEME + "://") + "?" + outgoingParams.toString()
    );
}
