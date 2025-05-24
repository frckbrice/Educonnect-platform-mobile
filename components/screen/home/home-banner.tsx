import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Swiper from "react-native-swiper";
import * as WebBrowser from "expo-web-browser";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { IsIPAD } from "@/utils/app-constant";
import { bannerData } from "@/config/constants";

export default function HomeBanner() {

    // apple constraint. Need to open the browser with the app
    const handlePress = async (item: string) => {
        await WebBrowser.openBrowserAsync(item);
    };

    return (
        <View style={styles.container}>
            <Swiper
                dotStyle={styles.dot}
                activeDotStyle={styles.activeDot}
                autoplay={true}
                autoplayTimeout={5}
                style={{ height: IsIPAD ? moderateScale(240) : moderateScale(230) }}
            >
                {bannerData.map((item, index: number) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.slide}
                        onPress={() => handlePress(item.url)}
                    >
                        <Image
                            source={{ uri: item.image! }}
                            alt=""
                            style={{
                                height: IsIPAD ? moderateScale(200) : moderateScale(185),
                                objectFit: "cover",
                                borderRadius: scale(5),
                            }}
                        />
                    </TouchableOpacity>
                ))}
            </Swiper>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: verticalScale(10),
        paddingHorizontal: verticalScale(7),
    },
    dot: {
        backgroundColor: "#C6C7CC",
        width: scale(8),
        height: scale(8),
        borderRadius: scale(5),
        marginHorizontal: verticalScale(3),
    },
    activeDot: {
        backgroundColor: "#2467EC",
        width: scale(8),
        height: scale(8),
        borderRadius: scale(5),
        marginHorizontal: verticalScale(3),
    },
    slide: { flex: 1, marginHorizontal: scale(10) },
});