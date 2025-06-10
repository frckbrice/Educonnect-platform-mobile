import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { useTheme } from "@/context/theme.context";
import { scale, verticalScale } from "react-native-size-matters";
import { fontSizes } from "@/utils/app-constant";
import { Entypo, Feather } from "@expo/vector-icons";
import { CourseDataType } from "@/config/global";
import * as WebBrowser from "expo-web-browser";


type TcourseLesson = {
    description: string;
    title: string;
    videoLength: string;
    videoSection: string;
    videoUrl: string;
}

export default function CourseLesson({
    courseDetails,
}: {
    courseDetails: CourseDataType[];
}) {
    const { theme } = useTheme();
    const [visibleSections, setVisibleSections] = useState<Set<string>>(
        new Set<string>()
    );

    const videoSections: string[] = [
        ...new Set<string>(
            courseDetails.map((video: CourseDataType) => video.videoSection)
        ),
    ];

    const toggleSection = (section: string) => {
        const newVisibleSections = new Set(visibleSections);
        if (newVisibleSections.has(section)) {
            newVisibleSections.delete(section);
        } else {
            newVisibleSections.add(section);
        }
        setVisibleSections(newVisibleSections);
    };


    return (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    paddingVertical: verticalScale(5),
                    borderRadius: 8,
                }}
            >
                <View>
                    {videoSections.map((video: string, index: number) => {
                        const isSectionVisible = visibleSections.has(video);

                        // filter videoes by section
                        const sectionVideos: TcourseLesson[] = courseDetails?.filter(
                            (i: any) => i.videoSection === video
                        );

                        console.log("\n\n is section visible: ", isSectionVisible, "\n\n")

                        return (
                            <>
                                <View
                                    style={{
                                        marginBottom: !isSectionVisible ? verticalScale(5) : null,
                                        borderBottomColor: "#DCDCDC",
                                        paddingVertical: verticalScale(5),
                                        borderBottomWidth: !isSectionVisible ? 1 : 0,
                                    }}
                                    key={index + new Date().getTime() + 1}
                                >
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        {/* open in the web browser  */}
                                        <Text
                                            style={{
                                                fontSize: fontSizes.FONT21,
                                                width: scale(320),
                                                fontFamily: "Poppins_500Medium",
                                                color: theme.dark ? "#fff" : "#000",
                                                marginBottom: verticalScale(5),
                                                paddingVertical: verticalScale(5),
                                            }}
                                            onPress={
                                                () => {
                                                    WebBrowser.openBrowserAsync(video);
                                                }
                                            }
                                        >
                                            {
                                                //    open the link in a new tab
                                                video.length > 20
                                                    ? video.substring(0, 30) + "..."
                                                    : video
                                            }
                                        </Text>
                                    </View>
                                    <View
                                        // align elements
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between"
                                        }}
                                    >

                                        {!isSectionVisible ? (
                                            <View
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: fontSizes.FONT18,
                                                        fontFamily: "Poppins_400Regular",
                                                        color: theme.dark ? "#fff" : "#000",
                                                    }}
                                                >
                                                    {sectionVideos?.length} Lessons
                                                </Text>
                                            </View>
                                        ) : <Text>" "</Text>
                                        }
                                        {isSectionVisible ? (
                                            <TouchableOpacity
                                                onPress={() => toggleSection(video)}>
                                                <Entypo
                                                    name="chevron-up"
                                                    size={scale(20)}
                                                    color={theme.dark ? "#fff" : "#000"}
                                                />
                                            </TouchableOpacity>
                                        ) : (
                                                <TouchableOpacity onPress={() => toggleSection(video)}>
                                                <Entypo
                                                    name="chevron-down"
                                                    size={scale(20)}
                                                    color={theme.dark ? "#fff" : "#000"}
                                                />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>

                                {isSectionVisible && (
                                    <>
                                        {sectionVideos.map(
                                            (video: TcourseLesson, index: number) => (
                                                <View
                                                    style={{
                                                        borderWidth: 1,
                                                        borderColor: "#E1E2E5",
                                                        borderRadius: 8,
                                                        marginVertical: verticalScale(5),
                                                    }}
                                                    key={index + Date.now()}
                                                >
                                                    <View style={styles.itemContainer}>
                                                        <View style={styles.itemContainerWrapper}>
                                                            <View style={styles.itemTitleWrapper}>
                                                                <Feather
                                                                    name="video"
                                                                    size={scale(16)}
                                                                    color={theme.dark ? "#fff" : "#8a8a8a"}
                                                                />
                                                                <Text
                                                                    style={[
                                                                        styles.itemTitleText,
                                                                        {
                                                                            fontFamily: "Poppins_500Medium",
                                                                            color: theme.dark ? "#fff" : "#525258",
                                                                            fontSize: fontSizes.FONT17,
                                                                            width: scale(245),
                                                                        },
                                                                    ]}
                                                                >
                                                                    {video.title}
                                                                </Text>
                                                            </View>
                                                            <View style={styles.itemDataContainer}>
                                                                <Text
                                                                    style={{
                                                                        marginRight: 6,
                                                                        fontFamily: "Poppins_400Regular",
                                                                        color: theme.dark ? "#fff" : "#818181",
                                                                        fontSize: fontSizes.FONT17,
                                                                    }}
                                                                >
                                                                    {video.videoLength}{" "}
                                                                    {parseInt(video?.videoLength) > 60
                                                                        ? "hours"
                                                                        : "minutes"}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            )
                                        )}
                                    </>
                                )}
                            </>
                        );
                    })}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        marginHorizontal: 10,
        paddingVertical: 12,
    },
    itemContainerWrapper: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
    },
    itemTitleWrapper: {
        flexDirection: "row",
    },
    itemTitleText: { marginLeft: 8, color: "#525258", fontSize: 16 },
    itemDataContainer: { flexDirection: "row", alignItems: "center" },
});
