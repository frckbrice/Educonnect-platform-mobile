// import GradiantText from "@/components/common/gradient-text";
// import SkeltonLoader from "@/components/common/skelton";
// import { CourseData } from "@/config/constants";
// import { useTheme } from "@/context/theme.context";
// import useGetCourses from "@/hooks/use-course";
// import {
//     fontSizes,
//     windowHeight,
//     windowWidth
// } from "@/utils/app-constant";
// import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
// import { LinearGradient } from "expo-linear-gradient";
// import React from "react";
// import { FlatList, Text, View } from "react-native";
// import { scale, verticalScale } from "react-native-size-matters";
// import HomeBanner from "./home-banner";
// import WelcomeHeader from "./welcome-header";

// export default function HomeScreen() {
//     const { theme } = useTheme();
//     const { courses, loading } = useGetCourses();

//     const bottomTabBarHeight = useBottomTabBarHeight();

//     return (
//         <>
//             <LinearGradient
//                 colors={
//                     theme.dark ? ["#180D41", "#2A2D32", "#131313"] : ["#fff", "#f7f7f7"]
//                 }
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 0, y: 1 }}
//                 style={{
//                     flex: 1,
//                     backgroundColor: theme.dark ? "#101010" : "#fff",
//                 }}
//             >
//                 <WelcomeHeader />
//                 <View style={{ flex: 1 }}>
//                     {loading ? (
//                         <>
//                             <SkeltonLoader />
//                             <SkeltonLoader />
//                         </>
//                     ) : (
//                         <View
//                             style={{
//                                 paddingHorizontal: scale(8),
//                             }}
//                         >
//                             <FlatList
//                                 ListHeaderComponent={() => (
//                                     <>
//                                         <HomeBanner />
//                                         <View
//                                             style={{
//                                                 marginHorizontal: windowWidth(20),
//                                                 marginTop: verticalScale(-25),
//                                             }}
//                                         >
//                                             <View
//                                                 style={{
//                                                     flexDirection: "row",
//                                                     marginTop: windowHeight(5),
//                                                 }}
//                                             >
//                                                 <Text
//                                                     style={{
//                                                         fontSize: fontSizes.FONT35,
//                                                         fontFamily: "Poppins_500Medium",
//                                                         color: theme.dark ? "#fff" : "#000",
//                                                     }}
//                                                 >
//                                                     Popular
//                                                 </Text>
//                                                 <GradiantText
//                                                     text="Courses"
//                                                     styles={{
//                                                         fontSize: fontSizes.FONT35,
//                                                         fontFamily: "Poppins_500Medium",
//                                                         paddingLeft: scale(5),
//                                                     }}
//                                                 />
//                                             </View>
//                                             <View
//                                                 style={{ flexDirection: "row", alignItems: "center" }}
//                                             >
//                                                 <View
//                                                     style={{
//                                                         backgroundColor: "#12BB70",
//                                                         width: windowWidth(15),
//                                                         height: windowWidth(15),
//                                                         borderRadius: 100,
//                                                     }}
//                                                 />
//                                                 <Text
//                                                     style={{
//                                                         fontFamily: "Poppins_400Regular",
//                                                         fontSize: fontSizes.FONT18,
//                                                         paddingLeft: windowWidth(5),
//                                                         color: theme.dark ? "#fff" : "#000",
//                                                     }}
//                                                 >
//                                                     our comprehensive project based courses
//                                                 </Text>
//                                             </View>
//                                         </View>
//                                     </>
//                                 )}
//                                 data={CourseData}
//                                 showsVerticalScrollIndicator={false}
//                                 keyExtractor={(item) => item.id}
//                                     // renderItem={({ item }) => <CourseCard item={item} />}
//                                     renderItem={({ item }) => <Text>{item.title}</Text>}
//                                 ListEmptyComponent={<Text>No courses Available yet!</Text>}
//                                 ListFooterComponent={() => (
//                                     <View
//                                         style={{
//                                             height: theme.dark
//                                                 ? verticalScale(60)
//                                                 : verticalScale(10),
//                                         }}
//                                     ></View>
//                                 )}
//                             />
//                         </View>
//                     )}
//                 </View>
//             </LinearGradient>
//         </>
//     );
// }

