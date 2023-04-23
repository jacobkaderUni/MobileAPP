import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Settings2 from "../views/authorised/account/SettingsT2";
import Camera2 from "../views/authorised/account/cameraHandling.s/cameraTrue";

const SettingStack = createStackNavigator();

const SettingStackScreen = React.memo(() => {
  return (
    <SettingStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingStack.Screen name="Setting" component={Settings2} />
      <SettingStack.Screen name="Camera" component={Camera2} />
    </SettingStack.Navigator>
  );
});

export default SettingStackScreen;
