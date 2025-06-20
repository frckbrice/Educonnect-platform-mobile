import { TouchableOpacity, ScrollView, Text, View } from "react-native";
import React from "react";
import { useTheme } from "@/context/theme.context";
import { scale, verticalScale } from "react-native-size-matters";
import IconSix from "@/assets/svgs/support-center/six";
import { fontSizes } from "@/utils/app-constant";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import useUser from "@/hooks/use-user";
import { NotificationStatus, TicketsTypes } from "../../../config/global";

export default function MyTicketsScreen() {
    const { theme } = useTheme();
    const { apiUser } = useUser();

    return (
        <View style={{ flex: 1, backgroundColor: theme.dark ? "#101010" : "#fff" }}>
            <View
                style={{
                    height: verticalScale(240),
                    backgroundColor: theme.dark ? "#8673FC" : "#9DCDFF",
                    paddingTop: verticalScale(45),
                    paddingHorizontal: scale(20),
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                <TouchableOpacity
                    style={{
                        width: scale(35),
                        height: scale(35),
                        backgroundColor: "#fff",
                        borderRadius: scale(5),
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onPress={() => router.back()}
                >
                    <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
                <Text
                    style={{
                        textAlign: "center",
                        fontSize: fontSizes.FONT28,
                        color: "#fff",
                        fontFamily: "Poppins_600SemiBold",
                        position: "absolute",
                        top: verticalScale(50),
                        left: scale(120),
                    }}
                >
                    My Tickets
                </Text>
                <View style={{ flexDirection: "row" }}>
                    <IconSix />
                </View>
            </View>

            <ScrollView style={{ padding: scale(15) }}>
                {apiUser?.tickets?.slice()
                    .reverse()
                    .map((item: TicketsTypes, index: number) => (
                        <TouchableOpacity
                            style={{
                                backgroundColor: theme.dark ? "#3c43485c" : "#eaf3fb85",
                                borderRadius: scale(10),
                                shadowOpacity: 0.1,
                                shadowColor: "#40E0D0",
                                shadowRadius: 5,
                                padding: scale(10),
                                marginTop: verticalScale(20),
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                            key={index}
                            onPress={() =>
                                router.push({
                                    pathname: "/(routes)/support-chat",
                                    params: { ticket: JSON.stringify(item) },
                                })
                            }
                        >
                            <Text
                                style={{
                                    color: !theme.dark ? "#000" : "#fff",
                                    fontSize: fontSizes.FONT22,
                                    fontFamily: "Poppins_500Medium",
                                    width: scale(220),
                                }}
                            >
                                {item.ticketTitle}
                            </Text>
                            <Text
                                style={{
                                    color:
                                        item.status !== NotificationStatus.UNREAD
                                            ? "#19C964"
                                            : theme.dark
                                                ? "#fff"
                                                : "#000",
                                    fontSize: fontSizes.FONT22,
                                    opacity: item?.status === NotificationStatus.UNREAD ? 0.7 : 1,
                                    fontFamily: "Poppins_500Medium",
                                }}
                            >
                                {item.status}
                            </Text>
                        </TouchableOpacity>
                    ))}
            </ScrollView>
        </View>
    );
}
