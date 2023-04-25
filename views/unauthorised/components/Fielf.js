import React from "react";
import { TextInput } from "react-native";
import { darkGreen } from "./Constants";
import { useState } from "react";

const Field = (props) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
      {...props}
      style={{
        borderRadius: 100,
        height: 50,
        color: darkGreen,
        paddingHorizontal: 10,
        width: "78%",
        backgroundColor: isFocused ? "rgb(230,230, 230)" : "rgb(247,247, 247)",
        marginVertical: 10,
      }}
      placeholderTextColor={darkGreen}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    ></TextInput>
  );
};

export default Field;
