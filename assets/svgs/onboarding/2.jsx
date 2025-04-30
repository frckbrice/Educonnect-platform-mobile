import React from "react";
import { Image } from "react-native";

export default function Two() {
  const SvgImage = () => (
    <Image source={require("@/assets/images/onboarding/2.png")} />
  );

  return <SvgImage />;
}
