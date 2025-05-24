import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { router, Slot, Stack } from "expo-router";
import { useTheme } from "@/context/theme.context";
import { fontSizes } from "@/utils/app-constant";
import { AntDesign } from "@expo/vector-icons";
import { scale } from "react-native-size-matters";

export default function _layout() {
    const { theme } = useTheme();

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: "Course Details",
                    headerTitleStyle: {
                        color: theme.dark ? "#fff" : "#000",
                        fontSize: fontSizes.FONT22,
                    },
                    headerStyle: { backgroundColor: theme.dark ? "#131313" : "#fff" },
                    headerShadowVisible: true,
                    headerBackVisible: true,
                    headerLeft: () => (
                        <TouchableOpacity
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: scale(5),
                            }}
                            onPress={() => router.back()}
                        >
                            <AntDesign
                                name="left"
                                size={scale(20)}
                                color={theme.dark ? "#fff" : "#005DE0"}
                            />
                            <Text
                                style={{
                                    color: theme?.dark ? "#fff" : "#005DE0",
                                    fontSize: fontSizes.FONT20,
                                }}
                            >
                                Back
                            </Text>
                        </TouchableOpacity>
                    ),
                    headerBackground: () => (
                        <View
                            style={{
                                backgroundColor: theme.dark ? "#131313" : "#fff",
                                shadowColor: theme.dark ? "#fff" : "#131313",
                                shadowOffset: {
                                    width: 0,
                                    height: .5,
                                },
                                shadowOpacity: 0.1,
                                shadowRadius: 1,
                                elevation: 5,
                            }}
                        />
                    ),
                }}
            />
        </Stack>
    );
}

const styles = StyleSheet.create({});