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
        {/* <MainTab.Screen name="settings" component={Settings} /> */}
        {/* <MainTab.Screen name="settings2" component={Settings2} /> */}
        <MainTab.Screen name="ChatStackScreen" component={ChatStackScreen} />
        <MainTab.Screen name="UsersTabScreen" component={UsersTabScreen} />
        <MainTab.Screen name="settings2" component={Settings2} />

        {/* <MainTab.Screen name="List" component={List} /> */}
      </MainTab.Navigator>
    </MenuProvider>
  );
}

export default Navigator;
