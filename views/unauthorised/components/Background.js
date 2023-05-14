import React from "react";
import { View, ImageBackground, Text, StyleSheet } from "react-native";
const Background = ({ children }) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("/Users/jacobkader/Documents/GitHub/MobileAPP/assets/backg6.jpeg")}
        style={styles.image}
      >
        <View style={{ position: "absolute" }}>{children}</View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
  },
});
export default Background;
