import React from "react";
import { View, StyleSheet } from "react-native";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import { windowHeight, windowWidth } from "../../utils/app-constant";
import { useTheme } from "@/context/theme.context";
import { scale } from "react-native-size-matters";

export default function SkeltonLoader() {
    let { theme } = useTheme();

    return (
        <MotiView
            transition={{
                type: "timing",
            }}
            style={[styles.container, styles.padded]}
            animate={{ backgroundColor: theme.dark ? 'transparent' : "#fff" }}
        >
            {/* <Spacer /> */}
            <Skeleton
                width={windowWidth(440)}
                height={windowHeight(160)}
                colorMode={theme.dark ? "dark" : "light"}
            />
            <Spacer />
            <View style={{ flexDirection: "row", gap: windowWidth(15) }}>
                <Skeleton
                    colorMode={theme.dark ? "dark" : "light"}
                    radius="round"
                    height={windowWidth(80)}
                    width={windowWidth(80)}
                />
                <View>
                    <Skeleton
                        width={windowWidth(338)}
                        height={windowHeight(20)}
                        colorMode={theme.dark ? "dark" : "light"}
                    />
                    <Spacer />
                    <Skeleton
                        width={windowWidth(338)}
                        height={windowHeight(20)}
                        colorMode={theme.dark ? "dark" : "light"}
                    />
                    <Spacer />
                </View>
            </View>
        </MotiView>
    );
}

export const Spacer = ({ height = 16 }) => <View style={{ height }} />;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    padded: {
        padding: scale(14),
    },
});