import CourseCard from "@/components/card/course-card";
import GradiantText from "@/components/common/gradient-text";
import SkeltonLoader from "@/components/common/skelton";
import { CourseData } from "@/config/constants";
import { useTheme } from "@/context/theme.context";
import useGetCourses from "@/hooks/use-course";
import {
    fontSizes,
    windowHeight,
    windowWidth,
} from "@/utils/app-constant";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Text,
    View
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import HomeBanner from "./home-banner";
import WelcomeHeader from "./welcome-header";

export default function HomeScreen() {
    const { theme } = useTheme();
    const { courses, loading } = useGetCourses();
    const bottomTabBarHeight = useBottomTabBarHeight();
    const [ready, setReady] = useState(false);
    const isMounted = useRef(true);

    // Guard to prevent view rendering too early
    useEffect(() => {
        const timer = setTimeout(() => {
            if (isMounted.current) setReady(true);
        }, 500); // Slight delay to let native views settle

        return () => {
            isMounted.current = false;
            clearTimeout(timer);
        };
    }, []);

    if (!ready) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: theme.dark ? "#101010" : "#fff",
                }}
            >
                <ActivityIndicator size="large" color="#12BB70" />
            </View>
        );
    }

    return (
        <LinearGradient
            colors={
                theme.dark
                    ? ["#180D41", "#2A2D32", "#131313"]
                    : ["#fff", "#f7f7f7"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
                flex: 1,
                backgroundColor: theme.dark ? "#101010" : "#fff",
            }}
        >
            <WelcomeHeader />
            <View style={{ flex: 1, paddingVertical: theme.dark ? windowHeight(5) : bottomTabBarHeight, }}>
                {loading ? (
                    <>
                        <SkeltonLoader />
                        <SkeltonLoader />
                    </>
                ) : (
                    <View style={{ paddingHorizontal: scale(8) }}>
                        <FlatList
                            ListHeaderComponent={() => (
                                <>
                                    <HomeBanner />
                                    <View
                                        style={{
                                            marginHorizontal: windowWidth(20),
                                            marginTop: verticalScale(-25),
                                        }}
                                    >
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                marginTop: windowHeight(5),
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: fontSizes.FONT35,
                                                    fontFamily: "Poppins_500Medium",
                                                    color: theme.dark ? "#fff" : "#000",
                                                }}
                                            >
                                                Popular
                                            </Text>
                                            <GradiantText
                                                text="Courses"
                                                styles={{
                                                    fontSize: fontSizes.FONT35,
                                                    fontFamily: "Poppins_500Medium",
                                                    paddingLeft: scale(5),
                                                }}
                                            />
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                            }}
                                        >
                                            <View
                                                style={{
                                                    backgroundColor: "#12BB70",
                                                    width: windowWidth(15),
                                                    height: windowWidth(15),
                                                    borderRadius: 100,
                                                }}
                                            />
                                            <Text
                                                style={{
                                                    fontFamily: "Poppins_400Regular",
                                                    fontSize: fontSizes.FONT18,
                                                    paddingLeft: windowWidth(5),
                                                    color: theme.dark ? "#fff" : "#000",
                                                }}
                                            >
                                                our comprehensive project based courses
                                            </Text>
                                        </View>
                                    </View>
                                </>
                            )}
                            data={CourseData}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <CourseCard item={item} />
                            )}
                            ListEmptyComponent={
                                <Text>No courses available yet!</Text>
                            }
                            ListFooterComponent={() => (
                                <View
                                    style={{
                                        height: theme.dark
                                            ? verticalScale(60)
                                            : verticalScale(10),
                                    }}
                                />
                            )}
                        />
                    </View>
                )}
            </View>
        </LinearGradient>
    );
}
