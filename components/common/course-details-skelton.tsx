import { View, ScrollView } from 'react-native'
import React from 'react'
import { scale, verticalScale } from 'react-native-size-matters'
import { MotiView } from 'moti'
import { useTheme } from '@/context/theme.context';
import { Skeleton } from 'moti/skeleton';
import { windowHeight, windowWidth } from '@/utils/app-constant';
import { Spacer } from './skelton';

export default function CourseDetailsLoader() {
    const { theme } = useTheme();

    return (
        <ScrollView
            style={{
                paddingTop: verticalScale(45),
                backgroundColor: "#2A2D32",
                flex: 1,
            }}
            showsVerticalScrollIndicator={false}
        >
            <MotiView
                transition={{
                    type: "timing",
                }}
                style={{ flex: 1, justifyContent: "center", padding: scale(14) }}
                animate={{ backgroundColor: theme.dark ? "transparent" : "#fff" }}
            >
                <Skeleton
                    width={windowWidth(440)}
                    height={windowHeight(150)}
                    colorMode={theme.dark ? "dark" : "light"}
                />
                <Spacer />
                <Spacer />
                <Skeleton
                    colorMode={theme.dark ? "dark" : "light"}
                    width={windowWidth(440)}
                    height={windowHeight(22)}
                />
                <Spacer />
                <Skeleton
                    colorMode={theme.dark ? "dark" : "light"}
                    width={windowWidth(440)}
                    height={windowHeight(22)}
                />
                <Spacer />
                <Skeleton
                    colorMode={theme.dark ? "dark" : "light"}
                    width={windowWidth(440)}
                    height={windowHeight(22)}
                />
                <Spacer />
                <Spacer />
                <Spacer />
                <Skeleton
                    colorMode={theme.dark ? "dark" : "light"}
                    width={windowWidth(440)}
                    height={windowHeight(22)}
                />
                <Spacer />
                <Skeleton
                    colorMode={theme.dark ? "dark" : "light"}
                    width={windowWidth(440)}
                    height={windowHeight(22)}
                />
                <Spacer />
                <Skeleton
                    colorMode={theme.dark ? "dark" : "light"}
                    width={windowWidth(440)}
                    height={windowHeight(22)}
                />
                <Spacer />
                <Spacer />
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Skeleton
                        colorMode={theme.dark ? "dark" : "light"}
                        width={windowWidth(125)}
                        height={windowHeight(30)}
                    />
                    <Skeleton
                        colorMode={theme.dark ? "dark" : "light"}
                        width={windowWidth(125)}
                        height={windowHeight(30)}
                    />
                    <Skeleton
                        colorMode={theme.dark ? "dark" : "light"}
                        width={windowWidth(125)}
                        height={windowHeight(30)}
                    />
                </View>
                <Spacer />
                <Spacer />
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
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
                            width={scale(240)}
                            height={verticalScale(22)}
                        />
                        <Spacer height={verticalScale(15)} />
                        <Skeleton
                            colorMode={theme.dark ? "dark" : "light"}
                            width={scale(240)}
                            height={verticalScale(22)}
                        />
                    </View>
                </View>
                <Spacer />
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
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
                            width={scale(240)}
                            height={verticalScale(22)}
                        />
                        <Spacer height={verticalScale(15)} />
                        <Skeleton
                            colorMode={theme.dark ? "dark" : "light"}
                            width={scale(240)}
                            height={verticalScale(22)}
                        />
                    </View>
                </View>
            </MotiView>
        </ScrollView>
    )
}
