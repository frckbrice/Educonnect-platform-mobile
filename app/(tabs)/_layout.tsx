import { useTheme } from "@/context/theme.context";
import useUser from "@/hooks/use-user";
import { fontSizes, IsAndroid, IsIPAD } from "@/utils/app-constant";
import { Feather, Ionicons, Octicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export default function _layout() {
    const { theme } = useTheme();
    const { loader } = useUser();

    return (
        <Tabs
            screenOptions={({ route }) => {
                return {
                    tabBarIcon: ({ color, focused }) => {
                        let iconName;
                        const iconSize = moderateScale(focused ? 28 : 26);
                        const iconStyle = {
                            ...(IsIPAD ? { width: scale(20) } : {}),
                            transform: focused ? [{ translateY: -1 }] : [{ translateY: 0 }]
                        };

                        if (route.name === "index") {
                            iconName = (
                                <Feather
                                    name="home"
                                    size={iconSize}
                                    style={iconStyle}
                                    color={color}
                                />
                            );
                        } else if (route.name === "courses/index") {
                            iconName = (
                                <Feather
                                    name="book-open"
                                    size={iconSize}
                                    style={iconStyle}
                                    color={color}
                                />
                            );
                        } else if (route.name === "resources/index") {
                            iconName = (
                                <Ionicons
                                    name="document-text-outline"
                                    size={iconSize}
                                    style={iconStyle}
                                    color={color}
                                />
                            );
                        } else if (route.name === "profile/index") {
                            iconName = (
                                <Octicons
                                    name="person"
                                    size={iconSize}
                                    style={iconStyle}
                                    color={color}
                                />
                            );
                        }
                        return iconName;
                    },

                    tabBarActiveTintColor: theme.dark ? "#19C964" : "#4A90E2",
                    tabBarInactiveTintColor: theme.dark ? "#8E8E93" : "#8E8E93",

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
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        borderTopLeftRadius: IsAndroid ? scale(25) : IsIPAD ? scale(20) : scale(35),
                        borderTopRightRadius: IsAndroid ? scale(25) : IsIPAD ? scale(20) : scale(35),
                        borderTopWidth: 0,
                        height: Platform.select({
                            ios: verticalScale(55) + (IsIPAD ? 0 : 34), // Add safe area for iPhone
                            android: verticalScale(60),
                        }),
                        paddingBottom: Platform.select({
                            ios: IsIPAD ? verticalScale(8) : verticalScale(20),
                            android: verticalScale(8),
                        }),
                        paddingTop: verticalScale(8),
                        opacity: loader ? 0 : 1,
                        elevation: IsAndroid ? 20 : 0,
                        shadowColor: theme.dark ? "#000" : "#000",
                        shadowOffset: { width: 0, height: -4 },
                        shadowOpacity: theme.dark ? 0.3 : 0.1,
                        shadowRadius: 12,
                        overflow: "hidden",
                    },

                    tabBarBackground: () => {
                        return (
                            <BlurView
                                intensity={theme.dark ? (IsAndroid ? 30 : 60) : (IsAndroid ? 40 : 80)}
                                tint={theme.dark ? "dark" : "light"}
                                style={{
                                    ...StyleSheet.absoluteFillObject,
                                    borderTopLeftRadius: IsAndroid ? scale(25) : IsIPAD ? scale(20) : scale(35),
                                    borderTopRightRadius: IsAndroid ? scale(25) : IsIPAD ? scale(20) : scale(35),
                                    overflow: "hidden",
                                    backgroundColor: theme.dark
                                        ? "rgba(19, 19, 19, 0.85)"
                                        : "rgba(248, 249, 250, 0.85)",
                                }}
                            >
                                {/* Additional overlay for better contrast on Android */}
                                {IsAndroid && (
                                    <View
                                        style={{
                                            ...StyleSheet.absoluteFillObject,
                                            backgroundColor: theme.dark
                                                ? "rgba(19, 19, 19, 0.2)"
                                                : "rgba(255, 255, 255, 0.2)",
                                        }}
                                    />
                                )}

                                {/* Subtle gradient overlay */}
                                {/* To use gradients in React Native, use a library like 'react-native-linear-gradient' */}
                                {/* Example using LinearGradient (make sure to install and import it): */}
                                {/*  */}
                                <LinearGradient
                                    colors={
                                        theme.dark
                                            ? ['rgba(19, 19, 19, 0)', 'rgba(19, 19, 19, 0.1)']
                                            : ['rgba(248, 249, 250, 0)', 'rgba(248, 249, 250, 0.1)']
                                    }
                                    start={{ x: 0.5, y: 0 }}
                                    end={{ x: 0.5, y: 1 }}
                                    style={StyleSheet.absoluteFillObject}
                                />

                                {/* Fallback: Use a transparent background if you don't want to add a dependency */}
                                <View
                                    style={{
                                        ...StyleSheet.absoluteFillObject,
                                        backgroundColor: 'transparent',
                                    }}
                                />
                            </BlurView>
                        );
                    },

                    // Enhanced tab bar item styling
                    tabBarItemStyle: {
                        paddingVertical: verticalScale(4),
                        borderRadius: scale(12),
                        marginHorizontal: scale(2),
                    },

                    // Add subtle press animation
                    tabBarButton: (props) => {
                        // Remove props with null values (e.g., delayLongPress: null)
                        const filteredProps = Object.fromEntries(
                            Object.entries(props).filter(
                                ([key, value]) => value !== null
                            )
                        );
                        return (
                            <TouchableOpacity
                                {...filteredProps}
                                style={[
                                    props.style,
                                    {
                                        borderRadius: scale(12),
                                        overflow: "hidden",
                                    }
                                ]}
                                activeOpacity={0.7}
                            />
                        );
                    },
                };
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                }}
            />
            <Tabs.Screen
                name="courses/index"
                options={{
                    title: "Courses",
                }}
            />
            <Tabs.Screen
                name="resources/index"
                options={{
                    title: "Resources",
                }}
            />
            <Tabs.Screen
                name="profile/index"
                options={{
                    title: "Profile",
                }}
            />
        </Tabs>
    );
}