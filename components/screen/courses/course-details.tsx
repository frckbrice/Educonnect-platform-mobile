
import {

    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    RefreshControl,
    ActivityIndicator,
    Animated,
    Dimensions,
} from "react-native";
import { Image } from 'expo-image';
import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { router, useGlobalSearchParams } from "expo-router";
import useUser, { setAuthorizationHeader } from "@/hooks/use-user";

import { AppTheme, useTheme } from "@/context/theme.context";
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

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CourseDetailsScreen() {
    const params = useGlobalSearchParams();
    const [activeButton, setActiveButton] = useState("About");
    const { apiUser, loader: userLoader } = useUser();
    const [purchaseLoader, setPurchaseLoader] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [reviewsLoader, setReviewsLoader] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [imageLoading, setImageLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Animation values - Fixed initialization
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scrollY = useRef(new Animated.Value(0)).current;

    const { theme } = useTheme();

    // Memoized parsed data
    const courseData = useMemo(() => params, [params]);
    const prerequisites = useMemo(() => {
        try {
            const value = params?.prerequisites;
            if (Array.isArray(value)) {
                return JSON.parse(value[0] || '[]');
            }
            return JSON.parse(value || '[]');
        } catch {
            return [];
        }
    }, [params?.prerequisites]);

    const benefits = useMemo(() => {
        try {
            const value = params?.benefits;
            if (Array.isArray(value)) {
                return JSON.parse(value[0] || '[]');
            }
            return JSON.parse(value || '[]');
        } catch {
            return [];
        }
    }, [params?.benefits]);

    const courseContent = useMemo(() => {
        try {
            const value = params?.courseContent;
            if (Array.isArray(value)) {
                return JSON.parse(value[0] || '[]');
            }
            return JSON.parse(value || '[]');
        } catch {
            return [];
        }
    }, [params?.courseContent]);

    // Calculate total lectures from course content
    const totalLectures = useMemo(() => {
        if (!courseContent || !Array.isArray(courseContent)) return 0;
        return courseContent.reduce((total, section) => {
            if (section?.videoSection && Array.isArray(section.videoSection)) {
                return total + section.videoSection.length;
            }
            return total;
        }, 0);
    }, [courseContent]);

    // Memoized course image URL
    const courseImageUrl = useMemo(() => {
        const slugImageMap = {
            "multi-vendor-mern-stack-e-commerce-project-with-all-functionalities-absolutely-for-beginners":
                "https://res.cloudinary.com/dwp4syk3r/image/upload/v1713574266/TMECA_yddc73.png",
            "build-your-mobile-app-development-career-with-react-native":
                "https://res.cloudinary.com/dkg6jv4l0/image/upload/v1731448241/thumbnail_jwi5xo.png"
        };
        const slug = Array.isArray(courseData.slug) ? courseData.slug[0] : courseData.slug;
        return (slug in slugImageMap
            ? slugImageMap[slug as keyof typeof slugImageMap]
            : "https://res.cloudinary.com/dkg6jv4l0/image/upload/v1711468889/courses/spe7bcczfpjmtsdjzm6x.png"
        );
    }, [courseData.slug]);

    // Enhanced entrance animation - Fixed
    useEffect(() => {
        // Reset animation values
        fadeAnim.setValue(0);
        slideAnim.setValue(50);

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, slideAnim]);

    // IAP initialization
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true, // Can use native driver for opacity
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true, // Can use native driver for translateY
            })
        ]).start();

        (
            async () => {
                try {
                    await initConnection();
                    if (Platform.OS === "android") {
                        flushFailedPurchasesCachedAsPendingAndroid();
                    }
                } catch (error: any) {
                    console.log("Error occured during initilization", error.message);
                }
            }
        )()

        const purchaseUpdateSubscription = purchaseUpdatedListener(
            async (purchase) => {
                const receipt = purchase.transactionReceipt;
                if (receipt) {
                    try {
                        await finishTransaction({ purchase, isConsumable: false });
                    } catch (error) {
                        console.log("An error occured while completing transaction", error);
                    }
                }
            }
        );

        const purchaseErrorSubscription = purchaseErrorListener((error) =>
            console.log("Purchase error", error.message)
        );

        return () => {
            endConnection();
            purchaseUpdateSubscription.remove();
            purchaseErrorSubscription.remove();
        };
    }, []);

    // Enhanced reviews fetching with loading state
    const reviewsFetchingHandler = useCallback(async () => {
        if (activeButton === "Reviews" && reviews.length > 0) return;

        setActiveButton("Reviews");
        setReviewsLoader(true);

        try {
            const response = await axios.get(`${API_URL}/reviews/${params.id}`);
            setReviews(response.data.reviewsData || []);
        } catch (error) {
            console.log("Reviews fetch error:", error);
            setReviews([]);
        } finally {
            setReviewsLoader(false);
        }
    }, [params.id, activeButton, reviews.length]);

    // Enhanced purchase handler with better error handling
    const handlePurchase = useCallback(async () => {
        setPurchaseLoader(true);

        try {
            if (courseData.price === "0") {
                await setAuthorizationHeader();
                await axios.post(
                    `${API_URL}/orders/free`,
                    {
                        courseId: courseData.id,
                    }
                );
                setPurchaseLoader(false);
            } else {
                const product = await getProducts({
                    // copy the product ID from app store connect
                    skus: ["test"],
                });
                if (product && product.length > 0) {
                    try {
                        const requestPayload =
                            Platform.OS === "ios"
                                ? { sku: product[0].productId }
                                : { skus: [product[0].productId] }; // note the extra "s" depending of the platform.

                        const purchase: any = await requestPurchase(requestPayload);
                        if (Platform.OS === "ios") {
                            if (purchase?.transactionReceipt) {
                                // send receipt to our backend for validation
                                await setAuthorizationHeader();
                                await axios.post(
                                    `${API_URL}/orders`,
                                    {
                                        receipt: purchase.transactionReceipt,
                                        courseId: courseData.id,
                                        in_app_productId: product[0]?.productId,
                                    }
                                );
                            }
                            await finishTransaction({ purchase, isConsumable: false });
                            setPurchaseLoader(false);
                        } else {
                            if (purchase) {
                                await setAuthorizationHeader();
                                await axios.post(
                                    `${API_URL}/orders/android`,
                                    {
                                        purchaseToken: purchase.transactionReceipt,
                                        productId: purchase.productId,
                                        orderId: purchase.orderId,
                                        userId: apiUser?.id,
                                    }
                                );

                                await finishTransaction({ purchase, isConsumable: false });
                                setPurchaseLoader(false);
                            }
                        }
                    } catch (error) {
                        setPurchaseLoader(false);
                        console.log(error);
                    }
                }
            }
        } catch (error) {
            setPurchaseLoader(false);
        } finally {
            setPurchaseLoader(false);
        }
    }, [purchaseLoader, courseData]);

    const animatedHeight = useRef(new Animated.Value(0)).current;

    const handleCourseAccess = useCallback(() => {
        router.push({
            pathname: "/(routes)/course-access",
            params: { ...courseData },
        });
    }, [courseData]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        if (activeButton === "Reviews") {
            await reviewsFetchingHandler();
        }
        setRefreshing(false);
    }, [activeButton, reviewsFetchingHandler]);

    const toggleDescription = useCallback(() => {
        setIsExpanded(prev => !prev);
    }, []);

    // Loading state
    if (userLoader) {
        return <CourseDetailsLoader />;
    }

    const userOrders = apiUser?.orders;
    const isPurchased = userOrders?.find(
        (order) => order.courseId === courseData.id
    );

    const styles = createStyles(theme);

    // console.log({ slideAnim, courseImageUrl })

    return (
        <View style={styles.container}>
            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={theme.dark ? "#fff" : "#000"}
                    />
                }
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                <Animated.View
                    style={[
                        styles.content,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: Animated.add(slideAnim ? slideAnim : 0, 1) }], // This should work now
                        }
                    ]}
                >
                    {/* Enhanced Image Container */}
                    <View style={styles.imageContainer}>
                        {imageLoading && (
                            <View style={styles.imageLoader}>
                                <ActivityIndicator
                                    size="large"
                                    color={theme.dark ? "#fff" : "#2467EC"}
                                />
                            </View>
                        )}
                        <Image
                            source={courseImageUrl}
                            style={styles.courseImage}
                            contentFit="cover"
                            onLoadStart={() => setImageLoading(true)}
                            onLoadEnd={() => setImageLoading(false)}
                            onError={() => {
                                setImageError(true);
                                setImageLoading(false);
                            }}
                        />
                        {imageError && (
                            <View style={styles.imageError}>
                                <Ionicons
                                    name="image-outline"
                                    size={50}
                                    color={theme.dark ? "#666" : "#ccc"}
                                />
                                <Text style={styles.imageErrorText}>
                                    Failed to load image
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Course Title and Price */}
                    <MotiView
                        from={{ opacity: 0, translateY: 30 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 200 }}
                    >
                        <Text style={styles.courseTitle}>
                            {courseData.name || courseData.title}
                        </Text>

                        <View style={styles.priceContainer}>
                            <View style={styles.priceSection}>
                                {/* Show original price on top if it exists and is different */}
                                {courseData?.estimatedPrice &&
                                    courseData.estimatedPrice !== courseData.price &&
                                    parseFloat(Array.isArray(courseData.estimatedPrice) ? courseData.estimatedPrice[0] : courseData.estimatedPrice) >
                                    parseFloat(Array.isArray(courseData.price) ? courseData.price[0] : courseData.price) && (
                                        <Text style={styles.originalPrice}>
                                            ${Array.isArray(courseData.estimatedPrice) ? courseData.estimatedPrice[0] : courseData.estimatedPrice}
                                        </Text>
                                    )}
                                <Text style={styles.currentPrice}>
                                    ${Array.isArray(courseData.price) ? courseData.price[0] : courseData.price}
                                </Text>
                            </View>

                            <View style={styles.statsContainer}>
                                <View style={styles.statItem}>
                                    <Ionicons
                                        name="people-outline"
                                        size={16}
                                        color={theme.dark ? "#ccc" : "#666"}
                                    />
                                    <Text style={styles.studentsCount}>
                                        {courseData?.purchased || 0} Students
                                    </Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Ionicons
                                        name="play-circle-outline"
                                        size={16}
                                        color={theme.dark ? "#ccc" : "#666"}
                                    />
                                    <Text style={styles.lecturesCount}>
                                        {totalLectures} Lectures
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </MotiView>

                    {/* Prerequisites Section */}
                    {prerequisites?.length > 0 && (
                        <MotiView
                            from={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 400 }}
                            style={styles.section}
                        >
                            <Text style={styles.sectionTitle}>
                                Course Prerequisites
                            </Text>
                            {prerequisites.map((prereq: BenefitsType, index: number) => (
                                <MotiView
                                    key={index}
                                    from={{ opacity: 0, translateX: -20 }}
                                    animate={{ opacity: 1, translateX: 0 }}
                                    transition={{ delay: 500 + index * 100 }}
                                    style={styles.listItem}
                                >
                                    <Ionicons
                                        name="checkmark-circle"
                                        size={scale(20)}
                                        color="#4CAF50"
                                    />
                                    <Text style={styles.listItemText}>
                                        {prereq?.title}
                                    </Text>
                                </MotiView>
                            ))}
                        </MotiView>
                    )}

                    {/* Benefits Section */}
                    {benefits?.length > 0 && (
                        <MotiView
                            from={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 600 }}
                            style={styles.section}
                        >
                            <Text style={styles.sectionTitle}>
                                Course Benefits
                            </Text>
                            {benefits.map((benefit: BenefitsType, index: number) => (
                                <MotiView
                                    key={index}
                                    from={{ opacity: 0, translateX: -20 }}
                                    animate={{ opacity: 1, translateX: 0 }}
                                    transition={{ delay: 700 + index * 100 }}
                                    style={styles.listItem}
                                >
                                    <Ionicons
                                        name="star"
                                        size={scale(20)}
                                        color="#FFD700"
                                    />
                                    <Text style={styles.listItemText}>
                                        {benefit?.title}
                                    </Text>
                                </MotiView>
                            ))}
                        </MotiView>
                    )}

                    {/* Course Tabs */}
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 800 }}
                    >
                        <CourseDetailsTabs
                            activeButton={activeButton}
                            reviewsFetchingHandler={reviewsFetchingHandler}
                            setActiveButton={setActiveButton}
                        />
                    </MotiView>

                    {/* Tab Content */}
                    <MotiView
                        key={activeButton}
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ duration: 300 }}
                        style={styles.tabContent}
                    >
                        {activeButton === "About" && (
                            <View>
                                <Text style={styles.aboutTitle}>
                                    About course
                                </Text>
                                <Text style={styles.description}>
                                    {isExpanded
                                        ? courseData?.description
                                        : courseData?.description?.slice(0, 302)}
                                </Text>
                                {courseData?.description?.length > 302 && (
                                    <TouchableOpacity
                                        style={styles.showMoreButton}
                                        onPress={toggleDescription}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.showMoreText}>
                                            {isExpanded ? "Show Less " : "Show More "}
                                            <Ionicons
                                                name={isExpanded ? "chevron-up" : "chevron-down"}
                                                size={16}
                                            />
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}

                        {activeButton === "Lessons" && (
                            <View>
                                <CourseLesson courseDetails={courseContent} />
                            </View>
                        )}

                        {activeButton === "Reviews" && (
                            <View>
                                {reviewsLoader ? (
                                    <View>
                                        {[...Array(3)].map((_, index) => (
                                            <MotiView
                                                key={index}
                                                style={styles.reviewSkeleton}
                                                animate={{
                                                    backgroundColor: theme.dark ? "#131313" : "#fff",
                                                }}
                                            >
                                                <Skeleton
                                                    colorMode={theme.dark ? "dark" : "light"}
                                                    radius="round"
                                                    height={55}
                                                    width={55}
                                                />
                                                <View style={styles.reviewSkeletonContent}>
                                                    <Skeleton
                                                        colorMode={theme.dark ? "dark" : "light"}
                                                        width={240}
                                                        height={22}
                                                    />
                                                    <Spacer height={15} />
                                                    <Skeleton
                                                        colorMode={theme.dark ? "dark" : "light"}
                                                        width={240}
                                                        height={22}
                                                    />
                                                </View>
                                            </MotiView>
                                        ))}
                                    </View>
                                ) : (
                                    <View style={styles.reviewsContainer}>
                                        {reviews?.length === 0 ? (
                                            <View style={styles.noReviews}>
                                                <Ionicons
                                                    name="chatbubble-outline"
                                                    size={50}
                                                    color={theme.dark ? "#666" : "#ccc"}
                                                />
                                                <Text style={styles.noReviewsText}>
                                                    No reviews yet
                                                </Text>
                                            </View>
                                        ) : (
                                            reviews?.map((review, index) => (
                                                <MotiView
                                                    key={index}
                                                // from={{ opacity: 0, translateY: 20 }}
                                                // animate={{ opacity: 1, translateY: 0 }}
                                                // transition={{ delay: index * 100 }}
                                                >
                                                    <ReviewCard item={review} />
                                                </MotiView>
                                            ))
                                        )}
                                    </View>
                                )}
                            </View>
                        )}
                    </MotiView>
                </Animated.View>

                {/* Bottom padding for fixed button */}
                <View style={{ height: 100 }} />
            </Animated.ScrollView>

            {/* Enhanced Bottom Button */}
            <Animated.View
                style={[
                    styles.bottomContainer,
                    {
                        transform: [{
                            translateY: scrollY.interpolate({
                                inputRange: [0, 100],
                                outputRange: [0, 0],
                                extrapolate: 'clamp',
                            }),
                        }],

                    },
                ]}
            >
                <BlurView
                    intensity={theme.dark ? 30 : 10}
                    style={styles.blurView}
                >
                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            {
                                backgroundColor: isPurchased ? "#4CAF50" : "#2467EC",
                                opacity: purchaseLoader ? 0.7 : 1,
                            }
                        ]}
                        disabled={purchaseLoader}
                        onPress={isPurchased ? handleCourseAccess : handlePurchase}
                        activeOpacity={0.8}
                    >
                        {purchaseLoader ? (
                            <View style={styles.buttonContent}>
                                <ActivityIndicator size="small" color="#fff" />
                                <Text style={styles.buttonText}>Processing...</Text>
                            </View>
                        ) : (
                            <Text style={styles.buttonText}>
                                {isPurchased ? "Enter to course" : `Buy Course - $${courseData?.price}`}
                            </Text>
                        )}
                    </TouchableOpacity>
                </BlurView>
            </Animated.View>
        </View>
    );
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.dark ? "#131313" : "#fff",
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: windowWidth(15),
        paddingTop: windowHeight(15),
    },
    imageContainer: {
        position: 'relative',
        marginBottom: windowHeight(20),
        borderRadius: scale(20),
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    courseImage: {
        width: SCREEN_WIDTH - 30,
        height: (SCREEN_WIDTH - 30) * 0.5625,
        alignSelf: 'center',
    },
    imageLoader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.dark ? "#1a1a1a" : "#f5f5f5",
        zIndex: 1,
    },
    imageError: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.dark ? "#1a1a1a" : "#f5f5f5",
    },
    imageErrorText: {
        marginTop: 10,
        color: theme.dark ? "#666" : "#999",
        fontSize: fontSizes.FONT16,
    },
    courseTitle: {
        fontSize: fontSizes.FONT24,
        fontFamily: "Poppins_600SemiBold",
        color: theme.dark ? "#fff" : "#3E3B54",
        lineHeight: windowHeight(28),
        marginBottom: windowHeight(10),
    },
    priceContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: windowHeight(20),
    },
    priceSection: {
        alignItems: "flex-start",
    },
    currentPrice: {
        fontSize: fontSizes.FONT24,
        fontFamily: "Poppins_600SemiBold",
        color: theme.dark ? "#fff" : "#000",
    },
    originalPrice: {
        fontSize: fontSizes.FONT20,
        fontFamily: "Poppins_400Regular",
        color: !theme.dark ? "#3E3B54" : "#fff",
        textDecorationLine: "line-through",
        marginBottom: 4,
        textDecorationStyle: "solid",
        marginLeft: 20,

    },
    statsContainer: {
        alignItems: "flex-end",
    },
    statItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    studentsCount: {
        fontSize: fontSizes.FONT14,
        fontFamily: "Poppins_400Regular",
        color: theme.dark ? "#ccc" : "#666",
        marginLeft: 4,
    },
    lecturesCount: {
        fontSize: fontSizes.FONT14,
        fontFamily: "Poppins_400Regular",
        color: theme.dark ? "#ccc" : "#666",
        marginLeft: 4,
    },
    section: {
        marginBottom: windowHeight(25),
    },
    sectionTitle: {
        fontSize: fontSizes.FONT22,
        fontFamily: "Poppins_600SemiBold",
        color: theme.dark ? "#fff" : "#3E3B54",
        marginBottom: windowHeight(15),
    },
    listItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: windowHeight(8),
        paddingHorizontal: windowWidth(5),
        marginBottom: windowHeight(5),
        backgroundColor: theme.dark ? "#1a1a1a" : "#f8f9fa",
        borderRadius: scale(8),
    },
    listItemText: {
        marginLeft: windowWidth(12),
        fontSize: fontSizes.FONT16,
        color: theme.dark ? "#fff" : "#000",
        flex: 1,
        lineHeight: windowHeight(22),
    },
    tabContent: {
        marginHorizontal: scale(12),
        marginVertical: verticalScale(15),
    },
    aboutTitle: {
        fontSize: fontSizes.FONT22,
        fontFamily: "Poppins_600SemiBold",
        color: theme.dark ? "#fff" : "#000",
        marginBottom: windowHeight(15),
    },
    description: {
        color: theme.dark ? "#ccc" : "#525258",
        fontSize: fontSizes.FONT16,
        lineHeight: windowHeight(24),
        textAlign: "justify",
    },
    showMoreButton: {
        marginTop: verticalScale(10),
        alignSelf: 'flex-start',
    },
    showMoreText: {
        color: "#2467EC",
        fontSize: fontSizes.FONT16,
        fontFamily: "Poppins_500Medium",
    },
    reviewsContainer: {
        gap: windowHeight(20),
    },
    noReviews: {
        alignItems: 'center',
        paddingVertical: windowHeight(40),
    },
    noReviewsText: {
        marginTop: 10,
        color: theme.dark ? "#666" : "#999",
        fontSize: fontSizes.FONT18,
    },
    reviewSkeleton: {
        flexDirection: "row",
        gap: scale(10),
        marginVertical: verticalScale(10),
        padding: scale(15),
        borderRadius: scale(12),
    },
    reviewSkeletonContent: {
        flex: 1,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    blurView: {
        paddingHorizontal: windowWidth(15),
        paddingVertical: windowHeight(15),
        paddingBottom: IsAndroid ? windowHeight(10) : windowHeight(25),
    },
    actionButton: {
        paddingVertical: windowHeight(15),
        borderRadius: scale(12),
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    buttonText: {
        textAlign: "center",
        color: "#FFFFFF",
        fontSize: fontSizes.FONT18,
        fontFamily: "Poppins_600SemiBold",
    },
});
