import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Users2 from "../views/authorised/users/Users2";
import BlockedContacts from "../views/authorised/contacts/BlockedContacts";
import Contacts from "../views/authorised/contacts/Contacts";
import List from "../views/authorised/contacts/List";

const UsersTab = createMaterialTopTabNavigator();

const UsersTabScreen = React.memo(() => {
  return (
    <UsersTab.Navigator>
      <UsersTab.Screen name="Users" component={Users2} />
      <UsersTab.Screen name="Contacts" component={Contacts} />
      <UsersTab.Screen name="Blocked" component={BlockedContacts} />
      {/* <UsersTab.Screen name="Test" component={List} /> */}
    </UsersTab.Navigator>
  );
});

export default UsersTabScreen;
