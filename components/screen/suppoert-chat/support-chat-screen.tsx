import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/context/theme.context";
import { scale, verticalScale } from "react-native-size-matters";
import { router, useGlobalSearchParams } from "expo-router";
import { AntDesign, Feather } from "@expo/vector-icons";
import { fontSizes, IsAndroid } from "@/utils/app-constant";
import IconFive from "@/assets/svgs/support-center/five";
import moment from "moment";
import useUser, { setAuthorizationHeader } from "@/hooks/use-user";
import axios from "axios";
import { BlurView } from "expo-blur";
import { TicketReplies, TicketsTypes } from "@/config/global";
import { API_URL } from "@/utils/env-constant";

export default function SupportChatScreen() {
    const { theme } = useTheme();
    const { ticket } = useGlobalSearchParams();
    const ticketData: TicketsTypes = JSON.parse(ticket as any);
    const ref = useRef<ScrollView>(null);
    const [ticketReplies, setTicketReplies] = useState<TicketReplies[]>([]);
    const [ticketReply, setTicketReply] = useState("");
    const [ticketStatus, setTicketStatus] = useState("");
    const { apiUser: user } = useUser();

    useEffect(() => {
        const subscription = async () => {
            await setAuthorizationHeader();
            await axios
                .get(
                    `${API_URL}/tickets/${ticketData.id}`
                )
                .then((res) => {
                    setTicketReplies(res.data.ticket);
                    setTicketStatus(ticketData.status);
                });
        };
        subscription();
    }, []);

    const handleSubmit = async () => {
        if (ticketReply.length !== 0 && ticketStatus !== "Closed") {
            await axios
                .put(`${API_URL}/replies`, {
                    ticketReply,
                    ticketId: ticketData.id,
                })
                .then((res) => {
                    const reply = res.data.reply;
                    setTicketReply("");
                    setTicketReplies((prevReplies) => [...prevReplies, reply]);
                    setTicketStatus(user?.role === "Admin" || "ADMIN" ? "Answered" : "Pending");
                });
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: theme.dark ? "#101010" : "#fff" }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View
                style={{
                    height: verticalScale(230),
                    backgroundColor: theme.dark ? "#8673FC" : "#9DCDFF",
                    paddingTop: verticalScale(45),
                    paddingHorizontal: scale(20),
                    overflow: "hidden",
                    position: "relative",
                    borderBottomLeftRadius: scale(40),
                    borderBottomRightRadius: scale(40),
                }}
            >
                <Pressable
                    style={{
                        width: scale(35),
                        height: scale(35),
                        backgroundColor: "#fff",
                        borderRadius: scale(5),
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1111,
                    }}
                    onPress={() => router.back()}
                >
                    <AntDesign name="arrowleft" size={24} color="black" />
                </Pressable>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ width: scale(310) }}>
                        <Text
                            style={{
                                textAlign: "center",
                                marginTop: verticalScale(-30),
                                fontSize: fontSizes.FONT28,
                                color: theme.dark ? "#fff" : "#333",
                                fontFamily: "Poppins_600SemiBold",
                            }}
                        >
                            Chats
                        </Text>
                        <IconFive />
                    </View>
                </View>
            </View>
            <ScrollView style={{ flex: 1 }} ref={ref}>
                <View style={{ flex: 1, padding: scale(20) }}>
                    <View
                        style={[
                            styles.messageCard,
                            {
                                backgroundColor: theme.dark ? "#0088FF" : "#0088FF",
                                alignSelf: "flex-end",
                                maxWidth: "90%",
                            },
                        ]}
                    >
                        <Text
                            style={{
                                color: "#fff",
                                fontSize: fontSizes.FONT20,
                                fontFamily: "Poppins_500Medium",
                            }}
                        >
                            {ticketData.details}
                        </Text>
                    </View>
                    <Text
                        style={{
                            color: theme.dark ? "#fff" : "#000",
                            fontSize: fontSizes.FONT16,
                            fontFamily: "Poppins_400Regular",
                            alignSelf: "flex-end",
                            maxWidth: "90%",
                            paddingTop: verticalScale(4),
                        }}
                    >
                        {moment(ticketData.createdAt).fromNow()}
                    </Text>
                    {ticketReplies?.map((item: TicketReplies, index: number) => (
                        <View key={index}>
                            <View
                                style={[
                                    styles.messageCard,
                                    {
                                        backgroundColor:
                                            item?.user?.id === user?.id
                                                ? theme.dark
                                                    ? "#0088FF"
                                                    : "#0088FF"
                                                : theme.dark
                                                    ? "#3c43485c"
                                                    : "#F2F2F2",
                                        alignSelf:
                                            item.user.id === user?.id ? "flex-end" : "flex-start",
                                        maxWidth: "90%",
                                        marginTop:
                                            index !== 0 ? verticalScale(10) : verticalScale(0),
                                    },
                                ]}
                            >
                                <Text
                                    style={{
                                        color: theme.dark
                                            ? "#fff"
                                            : item.user.id === user?.id
                                                ? "#fff"
                                                : "#000",
                                        fontSize: fontSizes.FONT20,
                                        fontFamily: "Poppins_500Medium",
                                    }}
                                >
                                    {item.reply}
                                </Text>
                            </View>
                            <Text
                                style={{
                                    color: theme.dark ? "#fff" : "#000",
                                    fontSize: fontSizes.FONT16,
                                    fontFamily: "Poppins_400Regular",
                                    alignSelf:
                                        item.user.id === user?.id ? "flex-end" : "flex-start",
                                    maxWidth: "90%",
                                    paddingTop: verticalScale(4),
                                    paddingBottom:
                                        index === ticketReplies.length - 1 ? verticalScale(5) : 0,
                                }}
                            >
                                {moment(item.createdAt).fromNow()}
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {ticketStatus !== "Closed" && ticketStatus !== "" && (
                <BlurView
                    intensity={theme.dark ? (IsAndroid ? 20 : 55) : 100}
                    style={{
                        height: verticalScale(60),
                        backgroundColor: !theme.dark ? "#eaf3fb85" : "#000",
                    }}
                >
                    <TextInput
                        style={{
                            marginHorizontal: scale(15),
                            marginVertical: verticalScale(10),
                            height: verticalScale(30),
                            borderWidth: 1,
                            borderColor: !theme.dark ? "#666" : "#fff",
                            borderRadius: scale(15),
                            paddingHorizontal: scale(10),
                            paddingRight: scale(35),
                            color: !theme.dark ? "#111" : "#fff",
                            fontSize: fontSizes.FONT20,
                        }}
                        value={ticketReply}
                        onChangeText={(e) => setTicketReply(e)}
                        placeholder="Write your message..."
                        placeholderTextColor={!theme.dark ? "#111" : "#fff"}
                    />
                    <TouchableOpacity
                        style={{
                            position: "absolute",
                            right: scale(28),
                            top: verticalScale(16),
                        }}
                        disabled={ticketStatus === "Closed"}
                        onPress={() => handleSubmit()} // submit new request or reply on the chat page
                    >
                        <Feather
                            name="send"
                            size={24}
                            color={theme.dark ? "#f5f5f5" : "black"}
                        />
                    </TouchableOpacity>
                </BlurView>
            )}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    messageCard: {
        padding: scale(10),
        borderRadius: scale(8),
    },
});
