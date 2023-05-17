import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Users2 from "../views/authorised/users/Users2";
import BlockedContacts from "../views/authorised/contacts/BlockedContacts";
import NewContacts from "../views/authorised/contactsSB /newContacts";
const UsersTab = createMaterialTopTabNavigator();

const UsersTabScreen = React.memo(() => {
  return (
    <UsersTab.Navigator>
      <UsersTab.Screen name="Users" component={Users2} />
      <UsersTab.Screen name="Contacts" component={NewContacts} />
      <UsersTab.Screen name="Blocked" component={BlockedContacts} />
    </UsersTab.Navigator>
  );
});

export default UsersTabScreen;
