import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { scale, verticalScale } from "react-native-size-matters";
import { useTheme } from "@/context/theme.context";
import { fontSizes } from "@/utils/app-constant";

export default function CourseDetailsTabs({
    activeButton,
    setActiveButton,
    reviewsFetchingHandler,
}: {
    activeButton: string;
    setActiveButton: (e: string) => void;
    reviewsFetchingHandler: () => void;
}) {
    const { theme } = useTheme();

    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "center",
                marginTop: verticalScale(15),
                marginHorizontal: scale(8),
                backgroundColor: theme.dark ? "#2A2D32" : "#E1E9F8",
                borderRadius: scale(50),
                height: verticalScale(35),
            }}
        >
            <TouchableOpacity
                style={{
                    paddingHorizontal: scale(25),
                    height: verticalScale(32),
                    justifyContent: "center",
                    backgroundColor:
                        activeButton === "About"
                            ? "#2467EC"
                            : theme.dark
                                ? "#2A2D32"
                                : "transparent",
                    borderRadius: scale(50),
                }}
                onPress={() => setActiveButton("About")}
            >
                <Text
                    style={{
                        color:
                            activeButton === "About" ? "#fff" : theme.dark ? "#ffff" : "#000",
                        fontFamily: "Poppins_500Medium",
                        fontSize: fontSizes.FONT20,
                    }}
                >
                    About
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    paddingHorizontal: scale(25),
                    height: verticalScale(32),
                    justifyContent: "center",
                    backgroundColor:
                        activeButton === "Lessons"
                            ? "#2467EC"
                            : theme.dark
                                ? "#2A2D32"
                                : "transparent",
                    borderRadius: scale(50),
                }}
                onPress={() => setActiveButton("Lessons")}
            >
                <Text
                    style={{
                        color:
                            activeButton === "About" ? "#fff" : theme.dark ? "#fff" : "#000",
                        fontFamily: "Poppins_500Medium",
                        fontSize: fontSizes.FONT20,
                    }}
                >
                    Lessons
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    paddingHorizontal: scale(25),
                    height: verticalScale(32),
                    justifyContent: "center",
                    backgroundColor:
                        activeButton === "Reviews"
                            ? "#2467EC"
                            : theme.dark
                                ? "#2A2D32"
                                : "transparent",
                    borderRadius: scale(50),
                }}
                onPress={() => reviewsFetchingHandler()}
            >
                <Text
                    style={{
                        color:
                            activeButton === "About" ? "#fff" : theme.dark ? "#ffff" : "#000",
                        fontFamily: "Poppins_500Medium",
                        fontSize: fontSizes.FONT20,
                    }}
                >
                    Reviews
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({});
