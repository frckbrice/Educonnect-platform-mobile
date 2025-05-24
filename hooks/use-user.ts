import React, { useEffect, useState, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { AuthUSer } from "@/components/auth/type";
import { API_URL } from "@/utils/env-constant";
import { UserType } from "@/config/global";

export const setAuthorizationHeader = async () => {
    const token = await SecureStore.getItemAsync("accessToken");
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
};

export default function useUser() {
    const [apiUser, setApiUser] = useState<UserType | null>();
    const [loader, setLoader] = useState(true);
    const [shouldRefetch, setShouldRefetch] = useState(false);

    const fetchUserData = useCallback(async () => {
        setLoader(true);
        if (apiUser)
            return setLoader(false);


        try {
            await setAuthorizationHeader();
            const response = await axios.get(
                `${API_URL}/users/current`
            );
            const { name, email, avatarUrl: avatar } = response.data.data;
            await SecureStore.setItemAsync("currentUser", JSON.stringify({ name, email, avatar }));

            setApiUser(response.data.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoader(false);
        }
    }, []);

    useEffect(() => {
        fetchUserData();
        return () => setShouldRefetch(false);
    }, [fetchUserData, shouldRefetch]);

    const refetch = () => {
        setShouldRefetch(true);
    };

    return { apiUser, loader, refetch };
}

export const useUserData = () => {
    const [apiUser, setApiUser] = useState<UserType | null>();

    useEffect(() => {
        (
            async () => {
                const userData = await SecureStore.getItemAsync("currentUser");
                if (userData) {
                    setApiUser(JSON.parse(userData));
                }
            }
        )()
    }, [])
    return {
        name: apiUser?.name,
        email: apiUser?.email,
        avatar: apiUser?.avatar,
    }
}