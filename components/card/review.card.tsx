
import { View, Text, ActivityIndicator, Animated } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Image } from "expo-image";
import Ratings from "@/components/common/ratings";
import { useTheme } from "@/context/theme.context";
import { scale, verticalScale } from "react-native-size-matters";
import { fontSizes } from "@/utils/app-constant";
import moment from "moment";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ReviewsType } from "@/config/global";

// Enhanced Avatar Component with loading states and caching
// const AvatarImage = ({
//     uri,
//     size = 40,
//     style = {}
// }: {
//     uri: string;
//     size?: number;
//     style?: any;
// }) => {
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(false);
//     const fadeAnim = useRef(new Animated.Value(0)).current;
//     const { theme } = useTheme();

//     const defaultAvatar = "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png";

//     useEffect(() => {
//         if (!loading) {
//             Animated.timing(fadeAnim, {
//                 toValue: 1,
//                 duration: 300,
//                 useNativeDriver: true,
//             }).start();
//         }
//     }, [loading]);

//     const handleLoadStart = () => {
//         setLoading(true);
//         setError(false);
//     };

//     const handleLoadEnd = () => {
//         setLoading(false);
//     };

//     const handleError = () => {
//         setLoading(false);
//         setError(true);
//     };

//     return (
//         <View style={[{
//             width: scale(size),
//             height: scale(size),
//             borderRadius: scale(size / 2),
//             backgroundColor: theme.dark ? '#333' : '#f0f0f0',
//             justifyContent: 'center',
//             alignItems: 'center',
//         }, style]}>
//             {/* Loading skeleton */}
//             {loading && (
//                 <View style={{
//                     position: 'absolute',
//                     width: scale(size),
//                     height: scale(size),
//                     borderRadius: scale(size / 2),
//                     backgroundColor: theme.dark ? '#444' : '#e0e0e0',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                 }}>
//                     <ActivityIndicator
//                         size="small"
//                         color={theme.dark ? '#fff' : '#666'}
//                     />
//                 </View>
//             )}

//             {/* Actual image */}
//             <Animated.View style={{ opacity: fadeAnim }}>
//                 <Image
//                     source={{ uri: error ? defaultAvatar : uri || defaultAvatar }}
//                     style={{
//                         width: scale(size),
//                         height: scale(size),
//                         borderRadius: scale(size / 2),
//                     }}
//                     onLoadStart={handleLoadStart}
//                     onLoadEnd={handleLoadEnd}
//                     onError={handleError}
//                     cachePolicy="memory-disk"
//                     priority="high"
//                     placeholder={null}
//                     transition={200}
//                 />
//             </Animated.View>
//         </View>
//     );
// };

// Fixed AvatarImage Component - only the problematic part
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

    const defaultAvatar = "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png";

    useEffect(() => {
        if (!loading && fadeAnim) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [loading, fadeAnim]);

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

            {/* Fixed Actual image - added fadeAnim check */}
            <Animated.View style={{ opacity: fadeAnim ? fadeAnim : new Animated.Value(0) }}>
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
                    alt="review user avater"
                />
            </Animated.View>
        </View>
    );
};

export default function ReviewCard({ item }: { item: ReviewsType }) {
    const { theme } = useTheme();

    const textColor = theme.dark ? "#fff" : "#000";
    const mutedTextColor = theme.dark ? "#ccc" : "#666";

    return (
        <View style={{
            flex: 1,
            backgroundColor: theme.dark ? '#1a1a1a' : '#fff',
            borderRadius: scale(12),
            padding: scale(16),
            marginVertical: verticalScale(6),
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5,
        }}>
            <View style={{ flexDirection: "row", alignItems: 'flex-start' }}>
                <AvatarImage
                    uri={item?.user?.avatarUrl as string}
                    size={40}
                />

                <View style={{
                    marginLeft: scale(12),
                    flex: 1,
                    justifyContent: 'center'
                }}>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: verticalScale(4),
                    }}>
                        <Text style={{
                            fontSize: scale(16),
                            fontWeight: '600',
                            color: textColor,
                            marginRight: scale(8),
                        }}>
                            {item?.user?.name}
                        </Text>
                        <Text style={{
                            fontSize: scale(12),
                            color: mutedTextColor,
                        }}>
                            {moment(item.createdAt).fromNow()}
                        </Text>
                    </View>

                    <View style={{ marginBottom: verticalScale(6) }}>
                        <Ratings rating={item?.rating} />
                    </View>

                    <Text style={{
                        fontSize: fontSizes.FONT16,
                        color: textColor,
                        lineHeight: scale(22),
                    }}>
                        {item.comment}
                    </Text>
                </View>
            </View>

            {/* Enhanced replies section */}
            {item?.replies?.length !== 0 && (
                <View style={{
                    marginTop: verticalScale(16),
                    marginLeft: scale(20),
                    paddingTop: verticalScale(12),
                    borderTopWidth: 1,
                    borderTopColor: theme.dark ? '#333' : '#f0f0f0',
                }}>
                    <View style={{ flexDirection: "row", alignItems: 'flex-start' }}>
                        <AvatarImage
                            uri={item.replies[0]?.user?.avatarUrl}
                            size={32}
                        />

                        <View style={{
                            marginLeft: scale(10),
                            flex: 1,
                            justifyContent: 'center'
                        }}>
                            <View style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: verticalScale(4),
                            }}>
                                <Text style={{
                                    fontSize: scale(14),
                                    fontWeight: '600',
                                    color: textColor,
                                    marginRight: scale(4),
                                }}>
                                    {item.replies[0]?.user?.name}
                                </Text>
                                <MaterialIcons
                                    name="verified"
                                    size={scale(14)}
                                    color="#0095F6"
                                    style={{ marginRight: scale(8) }}
                                />
                                <Text style={{
                                    fontSize: scale(11),
                                    color: mutedTextColor,
                                }}>
                                    {moment(item?.replies[0]?.createdAt).fromNow()}
                                </Text>
                            </View>

                            <Text style={{
                                fontSize: scale(14),
                                color: textColor,
                                lineHeight: scale(20),
                            }}>
                                {item?.replies[0]?.reply}
                            </Text>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}
