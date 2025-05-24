import { View, Text, TouchableOpacity, Image, Platform } from "react-native";
import React, { useEffect } from "react";
import { BlurView } from "expo-blur";
import { fontSizes, windowHeight, windowWidth } from "@/utils/app-constant";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import JWT from "expo-jwt";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { APP_SCHEME, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GOOGLE_CLIENT_ID } from "@/utils/env-constant";
import { useAuth } from "@/context/auth";


export default function AuthModal({
  setModalVisible,
}: {
  setModalVisible?: (modal: boolean) => void;
}) {

  const { signIn, isLoading, githubSignin, signOut } = useAuth();

  // const configureGoogleSignIn = () => {
  //   if (Platform.OS === "ios") {
  //     GoogleSignin.configure({
  //       // iosClientId: process.env.EXPO_PUBLIC_IOS_GOOGLE_CLIENT_ID,
  //       iosClientId: "959307778367-u0qdo2tfobdj4pggrqsi9k79pogp6k7o.apps.googleusercontent.com"
  //     });
  //   } else {
  //     GoogleSignin.configure({
  //       webClientId: GOOGLE_CLIENT_ID,
  //     });
  //   }
  // };

  // useEffect(() => {
  //   configureGoogleSignIn();
  // }, []);

  // // github auth start
  // const githubAuthEndpoints = {
  //   authorizationEndpoint: "https://github.com/login/oauth/authorize",
  //   tokenEndpoint: "https://github.com/login/oauth/access_token",
  //   revocationEndpoint: `https://github.com/settings/connections/applications/${GITHUB_CLIENT_ID}`,
  // };

  // const [request, response] = useAuthRequest(
  //   {
  //     clientId: GITHUB_CLIENT_ID!,
  //     clientSecret: GITHUB_CLIENT_SECRET!,
  //     scopes: ["identity"],
  //     redirectUri: makeRedirectUri({
  //       scheme: APP_SCHEME,
  //     }),
  //   },
  //   githubAuthEndpoints
  // );

  // useEffect(() => {
  //   if (response?.type === "success") {
  //     const { code } = response.params;
  //     fetchAccessToken(code);
  //   }
  // }, []);

  // const handleGithubLogin = async () => {
  //   const result = await WebBrowser.openAuthSessionAsync(
  //     request?.url!,
  //     makeRedirectUri({
  //       scheme: APP_SCHEME,
  //     })
  //   );

  //   if (result.type === "success" && result.url) {
  //     const urlParams = new URLSearchParams(result.url.split("?")[1]);
  //     const code: any = urlParams.get("code");
  //     fetchAccessToken(code);
  //   }
  // };

  // const fetchAccessToken = async (code: string) => {

  //   const tokenResponse = await fetch(
  //     "https://github.com/login/oauth/access_token",
  //     {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       },
  //       body: `client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}`,
  //     }
  //   );
  //   const tokenData = await tokenResponse.json();
  //   const access_token = tokenData.access_token;

  //   console.log("access_token", access_token);

  //   if (access_token) {
  //     fetchUserInfo(access_token);
  //   } else {
  //     console.error("Error fetching access token:", tokenData);
  //   }
  // };

  // const fetchUserInfo = async (token: string) => {
  //   const userResponse = await fetch("https://api.github.com/user", {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });

  //   const userData = await userResponse.json();

  //   console.log("User data from github:", userData);
  //   // await authHandler({
  //   //   name: userData.name!,
  //   //   email: userData.email!,
  //   //   avatar: userData.avatar_url!,
  //   // });
  // };
  // // github auth end

  // // google IOS signin
  // const googleSignin = async () => {
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const userInfo = await GoogleSignin.signIn();
  //     console.log({ userInfo });
  //     await authHandler({
  //       name: userInfo.data?.user.name!,
  //       email: userInfo.data?.user.email!,
  //       avatar: userInfo.data?.user.photo!,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const authHandler = async ({
  //   name,
  //   email,
  //   avatar,
  // }: {
  //   name: string;
  //   email: string;
  //   avatar: string;
  // }) => {
  //   const user = {
  //     name,
  //     email,
  //     avatar,
  //   };
  //   const token = JWT.encode(
  //     {
  //       ...user,
  //     },
  //     process.env.EXPO_PUBLIC_JWT_SECRET_KEY!
  //   );
  //   const res = await axios.post(
  //     `${process.env.EXPO_PUBLIC_SERVER_URI}/login`,
  //     {
  //       signedToken: token,
  //     }
  //   );
  //   await SecureStore.setItemAsync("accessToken", res.data.accessToken);
  //   await SecureStore.setItemAsync("name", name);
  //   await SecureStore.setItemAsync("email", email);
  //   await SecureStore.setItemAsync("avatar", email);

  // setModalVisible(false);
  //   router.push("/(tabs)");
  // };

  return (
    <BlurView // this is set for the background blur view
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <TouchableOpacity
        style={{
          width: windowWidth(420),
          height: windowHeight(250),
          marginHorizontal: windowWidth(50),
          backgroundColor: "#fff",
          borderRadius: 30,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: fontSizes.FONT35,
            fontFamily: "Poppins_700Bold",
          }}
        >
          Join
        </Text>
        <Text
          style={{
            fontSize: fontSizes.FONT35,
            fontFamily: "Poppins_700Bold",
          }}
        >
          EduconnectEd-cm
        </Text>
        <Text
          style={{
            fontSize: fontSizes.FONT17,
            paddingTop: windowHeight(5),
            fontFamily: "Poppins_300Light",
          }}
        >
          Aussi facile que votre imagination!
        </Text>
        <View
          style={{
            paddingVertical: windowHeight(10),
            flexDirection: "row",
            gap: windowWidth(20),
          }}
        >
          <TouchableOpacity
            onPressIn={() => {
              signIn();
              // setTimeout(() => {
              //   setModalVisible(false);
              // }, 2000);
            }}
            disabled={isLoading}
          >
            <Image
              source={require("@/assets/images/onboarding/google.png")}
              style={{
                width: windowWidth(40),
                height: windowHeight(40),
                resizeMode: "contain",
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              githubSignin();
              // setTimeout(() => {
              //   setModalVisible(false);
              // }, 2000);
            }}
          >
            <Image
              source={require("@/assets/images/onboarding/github.png")}
              style={{
                width: windowWidth(40),
                height: windowHeight(40),
                resizeMode: "contain",
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => signOut()}
          >
            <Image
              source={require("@/assets/images/onboarding/apple.png")}
              style={{
                width: windowWidth(40),
                height: windowHeight(40),
                resizeMode: "contain",
              }}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </BlurView>
  );
}