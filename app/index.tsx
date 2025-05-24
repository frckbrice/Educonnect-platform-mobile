import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { Redirect } from "expo-router";
import { useAuth } from "@/context/auth";
import { AUTH_TOKEN_NAME } from "@/utils/env-constant";


export default function Index() {
  const [loggedInUser, setLoggedInUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isLoading, signOut } = useAuth();

  useEffect(() => {
    (
      async () => {
        const token = await SecureStore.getItemAsync(AUTH_TOKEN_NAME) || null;
        setLoggedInUser(token ? true : false);
      }
    )();
    // signOut();
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
