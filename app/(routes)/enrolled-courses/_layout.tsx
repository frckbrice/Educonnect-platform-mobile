import { StyleSheet, Text, Platform, TouchableOpacity } from "react-native";
import React from "react";
import { router, Stack } from "expo-router";
import { useTheme } from "@/context/theme.context";
import { fontSizes } from "@/utils/app-constant";
import { AntDesign } from "@expo/vector-icons";
import { scale } from "react-native-size-matters";
import { StatusBar } from "expo-status-bar";

export default function CourseDetailsLayout() {
    const { theme, isDark } = useTheme();

    // Safe scaling function that rounds to avoid precision errors
    const safeScale = (size: number) => Math.round(scale(size));

    return (
        <>
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{
                        headerShown: true,
                        headerTitle: Platform.OS === "ios" ? "Enrolled Courses" : "",
                        headerTitleStyle: {
                            color: theme.colors.text,
                            fontSize: safeScale(fontSizes.FONT18 || 18),
                            fontWeight: '600',
                        },
                        headerStyle: {
                            backgroundColor: theme.colors.background,

                        },
                        headerShadowVisible: true,
                        headerTintColor: theme.colors.text,
                        headerLeft: () => (
                            <TouchableOpacity
                                onPress={() => router.back()}
                                style={[
                                    styles.backButton,
                                    {
                                        backgroundColor: isDark
                                            ? 'rgba(255, 255, 255, 0.1)'
                                            : 'rgba(0, 0, 0, 0.05)',
                                    }
                                ]}
                                activeOpacity={0.7}
                            >
                                <AntDesign
                                    name="arrowleft"
                                    size={safeScale(20)}
                                    color={theme.colors.text}
                                    style={styles.backIcon}
                                />
                                <Text
                                    style={[
                                        styles.backText,
                                        {
                                            color: theme.colors.text,
                                            fontSize: safeScale(fontSizes.FONT16 || 16),
                                        },
                                    ]}
                                >
                                    Back
                                </Text>
                            </TouchableOpacity>
                        ),
                    }}
                />
            </Stack>
            <StatusBar
                style={isDark ? 'light' : 'dark'} // iOS only
                backgroundColor={theme.colors.background} // Android only
            />
        </>
    );
}

const styles = StyleSheet.create({
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        marginLeft: Platform.OS === 'ios' ? -8 : 0,
        marginTop: Platform.OS === 'ios' ? 4 : 22,
        marginBottom: 4,
        marginRight: Platform.OS !== 'ios' ? 20 : 0,
        minHeight: 36,
        // Removed marginTop and marginBottom that were causing misalignment
    },
    backIcon: {
        marginRight: 8,
    },
    backText: {
        fontWeight: '500',
        letterSpacing: 0.2,
    },
});