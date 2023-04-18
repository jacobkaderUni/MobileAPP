import React from "react";
import { View, Text, StyleSheet } from "react-native";
const Circle = ({ initials, backgroundColor }) => {
  return (
    <View style={[styles.circle, { backgroundColor: backgroundColor }]}>
      <Text style={styles.initials}>{initials}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginLeft: 0,
    marginBottom: 10,
  },
  initials: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default Circle;
