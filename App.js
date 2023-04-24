import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./navigator/Navigator";
import Authprovider from "./navigator/AuthContext";
import React, { Component } from "react";
import { ToastProvider } from "react-native-toast-notifications";
export default function App() {
  return (
    <ToastProvider>
      <NavigationContainer>
        <Authprovider>
          <Navigator />
        </Authprovider>
      </NavigationContainer>
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
