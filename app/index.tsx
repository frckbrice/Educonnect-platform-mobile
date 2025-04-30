import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { Redirect } from "expo-router";


export default function Index() {
  const [loggedInUser, setLoggedInUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (
      async () => {
      const token = await SecureStore.getItemAsync('access_token');
      setLoggedInUser(token? true : false);
      setLoading(false);
    }
  )();
  },[]);

  return (
    <>
     {
      loading ? (
        <View>
          <Text>Loading...</Text>
        </View>
      ) : (
        <Redirect href={!loggedInUser ? "/(routes)/onboarding": "/(tabs)"} />
      )
     }
    </>
  );
}
