import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MenuProvider } from "react-native-popup-menu";
import React from "react";
import { useAuth } from "./AuthContext";
import ChatStackScreen from "./ChatStack";
import List from "../views/authorised/contacts/List";
import UsersTabScreen from "./UserStab";
import Settings from "../views/authorised/account/SettingsT";
import Settings2 from "../views/authorised/account/SettingsT2";
import Home from "../views/unauthorised/startpage";
import Login from "../views/unauthorised/LoginTest";
import Register from "../views/unauthorised/RegisterTest";
import SettingStackScreen from "./SettingsStack";
import { Entypo, MaterialIcons, Ionicons } from "@expo/vector-icons";
// import newContacts from "../views/authorised/contactsSB /newContacts";
// any problems with camera, check this website
// https://stackoverflow.com/questions/71190250/camera-not-working-with-react-native-expo-invalid-hook-call

//There seems to be something strange going on with peer dependencies. Try to delete rm -rf node_modules/expo-camera/node_modules/react if this solves it for you.
import Camera2 from "../views/authorised/account/cameraHandling.s/cameraTrue";
const AuthStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

function Navigator() {
  const [user] = useAuth();

  if (!user) {
    return (
      <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Home" component={Home} />
        <AuthStack.Screen name="login" component={Login} />
        <AuthStack.Screen name="register" component={Register} />
      </AuthStack.Navigator>
    );
  }

  return (
    <MenuProvider>
      <MainTab.Navigator screenOptions={{ headerShown: false }}>
        <MainTab.Screen
          name="ChatStackScreen"
          component={ChatStackScreen}
          options={{
            tabBarLabel: "Chats",
            tabBarIcon: () => <Entypo name="chat" size={24} color="black" />,
          }}
        />
        <MainTab.Screen
          name="UsersTabScreen"
          component={UsersTabScreen}
          options={{
            tabBarLabel: "Contacts",
            tabBarIcon: () => (
              <MaterialIcons name="contacts" size={24} color="black" />
            ),
          }}
        />
        <MainTab.Screen
          name="Settings"
          component={SettingStackScreen}
          options={{
            tabBarLabel: "Settings",
            tabBarIcon: () => (
              <Ionicons name="settings" size={24} color="black" />
            ),
          }}
        />
      </MainTab.Navigator>
    </MenuProvider>
  );
}

export default Navigator;
