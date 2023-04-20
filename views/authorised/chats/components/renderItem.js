import React from "react";
import { View } from "react-native";
import Circle from "./Circle";
import Message from "./message";
import generateColorCode from "./generateColorCode";
import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Message from "./components/message";
import generateColorCode from "./components/generateColorCode";
import Circle from "./components/Circle";

const renderItem = ({ item, index, currentUser, isLoading }) => {
  if (!isLoading) {
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
  );
};
