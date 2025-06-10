

import {
    View,
    Text,
    Pressable,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Animated,
    ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import React, { useRef, useState, useEffect, RefObject } from "react";
import { useTheme } from "@/context/theme.context";
import { scale, verticalScale } from "react-native-size-matters";
import { fontSizes } from "@/utils/app-constant";
import moment from "moment";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { setAuthorizationHeader } from "@/hooks/use-user";
import axios from "axios";
import { AnswerType, QuestionType } from "@/config/global";
import { API_URL } from "@/utils/env-constant";
import { PrivateValueStore } from "@react-navigation/native";

const defaultAvatar = "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png";

// Enhanced Avatar Component with Expo Image and skeleton loading
const AvatarImage = ({
    uri,
    size = 40,
    style = {}
}: {
    uri: string;
    size?: number;
    style?: any;
}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const { theme } = useTheme();


    useEffect(() => {
        if (!loading) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [loading]);

    const handleLoadStart = () => {
        setLoading(true);
        setError(false);
    };

    const handleLoadEnd = () => {
        setLoading(false);
    };

    const handleError = () => {
        setLoading(false);
        setError(true);
    };

    return (
        <View style={[{
            width: scale(size),
            height: scale(size),
            borderRadius: scale(size / 2),
            backgroundColor: theme.dark ? '#333' : '#f0f0f0',
            justifyContent: 'center',
            alignItems: 'center',
        }, style]}>
            {/* Loading skeleton */}
            {loading && (
                <View style={{
                    position: 'absolute',
                    width: scale(size),
                    height: scale(size),
                    borderRadius: scale(size / 2),
                    backgroundColor: theme.dark ? '#444' : '#e0e0e0',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <ActivityIndicator
                        size="small"
                        color={theme.dark ? '#fff' : '#666'}
                    />
                </View>
            )}

            {/* Actual image */}
            <Animated.View style={{ opacity: fadeAnim }}>
                <Image
                    source={{ uri: error ? defaultAvatar : uri || defaultAvatar }}
                    style={{
                        width: scale(size),
                        height: scale(size),
                        borderRadius: scale(size / 2),
                    }}
                    onLoadStart={handleLoadStart}
                    onLoadEnd={handleLoadEnd}
                    onError={handleError}
                    cachePolicy="memory-disk"
                    priority="high"
                    placeholder={null}
                    transition={200}
                />
            </Animated.View>
        </View>
    );
};

// Enhanced Reply Input Component
// const ReplyInput = ({
//     visible,
//     value,
//     onChangeText,
//     onSubmit,
//     loading,
//     inputRef,
//     theme
// }: {
//     visible: boolean;
//     value: string;
//     onChangeText: (text: string) => void;
//     onSubmit: () => void;
//     loading: boolean;
//     inputRef: React.RefObject<TextInput>;
//     theme: any;
// }) => {
//     const animatedHeight = useRef(new Animated.Value(0)).current;

//     useEffect(() => {
//         Animated.timing(animatedHeight, {
//             toValue: visible ? 1 : 0,
//             duration: 200,
//             useNativeDriver: false,
//         }).start();
//     }, [visible]);

//     if (!visible) return null;

//     return (
//         <Animated.View
//             style={{
//                 opacity: animatedHeight,
//                 transform: [{
//                     translateY: animatedHeight.interpolate({
//                         inputRange: [0, 1],
//                         outputRange: [-20, 0],
//                     })
//                 }],
//                 marginTop: verticalScale(8),
//                 marginLeft: scale(45),
//                 marginRight: scale(10),
//             }}
//         >
//             <KeyboardAvoidingView
//                 behavior={Platform.OS === "ios" ? "padding" : "height"}
//                 style={{
//                     flexDirection: "row",
//                     alignItems: "flex-end",
//                     backgroundColor: theme.dark ? "#1F2937" : "#F9FAFB",
//                     borderRadius: scale(12),
//                     paddingHorizontal: scale(12),
//                     paddingVertical: scale(8),
//                     borderWidth: 1,
//                     borderColor: theme.dark ? "#374151" : "#E5E7EB",
//                 }}
//             >
//                 <TextInput
//                     ref={inputRef}
//                     value={value}
//                     onChangeText={onChangeText}
//                     placeholder="Write your reply..."
//                     placeholderTextColor={theme.dark ? "#9CA3AF" : "#6B7280"}
//                     style={{
//                         flex: 1,
//                         marginBottom: verticalScale(8),
//                         color: theme.dark ? "#F9FAFB" : "#111827",
//                         fontSize: fontSizes.FONT15,
//                         maxHeight: verticalScale(80),

//                         lineHeight: scale(20),
//                         position: "relative",
//                     }}
//                     multiline
//                     textAlignVertical="top"
//                 />
//                 <TouchableOpacity
//                     onPress={onSubmit}
//                     disabled={!value.trim() || loading}
//                     style={{
//                         backgroundColor: (!value.trim() || loading) ?
//                             (theme.dark ? "#374151" : "#E5E7EB") : "#2563EB",
//                         borderRadius: scale(8),
//                         padding: scale(8),
//                         marginLeft: scale(8),
//                         position: "fixed",
//                         right: 0,
//                         bottom: verticalScale(4),
//                     }}
//                 >
//                     {loading ? (
//                         <View style={{ width: scale(16), height: scale(16) }}>
//                             <ActivityIndicator size="small" color={theme.dark ? "#fff" : "#fff"} />
//                         </View>
//                     ) : (
//                         <Ionicons
//                             name="send"
//                             size={scale(16)}
//                             color={(!value.trim() || loading) ? "#9CA3AF" : "#fff"}
//                         />
//                     )}
//                 </TouchableOpacity>
//             </KeyboardAvoidingView>
//         </Animated.View>
//     );
// };

// Enhanced Reply Input Component - Fixed Animation
const ReplyInput = ({
    visible,
    value,
    onChangeText,
    onSubmit,
    loading,
    inputRef,
    theme
}: {
    visible: boolean;
    value: string;
    onChangeText: (text: string) => void;
    onSubmit: () => void;
    loading: boolean;
    inputRef: React.RefObject<TextInput>;
    theme: any;
}) => {
    const animatedHeight = useRef(new Animated.Value(0)).current;
    const animatedOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(animatedHeight, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: false,
                }),
                Animated.timing(animatedOpacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(animatedHeight, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: false,
                }),
                Animated.timing(animatedOpacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [visible, animatedHeight, animatedOpacity]);

    if (!visible) return null;

    return (
        <Animated.View
            style={{
                opacity: animatedOpacity,
                transform: [{
                    scaleY: animatedHeight
                }],
                marginTop: verticalScale(8),
                marginLeft: scale(45),
                marginRight: scale(10),
            }}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    backgroundColor: theme.dark ? "#1F2937" : "#F9FAFB",
                    borderRadius: scale(12),
                    paddingHorizontal: scale(12),
                    paddingVertical: scale(8),
                    borderWidth: 1,
                    borderColor: theme.dark ? "#374151" : "#E5E7EB",
                }}
            >
                <TextInput
                    ref={inputRef}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder="Write your reply..."
                    placeholderTextColor={theme.dark ? "#9CA3AF" : "#6B7280"}
                    style={{
                        flex: 1,
                        marginBottom: verticalScale(8),
                        color: theme.dark ? "#F9FAFB" : "#111827",
                        fontSize: fontSizes.FONT15,
                        maxHeight: verticalScale(80),
                        lineHeight: scale(20),
                    }}
                    multiline
                    textAlignVertical="top"
                />
                <TouchableOpacity
                    onPress={onSubmit}
                    disabled={!value.trim() || loading}
                    style={{
                        backgroundColor: (!value.trim() || loading) ?
                            (theme.dark ? "#374151" : "#E5E7EB") : "#2563EB",
                        borderRadius: scale(8),
                        padding: scale(8),
                        marginLeft: scale(8),
                        alignSelf: 'flex-end',
                        marginBottom: verticalScale(4),
                    }}
                >
                    {loading ? (
                        <View style={{ width: scale(16), height: scale(16) }}>
                            <ActivityIndicator size="small" color="#fff" />
                        </View>
                    ) : (
                        <Ionicons
                            name="send"
                            size={scale(16)}
                            color={(!value.trim() || loading) ? "#9CA3AF" : "#fff"}
                        />
                    )}
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </Animated.View>
    );
};

export default function QuestionCard({
    question,
    setQuestions,
    activeVideo,
    courseSlug,
}: {
    question: QuestionType;
    setQuestions?: React.Dispatch<React.SetStateAction<QuestionType[]>>;
    activeVideo: number;
    courseSlug: string;
}) {
    const { theme } = useTheme();
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [reply, setReply] = useState("");
    const [replyLoader, setReplyLoader] = useState(false);

    const replyInputRef = useRef<TextInput>(null);

    const toggleReplyInput = () => {
        setShowReplyInput(!showReplyInput);
        if (!showReplyInput && replyInputRef.current) {
            setTimeout(() => replyInputRef.current?.focus(), 100);
        }
    };

    const handleReplySubmit = async () => {
        if (!reply.trim()) return;

        setReplyLoader(true);
        try {
            await setAuthorizationHeader();
            await axios.post(`${API_URL}/replies`, {
                questionId: question.id,
                answer: reply.trim(),
                contentId: question.contentId,
                activeVideo: activeVideo,
                courseSlug: courseSlug,
            });

            // setQuestions(response.data.question);
            await replyFetchHandler();
            setReply("");
            setShowReplyInput(false);
        } catch (error) {
            console.error("Reply submission error:", error);
        } finally {
            setReplyLoader(false);
        }
    };

    // query the question answers from the api
    const replyFetchHandler = async () => {
        try {
            const repliesQ = await axios.get(`${API_URL}/replies/${question.id}/${question.contentId}`);
            setQuestions?.(repliesQ.data.questions);
        } catch (error) {
            console.error("Error fetching replies:", error);
        } finally {
            setReplyLoader(false);
        }

    }


    const repliesCount = question?.answers?.length || 0;

    return (
        <View style={{
            backgroundColor: theme.dark ? "#111827" : "#FFFFFF",
            borderRadius: scale(12),
            marginVertical: verticalScale(4),
            padding: scale(12),
            borderWidth: 1,
            borderColor: theme.dark ? "#1F2937" : "#F3F4F6",
            elevation: 1,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
        }}>
            {/* Main Question */}
            <View style={{ flexDirection: "row" }}>
                <AvatarImage
                    uri={question.user?.avatarUrl as string || defaultAvatar}
                    size={40}
                />

                <View style={{
                    flex: 1,
                    marginLeft: scale(12),
                }}>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: verticalScale(4),
                    }}>
                        <Text style={{
                            fontSize: fontSizes.FONT16,
                            fontWeight: "600",
                            color: theme.dark ? "#F9FAFB" : "#111827",
                        }}>
                            {question?.user?.name}
                        </Text>

                        <Text style={{
                            fontSize: fontSizes.FONT12,
                            color: theme.dark ? "#9CA3AF" : "#6B7280",
                            marginLeft: scale(8),
                        }}>
                            {moment(question.createdAt).fromNow()}
                        </Text>
                    </View>

                    <Text style={{
                        fontSize: fontSizes.FONT15,
                        lineHeight: scale(20),
                        color: theme.dark ? "#E5E7EB" : "#374151",
                        marginBottom: verticalScale(8),
                    }}>
                        {question.question}
                    </Text>
                </View>
            </View>

            {/* Action Buttons */}
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                paddingTop: verticalScale(8),
                paddingLeft: scale(52),
                borderTopWidth: 1,
                borderTopColor: theme.dark ? "#1F2937" : "#F3F4F6",
                marginTop: verticalScale(8),
            }}>
                {repliesCount > 0 && (
                    <TouchableOpacity
                        onPress={() => setShowReplies(!showReplies)}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginRight: scale(16),
                        }}
                    >
                        <Ionicons
                            name={showReplies ? "chevron-up" : "chevron-down"}
                            size={scale(16)}
                            color={theme.dark ? "#9CA3AF" : "#6B7280"}
                        />
                        <Text style={{
                            fontSize: fontSizes.FONT14,
                            color: theme.dark ? "#9CA3AF" : "#6B7280",
                            marginLeft: scale(4),
                        }}>
                            {showReplies ? "Hide" : "Show"} {repliesCount} {repliesCount === 1 ? "reply" : "replies"}
                        </Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    onPress={toggleReplyInput}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <Ionicons
                        name="chatbubble-outline"
                        size={scale(16)}
                        color="#2563EB"
                    />
                    <Text style={{
                        fontSize: fontSizes.FONT14,
                        color: "#2563EB",
                        marginLeft: scale(4),
                        fontWeight: "500",
                    }}>
                        Reply
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Replies List */}
            {showReplies && repliesCount > 0 && (
                <View style={{
                    marginTop: verticalScale(12),
                    paddingLeft: scale(52),
                }}>
                    {question.answers?.map((answer: AnswerType, index: number) => (
                        <View
                            key={index}
                            style={{
                                flexDirection: "row",
                                marginBottom: verticalScale(12),
                                backgroundColor: theme.dark ? "#1F2937" : "#F9FAFB",
                                borderRadius: scale(8),
                                padding: scale(10),
                            }}
                        >
                            <AvatarImage
                                uri={answer.user?.avatarUrl as string}
                                size={32}
                            />

                            <View style={{
                                flex: 1,
                                marginLeft: scale(10),
                            }}>
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginBottom: verticalScale(4),
                                }}>
                                    <Text style={{
                                        fontSize: fontSizes.FONT14,
                                        fontWeight: "600",
                                        color: theme.dark ? "#F9FAFB" : "#111827",
                                    }}>
                                        {answer.user.name}
                                    </Text>

                                    {answer.user.role === "ADMIN" && (
                                        <MaterialIcons
                                            name="verified"
                                            size={scale(14)}
                                            color="#2563EB"
                                            style={{ marginLeft: scale(4) }}
                                        />
                                    )}

                                    <Text style={{
                                        fontSize: fontSizes.FONT12,
                                        color: theme.dark ? "#9CA3AF" : "#6B7280",
                                        marginLeft: scale(8),
                                    }}>
                                        {moment(answer.createdAt).fromNow()}
                                    </Text>
                                </View>

                                <Text style={{
                                    fontSize: fontSizes.FONT14,
                                    lineHeight: scale(18),
                                    color: theme.dark ? "#E5E7EB" : "#374151",
                                }}>
                                    {answer.answer}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            )}

            {/* Reply Input */}
            <ReplyInput
                visible={showReplyInput}
                value={reply}
                onChangeText={setReply}
                onSubmit={handleReplySubmit}
                loading={replyLoader}
                inputRef={replyInputRef as RefObject<TextInput>}
                theme={theme}
            />
        </View>
    );
}
