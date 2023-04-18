import { GiftedChat } from "react-native-gifted-chat";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Textarea,
  TextInput,
} from "react-native";

function generateColorCode(name) {
  const hash = name.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
}

export default function Message2({
  message,
  chat_id,
  user_id,
  updateMessage,
  deleteMessage,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState({
    message: message.message,
  });

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const timeOptions = { hour: "numeric", minute: "numeric" };
    return date.toLocaleTimeString([], timeOptions);
  }
  const messageBackgroundColor =
    message.author.user_id === parseInt(user_id)
      ? "#b7bab6"
      : generateColorCode(
          message.author.first_name + message.author.last_name
        ) + "4D";
  const messageStyle =
    message.author.user_id === parseInt(user_id)
      ? styles.senderMessage
      : styles.receiverMessage;

  const timestampStyle =
    message.author.user_id === parseInt(user_id)
      ? styles.senderTimestamp
      : styles.receiverTimestamp;

  function handleEdit() {
    setIsEditing(true);
  }

  function handleSubmit() {
    updateMessage(editedMessage, chat_id, message.message_id);
    setIsEditing(false);
  }

  function handleDelete() {
    deleteMessage(chat_id, message.message_id);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <View
        style={[
          styles.container,
          messageStyle,
          { backgroundColor: messageBackgroundColor },
        ]}
      >
        <TextInput
          value={editedMessage.message}
          //onChangeText={setEditedMessage}
          onChangeText={(text) =>
            setEditedMessage({ ...editedMessage, message: text })
          }
          onSubmitEditing={handleSubmit}
          autoFocus={true}
        />
        <Button title="Submit" onPress={handleSubmit} />
        <Button title="Delete" onPress={handleDelete} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        messageStyle,
        { backgroundColor: messageBackgroundColor },
      ]}
    >
      <Text key={message.timestamp} style={[styles.message]}>
        {message.message}{" "}
        <Text style={[styles.timestamp, timestampStyle]}>
          {formatTimestamp(message.timestamp)}{" "}
          {message.author.first_name.charAt(0)}{" "}
          {message.author.last_name.charAt(0)}
        </Text>
      </Text>
      {message.author.user_id === parseInt(user_id) && (
        <Button title="Edit" onPress={handleEdit} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  senderMessage: {
    alignSelf: "flex-end",
  },
  receiverMessage: {
    alignSelf: "flex-start",
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
  },
  senderTimestamp: {
    fontSize: 12,
    lineHeight: 16,
    color: "#666",
    alignSelf: "flex-end",
  },
  receiverTimestamp: {
    fontSize: 12,
    lineHeight: 16,
    color: "#666",
    alignSelf: "flex-start",
  },
});
