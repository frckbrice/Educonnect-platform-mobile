import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useTheme } from "@/context/theme.context";
import { Tabs } from "expo-router";
import { Feather, Ionicons, Octicons } from "@expo/vector-icons";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { fontSizes, IsAndroid, IsIOS, IsIPAD } from "@/utils/app-constant"
import { BlurView } from "expo-blur";
import useUser from "@/hooks/use-user";

export default function _layout() {
    const { theme } = useTheme();
    const { loader } = useUser();

    return (
        <Tabs
            screenOptions={({ route }) => {
                return {
                    tabBarIcon: ({ color }) => {
                        let iconName;
                        if (route.name === "index") {
                            iconName = (
                                <Feather
                                    name="home"
                                    size={moderateScale((27))}
                                    style={{ width: IsIPAD ? scale(20) : "auto" }}
                                    color={color}
                                />
                            );
                        } else if (route.name === "courses/index") {
                            iconName = (
                                <Feather
                                    name="book-open"
                                    size={moderateScale((27))}
                                    style={{ width: IsIPAD ? scale(20) : "auto" }}
                                    color={color}
                                />
                            );
                        } else if (route.name === "resources/index") {
                            iconName = (
                                <Ionicons
                                    name="document-text-outline"
                                    size={moderateScale((27))}
                                    style={{ width: IsIPAD ? scale(20) : "auto" }}
                                    color={color}
                                />
                            );
                        } else if (route.name === "profile/index") {
                            iconName = (
                                <Octicons
                                    name="person"
                                    size={moderateScale((27))}
                                    style={{ width: IsIPAD ? scale(20) : "auto" }}
                                    color={color}
                                />
                            );
                        }
                        return iconName;
                    },
                    tabBarActiveTintColor: theme.dark ? "#19C964" : "#4A90E2",
                    tabBarInactiveTintColor: theme.dark ? "#fff" : "#8e8e93",
                    headerShown:
                        route.name === "courses/index" || route.name === "resources/index"
                            ? true
                            : false,
                    headerTitle:
                        route.name === "courses/index"
                            ? "Courses"
                            : route.name === "resources/index"
                                ? "Video Lessons"
                                : "",
                    headerTitleStyle: {
                        color: theme.dark ? "#fff" : "#000",
                        textAlign: "center",
                        width: scale(320),
                        fontSize: fontSizes.FONT22,
                        fontFamily: "Poppins_400Regular",
                    },
                    headerBackgroundContainerStyle: {
                        backgroundColor: theme.dark ? "#131313" : "#fff",
                        shadowColor: theme.dark ? "#fff" : "#000",
                        shadowOpacity: theme.dark ? 0.1 : 0.1,
                        shadowOffset: { width: 0, height: 1 },
                        shadowRadius: 1,
                        elevation: 1,
                    },
                    headerBackground: () => (
                        <BlurView
                            intensity={theme.dark ? 70 : 80}
                            style={{
                                borderTopLeftRadius: scale(20),
                                borderTopRightRadius: scale(20),
                                overflow: "hidden",
                                backgroundColor: "transparent",
                            }}
                        />
                    ),
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        position: IsIOS ? (theme.dark ? "absolute" : "static") : "absolute",
                        borderTopLeftRadius: IsAndroid ? 0 : IsIPAD ? scale(20) : scale(35),
                        borderTopRightRadius: IsAndroid
                            ? 0
                            : IsIPAD
                                ? scale(20)
                                : scale(35),
                        borderTopWidth: 0,
                        height: verticalScale(55),
                        opacity: loader ? 0 : 1,
                        transition: "opacity 0.3s ease-in-out",
                    },
                    tabBarBackground: () => {
                        return (
                            <>
                                {IsIOS && !theme.dark ? (
                                    <View
                                        style={{
                                            ...StyleSheet.absoluteFillObject,
                                            backgroundColor: "#fff",
                                            borderTopLeftRadius: IsAndroid
                                                ? 0
                                                : IsIPAD
                                                    ? scale(25)
                                                    : scale(35),
                                            borderTopRightRadius: IsAndroid
                                                ? 0
                                                : IsIPAD
                                                    ? scale(25)
                                                    : scale(35),
                                            overflow: "hidden",
                                        }}
                                    />
                                ) : (
                                    <BlurView
                                        intensity={theme.dark ? (IsAndroid ? 10 : 60) : 100}
                                        style={{
                                            ...StyleSheet.absoluteFillObject,
                                            borderTopLeftRadius: IsAndroid
                                                ? 0
                                                : IsIPAD
                                                    ? scale(25)
                                                    : scale(35),
                                            borderTopRightRadius: IsAndroid
                                                ? 0
                                                : IsIPAD
                                                    ? scale(25)
                                                    : scale(35),
                                            overflow: "hidden",
                                            backgroundColor: IsAndroid
                                                ? theme.dark
                                                    ? "#131313"
                                                    : "#fff"
                                                : theme.dark
                                                    ? "transparent"
                                                    : "#fff",
                                        }}
                                    />
                                )}
                            </>
                        );
                    },
                };
            }}
        >
            <Tabs.Screen name="index" />
            <Tabs.Screen name="courses/index" />
            <Tabs.Screen name="resources/index" />
            <Tabs.Screen name="profile/index" />
        </Tabs>
    );
}