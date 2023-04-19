import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";

import Circle from "./Circle";
import Message from "./message";
import generateColorCode from "./generateColorCode";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SectionList,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { groupBy, max } from "lodash";
import sendMessage from "../../../services/api/chatManagment/sendMessage";
import getChatInfo from "../../../services/api/chatManagment/getChatInfo";
import addUserToChat from "../../../services/api/chatManagment/addUserToChat";
import updateMesssage from "../../../services/api/chatManagment/updateMessage";
import deleteMessage from "../../../services/api/chatManagment/deleteMessage";
import Loading from "../../Loading";
import Message from "./components/message";
import ChatDetailsModal from "./components/ChatDetailsModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { green } from "../../unauthorised/components/Constants";
import generateColorCode from "./components/generateColorCode";
import Circle from "./components/Circle";
const renderItem = ({ item, index, currentUser, isLoading }) => {
  console.log(item);
  if (!isLoading) {
    // console.log(item.data[0].author.first_name);
    // console.log(item.data[0].author.user_id);
    // console.log(currentUser);
  }
  const receiverBackgroundColor =
    generateColorCode(
      item.data[0].author.first_name + item.data[0].author.last_name
    ) + "4D";

  return (
    <View style={styles.messageContainer}>
      {item.data.map((message) => (
        <Message
          key={message.message_id}
          message={message}
          user_id={currentUser}
          chat_id={id}
          updateMessage={handleUpdateMessage}
          deleteMessage={handleDeleteMessage}
        />
      ))}
      {item.data[0].author.user_id !== parseInt(currentUser) && (
        <Circle
          initials={getInitials(
            item.data[0].author.first_name,
            item.data[0].author.last_name
          )}
          backgroundColor={receiverBackgroundColor}
        />
      )}
    </View>
    // <Message
    //   message={item}
    //   user_id={currentUser}
    //   chat_id={id}
    //   updateMessage={handleUpdateMessage}
    //   deleteMessage={handleDeleteMessage}
    // />
  );
};
