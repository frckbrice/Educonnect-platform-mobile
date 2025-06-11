
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Linking,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "@/context/theme.context";
import { useGlobalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { scale, verticalScale } from "react-native-size-matters";
import {
    fontSizes,
    IsIPAD,
    windowHeight,
    windowWidth,
} from "@/utils/app-constant";
import {
    AntDesign,
    FontAwesome,
    MaterialCommunityIcons,
    Ionicons,
} from "@expo/vector-icons";
import { WIDTH } from "@/config/constants";
import axios from "axios";
import { setAuthorizationHeader } from "@/hooks/use-user";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import { Spacer } from "@/components/common/skelton";
import { CourseDataType, QuestionType, ReviewsType } from "@/config/global";
import QuestionCard from "@/components/card/question.card";
import ReviewCard from "@/components/card/review.card";
import BottomCourseAccess from "./bottom.course.access";
import { WebView } from "react-native-webview";
import { API_URL } from "@/utils/env-constant";
import { extractYouTubeVideoId } from "@/utils/helps-functions";

const VideoPlayer = ({ currentVideo }: { currentVideo: any }) => {
    const videoId = extractYouTubeVideoId(currentVideo.videoUrl);

    <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 20
    }}>
        <Text style={{ fontSize: 16, color: '#666' }}>Invalid video URL</Text>
    </View>

    return (
        <View style={styles.videoContainer}>
            <WebView
                source={{
                    uri: `https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0&controls=1&playsinline=1`,
                }}
                style={styles.webView}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                allowsInlineMediaPlayback={true}
                allowsFullscreenVideo={true}
                startInLoadingState={true}
                renderLoading={() => (
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#000'
                    }}>
                        <ActivityIndicator size="large" color="#fff" />
                    </View>
                )}
                onError={(error) => {
                    console.log('Video load error:', error.nativeEvent);
                }}
            />
        </View>
    );
};

