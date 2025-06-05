import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useGlobalSearchParams } from "expo-router";
import useUser, { setAuthorizationHeader } from "@/hooks/use-user";

import { useTheme } from "@/context/theme.context";
import {
    fontSizes,
    IsAndroid,
    IsIPAD,
    SCREEN_WIDTH,
    windowHeight,
    windowWidth,
} from "@/utils/app-constant";
import { scale, verticalScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import CourseDetailsTabs from "./couser-details-tab";
import CourseLesson from "./course.lesson";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import { Spacer } from "@/components/common/skelton";
import axios from "axios";
import ReviewCard from "@/components/card/review.card";
import { BlurView } from "expo-blur";
import {
    endConnection,
    flushFailedPurchasesCachedAsPendingAndroid,
    getProducts,
    initConnection,
    requestPurchase,
    finishTransaction,
    acknowledgePurchaseAndroid,
    purchaseUpdatedListener,
    purchaseErrorListener,
} from "react-native-iap";


import CourseDetailsLoader from "@/components/common/course-details-skelton";
import { BenefitsType, CourseDataType, CourseType, OrderType, ReviewsType } from "@/config/global";
import { API_URL } from "@/utils/env-constant";

export default function CourseDetailsScreen() {

    const params: any = useGlobalSearchParams();
    const [activeButton, setActiveButton] = useState("About");
    const { apiUser, loader: userLoader } = useUser();
    const [purchaseLoader, setPurchaseLoader] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [loader, setLoader] = useState(true);
    const [reviews, setReviews] = useState([]);
    const courseData: CourseType | any = params;
    const prerequisites: BenefitsType[] | any = JSON.parse(params?.prerequisites);
    const benefits: BenefitsType[] | any = JSON.parse(params?.benefits);
    const courseContent: CourseDataType[] | any = JSON.parse(
        params?.courseContent
    );

    const { theme } = useTheme();


    // useEffect(() => {
    //     const init = async () => {
    //         try {
    //             await initConnection();
    //             if (Platform.OS === "android") {
    //                 flushFailedPurchasesCachedAsPendingAndroid();
    //             }
    //         } catch (error: any) {
    //             console.log("Error occured during initilization", error.message);
    //         }
    //     };
    //     init();

    //     return () => {
    //         endConnection();
    //     };
    // }, []);

    // useEffect(() => {
    //     const purchaseUpdateSubscription = purchaseUpdatedListener(
    //         async (purchase) => {
    //             const receipt = purchase.transactionReceipt;
    //             if (receipt) {
    //                 try {
    //                     await finishTransaction({ purchase, isConsumable: false });
    //                 } catch (error) {
    //                     console.log("An error occured while completing transection", error);
    //                 }
    //             }
    //         }
    //     );

    //     const purchaseErrorSubscription = purchaseErrorListener((error) =>
    //         console.log("Purchase error", error.message)
    //     );
    //     return () => {
    //         purchaseUpdateSubscription.remove();
    //         purchaseErrorSubscription.remove();
    //     };
    // }, []);

    if (userLoader) {
        return <CourseDetailsLoader />;
    }

    const userOrders = apiUser?.orders;
    const isPurchased = userOrders?.find(
        (i: OrderType) => i.courseId === courseData.id
    );

    // const handlePurchase = async () => {
    //     setPurchaseLoader(true);
    //     try {
    //         if (courseData.price === "0") {
    //             await setAuthorizationHeader();
    //             await axios.post(
    //                 `${API_URL}/orders/free`,
    //                 {
    //                     courseId: courseData.id,
    //                 }
    //             );
    //             setPurchaseLoader(false);
    //         } else {
    //             const product = await getProducts({
    //                 skus: ["test"],
    //             });
    //             if (product && product.length > 0) {
    //                 try {
    //                     const requestPayload =
    //                         Platform.OS === "ios"
    //                             ? { sku: product[0].productId }
    //                             : { skus: [product[0].productId] };

    //                     const purchase: any = await requestPurchase(requestPayload);
    //                     if (Platform.OS === "ios") {
    //                         if (purchase?.transactionReceipt) {
    //                             // send receipt to our backend for validation
    //                             await setAuthorizationHeader();
    //                             await axios.post(
    //                                 `${API_URL}/orders`,
    //                                 {
    //                                     receipt: purchase.transactionReceipt,
    //                                     courseId: courseData.id,
    //                                     in_app_productId: product[0]?.productId,
    //                                 }
    //                             );
    //                         }
    //                         await finishTransaction({ purchase, isConsumable: false });
    //                         setPurchaseLoader(false);
    //                     } else {
    //                         if (purchase) {
    //                             await setAuthorizationHeader();
    //                             await axios.post(
    //                                 `${API_URL}/orders/android`,
    //                                 {
    //                                     purchaseToken: purchase.transactionReceipt,
    //                                     productId: purchase.productId,
    //                                     orderId: purchase.orderId,
    //                                 }
    //                             );

    //                             await finishTransaction({ purchase, isConsumable: false });
    //                             setPurchaseLoader(false);
    //                         }
    //                     }
    //                 } catch (error) {
    //                     setPurchaseLoader(false);
    //                     console.log(error);
    //                 }
    //             }
    //         }
    //     } catch (error) {
    //         setPurchaseLoader(false);
    //     }
    // };


    const reviewsFetchingHandler = async () => {
        setActiveButton("Reviews");

        await axios
            .get(`${API_URL}/reviews/${params.id}`)
            .then((res) => {
                setReviews(res.data.reviewsData);

                setLoader(false);
            });
    };


    const handleCourseAccess = () => {
        router.push({
            pathname: "/(routes)/course-access",
            params: {
                ...courseData,
            },
        });
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.dark ? "#131313" : "#fff" }}>
            <ScrollView showsVerticalScrollIndicator={false} style={{
                flex: 1, paddingHorizontal: windowWidth(10)
            }}>
                <View style={{ padding: windowWidth(15) }}>
                    <Image
                        source={{
                            uri:
                                courseData.slug ===
                                    "multi-vendor-mern-stack-e-commerce-project-with-all-functionalities-absolutely-for-beginners"
                                    ? "https://res.cloudinary.com/dwp4syk3r/image/upload/v1713574266/TMECA_yddc73.png"
                                    : courseData.slug ===
                                        "build-your-mobile-app-development-career-with-react-native"
                                        ? "https://res.cloudinary.com/dkg6jv4l0/image/upload/v1731448241/thumbnail_jwi5xo.png"
                                        : "https://res.cloudinary.com/dkg6jv4l0/image/upload/v1711468889/courses/spe7bcczfpjmtsdjzm6x.png",
                        }}
                        resizeMode="contain"
                        style={{
                            width: IsAndroid ? SCREEN_WIDTH - 40 : SCREEN_WIDTH - 20,
                            height: IsAndroid
                                ? (SCREEN_WIDTH - 28) * 0.5625
                                : (SCREEN_WIDTH - 40) * 0.5625,
                            alignSelf: "center",
                            borderRadius: scale(20),
                        }}
                    />
                    <Text
                        style={{
                            fontSize: fontSizes.FONT22,
                            fontFamily: "Poppins_600SemiBold",
                            paddingTop: verticalScale(10),
                            color: theme.dark ? "#fff" : "#3E3B54",
                            lineHeight: windowHeight(20),
                        }}
                    >
                        {courseData.name || courseData.title}
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <View style={{ flexDirection: "row" }}>
                            <Text
                                style={{
                                    fontSize: fontSizes.FONT22,
                                    fontFamily: "Poppins_400Regular",
                                    paddingTop: windowHeight(8),
                                    color: theme.dark ? "#fff" : "#000",
                                    lineHeight: windowHeight(20),
                                }}
                            >
                                ${courseData?.price}
                            </Text>
                            <Text
                                style={{
                                    fontSize: fontSizes.FONT22,
                                    fontFamily: "Poppins_400Regular",
                                    color: theme.dark ? "#fff" : "#3E3B54",
                                    lineHeight: IsIPAD ? windowHeight(0) : windowHeight(20),
                                    paddingLeft: windowWidth(5),
                                    textDecorationLine: "line-through",
                                }}
                            >
                                ${courseData?.estimatedPrice}
                            </Text>
                        </View>
                        <Text
                            style={{
                                fontSize: fontSizes.FONT18,
                                fontFamily: "Poppins_400Regular",
                                color: theme.dark ? "#fff" : "#000",
                            }}
                        >
                            {courseData?.purchased} Students
                        </Text>
                    </View>

                    {/* Course prerequisites */}
                    <View style={{ paddingTop: windowHeight(12) }}>
                        <Text
                            style={{
                                fontSize: fontSizes.FONT24,
                                fontFamily: "Poppins_600SemiBold",
                                paddingTop: windowHeight(8),
                                color: theme.dark ? "#fff" : "#3E3B54",
                                lineHeight: windowHeight(20),
                            }}
                        >
                            Course Prerequisites
                        </Text>
                        {prerequisites?.map((prereq: BenefitsType, index: number) => (
                            <View
                                key={index}
                                style={{
                                    flexDirection: "row",
                                    paddingVertical: windowHeight(5),
                                }}
                            >
                                <Ionicons
                                    name="checkmark-done-outline"
                                    size={Math.round(scale(17))}
                                    color={theme.dark ? "#fff" : "#000"}
                                />
                                <Text
                                    style={{
                                        marginLeft: windowWidth(5),
                                        fontSize: fontSizes.FONT18,
                                        color: theme.dark ? "#fff" : "#000",
                                    }}
                                >
                                    {prereq?.title}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Course Benefits */}
                    <View style={{ paddingTop: windowHeight(12) }}>
                        <Text
                            style={{
                                fontSize: fontSizes.FONT24,
                                fontFamily: "Poppins_600SemiBold",
                                paddingTop: windowHeight(8),
                                color: theme.dark ? "#fff" : "#3E3B54",
                                lineHeight: windowHeight(20),
                            }}
                        >
                            Course Benefits
                        </Text>
                        {benefits?.map((benef: BenefitsType, index: number) => (
                            <View
                                key={index}
                                style={{
                                    flexDirection: "row",
                                    paddingVertical: windowHeight(5),
                                }}
                            >
                                <Ionicons
                                    name="checkmark-done-outline"
                                    size={Math.round(scale(17))}
                                    color={theme.dark ? "#fff" : "#000"}
                                />
                                <Text
                                    style={{
                                        marginLeft: windowWidth(5),
                                        fontSize: fontSizes.FONT18,
                                        color: theme.dark ? "#fff" : "#000",
                                    }}
                                >
                                    {benef?.title}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Course Tabs */}
                    <CourseDetailsTabs
                        activeButton={activeButton}
                        reviewsFetchingHandler={reviewsFetchingHandler}
                        setActiveButton={setActiveButton}
                    />

                    {activeButton === "About" && (
                        <View
                            style={{
                                marginHorizontal: Math.round(scale(12)),
                                marginVertical: Math.round(verticalScale(10)),
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: fontSizes.FONT25,
                                    fontFamily: "Poppins_500Medium",
                                    color: theme.dark ? "#fff" : "#000",
                                }}
                            >
                                About course
                            </Text>
                            <Text
                                style={{
                                    color: !theme.dark ? "#525258" : "#fff",
                                    fontSize: fontSizes.FONT20,
                                    marginTop: 10,
                                    textAlign: "justify",
                                }}
                            >
                                {isExpanded
                                    ? courseData?.description
                                    : courseData?.description.slice(0, 302)}
                            </Text>
                            {courseData?.description.length > 302 && (
                                <TouchableOpacity
                                    style={{ marginTop: verticalScale(2) }}
                                    onPress={() => setIsExpanded(!isExpanded)}
                                >
                                    <Text
                                        style={{
                                            color: "#2467EC",
                                            fontSize: fontSizes.FONT16,
                                        }}
                                    >
                                        {isExpanded ? "Show Less" : "Show More"}
                                        {isExpanded ? "-" : "+"}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

                    {activeButton === "Lessons" && (
                        <View
                            style={{
                                marginHorizontal: Math.round(verticalScale(16)),
                                marginVertical: Math.round(scale(15)),
                            }}
                        >
                            <CourseLesson courseDetails={courseContent} />
                        </View>
                    )}

                    {activeButton === "Reviews" && (
                        <View style={{ marginHorizontal: 16, marginVertical: 25 }}>
                            <View style={{ rowGap: 25 }}>
                                {loader && (
                                    <>
                                        {[0, 1, 2, 3, 4, 5].map((i: any) => (
                                            <MotiView
                                                key={i}
                                                transition={{
                                                    type: "timing",
                                                }}
                                                style={{
                                                    flex: 1,
                                                    flexDirection: "row",
                                                    gap: Math.round(scale(10)),
                                                    marginVertical: verticalScale(10),
                                                }}
                                                animate={{
                                                    backgroundColor: theme.dark ? "#131313" : "#fff",
                                                }}
                                            >
                                                <Skeleton
                                                    colorMode={theme.dark ? "dark" : "light"}
                                                    radius="round"
                                                    height={verticalScale(55)}
                                                    width={verticalScale(55)}
                                                />
                                                <View>
                                                    <Skeleton
                                                        colorMode={theme.dark ? "dark" : "light"}
                                                        width={Math.round(scale(240))}
                                                        height={verticalScale(22)}
                                                    />
                                                    <Spacer height={verticalScale(15)} />
                                                    <Skeleton
                                                        colorMode={theme.dark ? "dark" : "light"}
                                                        width={Math.round(scale(240))}
                                                        height={Math.round(verticalScale(22))}
                                                    />
                                                </View>
                                            </MotiView>
                                        ))}
                                    </>
                                )}
                            </View>
                            {reviews?.map((item: ReviewsType, index: number) => (
                                <ReviewCard item={item} key={index} />
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Bottom button */}
            <BlurView
                intensity={theme.dark ? 30 : 2}
                style={{
                    backgroundColor: !theme.dark ? "#eaf3fb85" : "#000",
                    paddingHorizontal: windowHeight(12),
                    paddingVertical: windowHeight(8),
                    paddingBottom: IsAndroid ? verticalScale(5) : windowHeight(20),
                }}
            >
                {isPurchased ? (
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#2467EC",
                            paddingVertical: windowHeight(10),
                            borderRadius: windowWidth(8),
                        }}
                        onPress={() => handleCourseAccess()}
                    >
                        <Text
                            style={{
                                textAlign: "center",
                                color: "#FFFF",
                                fontSize: fontSizes.FONT24,
                                fontFamily: "Poppins_600SemiBold",
                            }}
                        >
                            Enter to course
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#2467EC",
                            paddingVertical: windowHeight(10),
                            borderRadius: windowWidth(8),
                            opacity: purchaseLoader ? 0.6 : 1,
                        }}
                        disabled={purchaseLoader}
                    // onPress={handlePurchase}
                    >
                        <Text
                            style={{
                                textAlign: "center",
                                color: "#FFFF",
                                fontSize: fontSizes.FONT24,
                                fontFamily: "Poppins_600SemiBold",
                            }}
                        >
                            Buy now{" "}
                            {courseData?.price === "0" ? "(free)" : `$${courseData?.price}`}
                        </Text>
                    </TouchableOpacity>
                )}
            </BlurView>
        </View>
    );
}
