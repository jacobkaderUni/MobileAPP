import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import generateColorCode from "./generateColorCode";
export default function Message({
  message,
  chat_id,
  user_id,
  updateMessage,
  deleteMessage,
  previousMessage,
  lastItem,
}) {
  const [prevAuthor, setPrevAuthor] = useState(null);
  const isLastItem = { lastItem };

  useEffect(() => {
    if (prevAuthor && prevAuthor.id === message.author.id) {
      setPrevAuthor(message.author);
    } else {
      setPrevAuthor(null);
    }
  }, [message, prevAuthor]);
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const timeOptions = { hour: "numeric", minute: "numeric" };
    return date.toLocaleTimeString([], timeOptions);
  }

  const senderBackgroundColor = "#1982FC";
  const receiverBackgroundColor =
    generateColorCode(message.author.first_name + message.author.last_name) +
    "4D";

  if (message.author.user_id === parseInt(user_id)) {
    return (
      <View
        style={[
          styles.container,
          styles.senderMessage,
          { backgroundColor: senderBackgroundColor },
        ]}
      >
        <Text key={message.timestamp} style={styles.message}>
          {message.message}{" "}
          <Text style={styles.timestamp}>
            {formatTimestamp(message.timestamp)}{" "}
          </Text>
        </Text>
      </View>
    );
  }

  if (isLastItem.lastItem) {
    return (
      <View style={{ flexDirection: "row" }}>
        <View
          style={[
            styles.container,
            styles.receiverMessageLastItem,
            { backgroundColor: receiverBackgroundColor },
          ]}
        >
          <Text key={message.timestamp} style={styles.message}>
            {message.message}{" "}
            <Text style={styles.timestamp}>
              {formatTimestamp(message.timestamp)}{" "}
            </Text>
          </Text>
        </View>
      </View>
    );
  } else {
    return (
      <View style={{ flexDirection: "row" }}>
        <View
          style={[
            styles.container,
            styles.receiverMessage,
            { backgroundColor: receiverBackgroundColor },
          ]}
        >
          <>
            <Text key={message.timestamp} style={styles.message}>
              {message.message}{" "}
              <Text style={styles.timestamp}>
                {formatTimestamp(message.timestamp)}{" "}
              </Text>
            </Text>
          </>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    maxWidth: "75%",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 24,
    backgroundColor: "#f2f2f2",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1.41,
    elevation: 2,
    marginBottom: 1,
    marginLeft: 10,
  },

  senderMessage: {
    alignSelf: "flex-end",
    borderBottomRightRadius: 0,
  },
  receiverMessage: {
    alignSelf: "flex-start",
  },
  receiverMessageLastItem: {
    alignSelf: "flex-start",
    borderBottomLeftRadius: 0,
  },
  message: {
    fontFamily: "System",
    fontSize: 15,
    lineHeight: 24,
    color: "white",
  },
  timestamp: {
    fontSize: 7,
  },
  receiverTimestamp: {
    fontSize: 3,
    lineHeight: 16,
    color: "#666",
    alignSelf: "flex-start",
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginLeft: 0,
    marginTop: 0,
  },
  initials: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
