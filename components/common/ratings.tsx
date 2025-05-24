// import React, { FC } from "react";
// import { Text, View } from "react-native";
// import FontAwesome from "@expo/vector-icons/FontAwesome";

// type Props = {
//     rating: number;
// };

// const Ratings: FC<Props> = ({ rating }) => {
//     const stars = [];

//     for (let i = 1; i <= 5; i++) {
//         if (i <= rating) {
//             stars.push(
//                 <View style={{ marginLeft: 5 }}>
//                     <FontAwesome name="star" size={24} color="#F6B100" />
//                 </View>
//             );
//         } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
//             stars.push(
//                 <View>
//                     <FontAwesome name="star-half-empty" size={24} color="#F6B100" />
//                 </View>
//             );
//         } else {
//             stars.push(
//                 <View>
//                     <FontAwesome name="star-o" size={24} color="#F6B100" />
//                 </View>
//             );
//         }
//     }
//     return <Text>{stars}</Text>;
// };

// export default Ratings;

import React from "react";
import { View, ViewStyle } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface RatingProps {
    rating: number;
    maxRating?: number;
    size?: number;
    color?: string;
    style?: ViewStyle;
    testID?: string;
}

const Rating: React.FC<RatingProps> = ({
    rating,
    maxRating = 5,
    size = 16,
    color = "#FFD700",
    style,
    testID,
}) => {
    // Clamp rating between 0 and maxRating
    const clampedRating = Math.max(0, Math.min(rating, maxRating));

    const renderStars = () => {
        return Array.from({ length: maxRating }, (_, index) => {
            const starPosition = index + 1;

            let starType: "star" | "star-half-o" | "star-o";

            if (starPosition <= clampedRating) {
                starType = "star";
            } else if (starPosition === Math.ceil(clampedRating) && !Number.isInteger(clampedRating)) {
                starType = "star-half-o";
            } else {
                starType = "star-o";
            }

            return (
                <FontAwesome
                    key={`star-${index}`}
                    name={starType}
                    size={size}
                    color={color}
                />
            );
        });
    };

    return (
        <View
            style={[{ flexDirection: "row", alignItems: "center" }, style]}
            testID={testID}
        >
            {renderStars()}
        </View>
    );
};

export default Rating;
