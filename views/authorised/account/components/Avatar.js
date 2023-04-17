import React from "react";
import { Image, StyleSheet } from "react-native-web";

export default function Avatar() {
  return (
    <Image
      alt=""
      source={require("/Users/jacobkader/Documents/GitHub/MobileAPP/assets/backg6.jpeg")}
      style={styles.profileAvatar}
    />
  );
}

const styles = StyleSheet.create({
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 9999,
  },
});