export default function CourseAccess() {
    const { theme } = useTheme();
    const params: any = useGlobalSearchParams();
    const courseContents: CourseDataType[] = JSON.parse(params?.courseContent);
    const [activeVideo, setActiveVideo] = useState(0);
    const [activeButton, setActiveButton] = useState("Overview");
    const [question, setQuestion] = useState("");
    const [questionsLoader, setQuestionsLoader] = useState(true);
    const [reviews, setReviews] = useState<ReviewsType[]>([]);
    const [reviewsLoader, setReviewsLoader] = useState(false);
    const [review, setReview] = useState("");
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [replies, setReplies] = useState<QuestionType[]>([]);
    const [rating, setRating] = useState(1);
    const [videoCompleteHistory, setVideoCompleteHistory] = useState([]);
    const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const bottomSheetRef = useRef(null);
    const scrollViewRef = useRef<ScrollView>(null);

    // Add safety check for courseContents
    useEffect(() => {
        if (!courseContents || courseContents.length === 0) {
            console.error("Course content is empty or invalid");
            return;
        }
    }, [courseContents]);

    useEffect(() => {
        const gettingLastHistory = async () => {
            if (params?.activeVideo) {
                const videoIndex = parseInt(params.activeVideo);
                if (videoIndex >= 0 && videoIndex < courseContents.length) {
                    setActiveVideo(videoIndex);
                }
            } else {
                try {
                    // the last session is link to the course id as the current param id
                    const lastSession = await SecureStore.getItemAsync(params?.id);
                    if (lastSession) {
                        const sessionIndex = parseInt(lastSession);
                        if (sessionIndex >= 0 && sessionIndex < courseContents.length) {
                            setActiveVideo(sessionIndex);
                        } else {
                            setActiveVideo(0);
                        }
                    } else {
                        setActiveVideo(0);
                    }
                } catch (error) {
                    console.error("Error getting last session:", error);
                    setActiveVideo(0);
                }
            }
        };
        gettingLastHistory();
    }, [courseContents.length, params?.activeVideo, params?.id]);

    const handlePrevLesson = async () => {
        if (activeVideo <= 0) {
            return;
        }

        const newActiveVideo = activeVideo - 1;
        setActiveVideo(newActiveVideo);

        try {
            await SecureStore.setItemAsync(
                params?.id,
                JSON.stringify(newActiveVideo)
            );
        } catch (error) {
            console.error("Error saving previous lesson:", error);
        }
    };

    const handleNextLesson = async ({ contentId }: { contentId: string }) => {
        if (activeVideo >= courseContents.length - 1) {
            return;
        }

        const newActiveVideo = activeVideo + 1;
        setActiveVideo(newActiveVideo);

        try {
            await SecureStore.setItemAsync(params?.id, JSON.stringify(newActiveVideo));
        } catch (error) {
            console.error("Error saving next lesson:", error);
        }
    };

    const questionsFetchHandler = useCallback(async () => {
        const currentVideo = courseContents[activeVideo];
        if (!currentVideo?.id) {
            console.error("Current video or video ID is undefined");
            setQuestionsLoader(false);
            return;
        }

        try {
            await setAuthorizationHeader();
            const response = await axios.get(
                `${API_URL}/questions/${currentVideo?.id}`
            );
            setQuestions(response.data?.questions || []);
        } catch (error) {
            console.error("Error fetching questions:", error);
            setQuestions([]);
        } finally {
            setQuestionsLoader(false);
        }
    }, [activeVideo, courseContents]);

    const handleQuestionSubmit = useCallback(async () => {
        if (!question.trim()) {
            Alert.alert("Error", "Please enter a question before submitting.");
            return;
        }

        const currentVideo = courseContents[activeVideo];
        try {
            setIsSubmittingQuestion(true);
            await setAuthorizationHeader();
            await axios.post(`${API_URL}/questions`, {
                question,
                contentId: currentVideo?.id,
            });

            setQuestion("");
            Alert.alert("Success", "Your question has been submitted successfully!");
            await questionsFetchHandler();
        } catch (error: any) {
            console.error("Error submitting question:", error.message);
            Alert.alert("Error", "Failed to submit question. Please try again.");
        } finally {
            setIsSubmittingQuestion(false);
        }
    }, [question, activeVideo, courseContents]);

    const reviewsFetchHandler = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/reviews/${params?.id}`);
            setReviews(response.data?.reviewsData || []);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            setReviews([]);
        }
    }, [params?.id, setReviews]);

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i < 6; i++) {
            stars.push(
                <TouchableOpacity key={i} onPress={() => setRating(i)}>
                    <FontAwesome
                        name={i <= rating ? "star" : "star-o"}
                        size={24}
                        color={"#FF8D07"}
                        style={{ marginHorizontal: 3 }}
                    />
                </TouchableOpacity>
            );
        }
        return stars;
    };

    const handleReviewSubmit = async () => {
        if (!review.trim()) {
            Alert.alert("Error", "Please write a review before submitting.");
            return;
        }

        try {
            setIsSubmittingReview(true);
            await setAuthorizationHeader();
            await axios.post(`${API_URL}/reviews`, {
                ratings: rating,
                review,
                courseId: params?.id,
            });
            setReview("");
            setRating(1);
            Alert.alert("Success", "Your review has been submitted successfully!");
            await reviewsFetchHandler();
        } catch (error) {
            console.error("Error submitting review:", error);
            Alert.alert("Error", "Failed to submit review. Please try again.");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    // Safety check - don't render if no course content
    if (!courseContents || courseContents.length === 0) {
        return (
            <View style={[styles.container, { backgroundColor: theme.dark ? "#111" : "#fff" }]}>
                <View style={styles.errorContainer}>
                    <Ionicons
                        name="alert-circle-outline"
                        size={48}
                        color={theme.dark ? "#fff" : "#000"}
                    />
                    <Text style={[styles.errorText, { color: theme.dark ? "#fff" : "#000" }]}>
                        No course content available
                    </Text>
                </View>
            </View>
        );
    }

    // Safety check - ensure activeVideo is within bounds
    const currentVideo = courseContents[activeVideo];
    if (!currentVideo) {
        return (
            <View style={[styles.container, { backgroundColor: theme.dark ? "#111" : "#fff" }]}>
                <View style={styles.errorContainer}>
                    <Ionicons
                        name="videocam-off-outline"
                        size={48}
                        color={theme.dark ? "#fff" : "#000"}
                    />
                    <Text style={[styles.errorText, { color: theme.dark ? "#fff" : "#000" }]}>
                        Video not found
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: theme.dark ? "#111" : "#fff" }]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
            <ScrollView
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Video Player Section */}
                {/* <View style={styles.videoContainer}>
                    <WebView
                        source={{
                            uri: `https://www.youtube.com/embed/${currentVideo.videoUrl}`,
                        }}
                        style={styles.webView}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                    />
                </View> */}

                {/* <View style={styles.videoContainer}>
                    <WebView
                        source={{
                            uri: `https://www.youtube.com/embed/${currentVideo.videoUrl}?rel=0&showinfo=0&controls=1&autoplay=0&playsinline=1&modestbranding=1`,
                        }}
                        style={styles.webView}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        allowsInlineMediaPlayback={true}
                        mediaPlaybackRequiresUserAction={false}
                        allowsFullscreenVideo={true}
                        startInLoadingState={true}
                        renderLoading={() => (
                            <View style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#000'
                            }}>
                                <ActivityIndicator size="large" color="#fff" />
                            </View>
                        )}
                        onError={(syntheticEvent) => {
                            const { nativeEvent } = syntheticEvent;
                            console.warn('WebView error: ', nativeEvent);
                        }}
                    />
                </View> */}
                <VideoPlayer currentVideo={currentVideo} />

                {/* Video Info Header */}
                <View style={styles.videoInfoHeader}>
                    <View style={styles.videoNavigation}>
                        <TouchableOpacity
                            onPress={() => handlePrevLesson()}
                            disabled={activeVideo <= 0}
                            style={[styles.navButton, { opacity: activeVideo <= 0 ? 0.3 : 1 }]}
                        >
                            <AntDesign name="left" size={scale(18)} color={theme.dark ? "#fff" : "#000"} />
                        </TouchableOpacity>

                        <View style={styles.videoInfoCenter}>
                            <Text style={[styles.videoNumber, { color: theme.dark ? "#fff" : "#000" }]}>
                                {activeVideo < 9 && "0"}{activeVideo + 1}
                            </Text>
                            <Text style={[styles.videoTitle, { color: theme.dark ? "#fff" : "#000" }]}>
                                {currentVideo.title || "Untitled Video"}
                            </Text>
                            <Text style={[styles.videoSection, { color: theme.dark ? "#aaa" : "#666" }]}>
                                Module: {currentVideo.videoSection || "N/A"}
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => handleNextLesson({ contentId: currentVideo.id })}
                            disabled={activeVideo >= courseContents.length - 1}
                            style={[styles.navButton, { opacity: activeVideo >= courseContents.length - 1 ? 0.3 : 1 }]}
                        >
                            <AntDesign name="right" size={scale(18)} color={theme.dark ? "#fff" : "#000"} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Resources and Certificate Section */}
                <View style={styles.resourcesContainer}>
                    <View style={styles.resourcesSection}>
                        <View style={styles.sectionHeader}>
                            <MaterialCommunityIcons
                                name="layers-triple-outline"
                                size={20}
                                color={theme.dark ? "#fff" : "#000"}
                            />
                            <Text style={[styles.sectionTitle, { color: theme.dark ? "#fff" : "#000" }]}>
                                Resources
                            </Text>
                        </View>
                        {currentVideo.links?.length > 0 ? (
                            currentVideo.links.map((link: any, index: number) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.resourceLink}
                                    onPress={() => Linking.openURL(link?.url)}
                                >
                                    <Ionicons name="link-outline" size={16} color="#2467EC" />
                                    <Text style={styles.linkText}>{link?.title}</Text>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={[styles.noResourcesText, { color: theme.dark ? "#aaa" : "#666" }]}>
                                No resources available
                            </Text>
                        )}
                    </View>

                    <View style={styles.certificateSection}>
                        <View style={styles.sectionHeader}>
                            <MaterialCommunityIcons
                                name="certificate-outline"
                                size={20}
                                color={theme.dark ? "#fff" : "#000"}
                            />
                            <Text style={[styles.sectionTitle, { color: theme.dark ? "#fff" : "#000" }]}>
                                Certificate
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.certificateButton}>
                            <Text style={styles.certificateButtonText}>Finish Course</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    {["Overview", "Q&A", "Reviews"].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[
                                styles.tab,
                                activeButton === tab && {
                                    borderBottomColor: theme.dark ? "#fff" : "#000",
                                    borderBottomWidth: 2
                                }
                            ]}
                            onPress={() => {
                                setActiveButton(tab);
                                if (tab === "Q&A") questionsFetchHandler();
                                if (tab === "Reviews") reviewsFetchHandler();
                            }}
                        >
                            <Text style={[
                                styles.tabText,
                                {
                                    color: theme.dark ? "#fff" : "#000",
                                    opacity: activeButton === tab ? 1 : 0.6
                                }
                            ]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Tab Content */}
                <View style={styles.tabContent}>
                    {activeButton === "Overview" && (
                        <View style={styles.overviewContainer}>
                            <Text style={[styles.descriptionText, { color: theme.dark ? "#fff" : "#000" }]}>
                                {currentVideo.description || "No description available for this video."}
                            </Text>
                        </View>
                    )}

                    {activeButton === "Q&A" && (
                        <View style={styles.qaContainer}>
                            <View style={styles.inputSection}>
                                <TextInput
                                    value={question}
                                    onChangeText={setQuestion}
                                    placeholder="Ask a question about this lesson..."
                                    placeholderTextColor={theme.dark ? "#aaa" : "#666"}
                                    style={[
                                        styles.textInput,
                                        {
                                            color: theme.dark ? "#fff" : "#000",
                                            borderColor: theme.dark ? "#444" : "#ddd",
                                            backgroundColor: theme.dark ? "#222" : "#f9f9f9",
                                        }
                                    ]}
                                    multiline={true}
                                    textAlignVertical="top"
                                />
                                <TouchableOpacity
                                    style={[
                                        styles.submitButton,
                                        {
                                            opacity: question.trim() === "" || isSubmittingQuestion ? 0.5 : 1
                                        }
                                    ]}
                                    disabled={question.trim() === "" || isSubmittingQuestion}
                                    onPress={handleQuestionSubmit}
                                >
                                    <Text style={styles.submitButtonText}>
                                        {isSubmittingQuestion ? "Submitting..." : "Submit"}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.questionsContainer}>
                                {questionsLoader ? (
                                    <>
                                        {[0, 1, 2, 3].map((i) => (
                                            <MotiView
                                                key={i}
                                                style={styles.skeletonContainer}
                                                animate={{
                                                    backgroundColor: theme.dark ? "#222" : "#f9f9f9",
                                                }}
                                            >
                                                <Skeleton
                                                    colorMode={theme.dark ? "dark" : "light"}
                                                    radius="round"
                                                    height={40}
                                                    width={40}
                                                />
                                                <View style={styles.skeletonTextContainer}>
                                                    <Skeleton
                                                        colorMode={theme.dark ? "dark" : "light"}
                                                        width={200}
                                                        height={16}
                                                    />
                                                    <Spacer height={8} />
                                                    <Skeleton
                                                        colorMode={theme.dark ? "dark" : "light"}
                                                        width={150}
                                                        height={16}
                                                    />
                                                </View>
                                            </MotiView>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        {questions.length > 0 ? (
                                            questions.map((q: QuestionType, index: number) => (
                                                <QuestionCard
                                                    question={q}
                                                    key={index}
                                                    activeVideo={activeVideo}
                                                    courseSlug={params?.slug}
                                                    setQuestions={setQuestions}
                                                />
                                            ))
                                        ) : (
                                            <View style={styles.emptyStateContainer}>
                                                <Ionicons
                                                    name="chatbubble-outline"
                                                    size={48}
                                                    color={theme.dark ? "#444" : "#ccc"}
                                                />
                                                <Text style={[styles.emptyStateText, { color: theme.dark ? "#aaa" : "#666" }]}>
                                                    No questions yet. Be the first to ask!
                                                </Text>
                                            </View>
                                        )}
                                    </>
                                )}
                            </View>
                        </View>
                    )}

                    {activeButton === "Reviews" && (
                        <View style={styles.reviewsContainer}>
                            <View style={styles.inputSection}>
                                <View style={styles.ratingContainer}>
                                    <Text style={[styles.ratingLabel, { color: theme.dark ? "#fff" : "#000" }]}>
                                        Rate this course:
                                    </Text>
                                    <View style={styles.starsContainer}>
                                        {renderStars()}
                                    </View>
                                </View>

                                <TextInput
                                    value={review}
                                    onChangeText={setReview}
                                    placeholder="Share your thoughts about this course..."
                                    placeholderTextColor={theme.dark ? "#aaa" : "#666"}
                                    style={[
                                        styles.textInput,
                                        {
                                            color: theme.dark ? "#fff" : "#000",
                                            borderColor: theme.dark ? "#444" : "#ddd",
                                            backgroundColor: theme.dark ? "#222" : "#f9f9f9",
                                        }
                                    ]}
                                    multiline={true}
                                    textAlignVertical="top"
                                />
                                <TouchableOpacity
                                    style={[
                                        styles.submitButton,
                                        {
                                            opacity: review.trim() === "" || isSubmittingReview ? 0.5 : 1
                                        }
                                    ]}
                                    disabled={review.trim() === "" || isSubmittingReview}
                                    onPress={handleReviewSubmit}
                                >
                                    <Text style={styles.submitButtonText}>
                                        {isSubmittingReview ? "Submitting..." : "Submit Review"}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.reviewsListContainer}>
                                {reviews.length > 0 ? (
                                    reviews.map((item: ReviewsType, index: number) => (
                                        <ReviewCard item={item} key={index} />
                                    ))
                                ) : (
                                    <View style={styles.emptyStateContainer}>
                                        <Ionicons
                                            name="star-outline"
                                            size={48}
                                            color={theme.dark ? "#444" : "#ccc"}
                                        />
                                        <Text style={[styles.emptyStateText, { color: theme.dark ? "#aaa" : "#666" }]}>
                                            No reviews yet. Be the first to review!
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Bottom shortcuts */}
            <BottomCourseAccess
                bottomSheetRef={bottomSheetRef}
                courseContent={courseContents}
                courseData={params}
                activeVideo={activeVideo}
                setActiveVideo={setActiveVideo}
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: verticalScale(100),
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scale(20),
    },
    errorText: {
        fontSize: fontSizes.FONT20,
        fontWeight: '500',
        marginTop: verticalScale(10),
        textAlign: 'center',
    },
    videoContainer: {
        backgroundColor: "#000",
        marginVertical: verticalScale(10),
        marginHorizontal: scale(16),
        borderRadius: scale(12),
        overflow: 'hidden',
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    webView: {
        width: windowWidth(450),
        height: windowHeight(160),
    },
    videoInfoHeader: {
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(16),
    },
    videoNavigation: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    navButton: {
        padding: scale(8),
        borderRadius: scale(20),
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    videoInfoCenter: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: scale(16),
    },
    videoNumber: {
        fontSize: fontSizes.FONT18,
        fontWeight: '600',
        marginBottom: verticalScale(4),
    },
    videoTitle: {
        fontSize: fontSizes.FONT20,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: verticalScale(4),
    },
    videoSection: {
        fontSize: fontSizes.FONT16,
        fontWeight: '400',
    },
    resourcesContainer: {
        flexDirection: 'row',
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(16),
        gap: scale(16),
    },
    resourcesSection: {
        flex: 1,
    },
    certificateSection: {
        flex: 1,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(12),
    },
    sectionTitle: {
        fontSize: fontSizes.FONT18,
        fontWeight: '600',
        marginLeft: scale(8),
    },
    resourceLink: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: verticalScale(8),
        paddingHorizontal: scale(12),
        backgroundColor: 'rgba(36, 103, 236, 0.1)',
        borderRadius: scale(8),
        marginBottom: verticalScale(8),
    },
    linkText: {
        fontSize: fontSizes.FONT16,
        color: '#2467EC',
        marginLeft: scale(8),
        flex: 1,
    },
    noResourcesText: {
        fontSize: fontSizes.FONT16,
        fontStyle: 'italic',
        textAlign: 'center',
        paddingVertical: verticalScale(20),
    },
    certificateButton: {
        backgroundColor: '#2467EC',
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(16),
        borderRadius: scale(8),
        alignItems: 'center',
    },
    certificateButtonText: {
        color: '#fff',
        fontSize: fontSizes.FONT16,
        fontWeight: '600',
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: scale(16),
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    tab: {
        paddingVertical: verticalScale(16),
        paddingHorizontal: scale(20),
        marginRight: scale(16),
    },
    tabText: {
        fontSize: fontSizes.FONT16,
        fontWeight: '600',
    },
    tabContent: {
        flex: 1,
        paddingHorizontal: scale(16),
    },
    overviewContainer: {
        paddingVertical: verticalScale(20),
    },
    descriptionText: {
        fontSize: fontSizes.FONT16,
        lineHeight: verticalScale(24),
        opacity: 0.8,
    },
    qaContainer: {
        paddingVertical: verticalScale(20),
    },
    reviewsContainer: {
        paddingVertical: verticalScale(20),
    },
    inputSection: {
        marginBottom: verticalScale(24),
    },
    textInput: {
        borderWidth: 1,
        borderRadius: scale(12),
        padding: scale(16),
        fontSize: fontSizes.FONT16,
        minHeight: verticalScale(100),
        marginBottom: verticalScale(12),
    },
    submitButton: {
        backgroundColor: '#2467EC',
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(24),
        borderRadius: scale(24),
        alignSelf: 'flex-end',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: fontSizes.FONT16,
        fontWeight: '600',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(16),
    },
    ratingLabel: {
        fontSize: fontSizes.FONT16,
        fontWeight: '500',
        marginRight: scale(12),
    },
    starsContainer: {
        flexDirection: 'row',
    },
    questionsContainer: {
        gap: verticalScale(16),
    },
    reviewsListContainer: {
        gap: verticalScale(16),
    },
    skeletonContainer: {
        flexDirection: 'row',
        padding: scale(16),
        borderRadius: scale(12),
        gap: scale(12),
    },
    skeletonTextContainer: {
        flex: 1,
    },
    emptyStateContainer: {
        alignItems: 'center',
        paddingVertical: verticalScale(40),
    },
    emptyStateText: {
        fontSize: fontSizes.FONT16,
        fontWeight: '500',
        marginTop: verticalScale(12),
        textAlign: 'center',
    },
});
