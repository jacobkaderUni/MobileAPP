import React from "react";
import { Image, StyleSheet } from "react-native-web";
import DisplayImage from "../cameraHandling.s/Display";
export default function Avatar(image) {
  if (image) {
    console.log(image);
    return (
      <>
        <Image
          source={{
            uri: image,
          }}
          style={styles.profileAvatar}
        />
      </>
    );
  } else {
    return (
      <Image
        alt=""
        source={require("/Users/jkader/Documents/GitHub/MobileAPP/assets/defaultUser.png")}
        style={styles.profileAvatar}
      />
    );
  }
}
const styles = StyleSheet.create({
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 9999,
  },
});
