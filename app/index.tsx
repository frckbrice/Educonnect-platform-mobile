import { useAuth } from "@/context/auth";
import { AUTH_TOKEN_NAME } from "@/utils/env-constant";
import { Redirect, useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";


export default function Index() {
  const [loggedInUser, setLoggedInUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isLoading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    (
      async () => {
        const token = await SecureStore.getItemAsync(AUTH_TOKEN_NAME) || null;
        setLoggedInUser(token ? true : false);
      }
    )();
    // signOut();
    console.log("checking if user is logged in: ", loggedInUser);
  },[]);

  return (
    <>
     {
        isLoading ? (
          <ActivityIndicator />
      ) : (
            <Redirect href={!loggedInUser ? "/onboarding" : "/(tabs)"} />
      )
     }
    </>
  );
}
