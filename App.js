import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./navigator/Navigator";
import Authprovider from "./navigator/AuthContext";
import {} from "@env";
export default function App() {
  return (
    <NavigationContainer>
      <Authprovider>
        <Navigator />
      </Authprovider>
    </NavigationContainer>
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
