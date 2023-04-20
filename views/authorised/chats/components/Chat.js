import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function Chat({ chat, getChat }) {
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const timeOptions = { hour: "numeric", minute: "numeric" };
    return date.toLocaleTimeString([], timeOptions);
  }

  const getChatInfo = () => {
    getChat();
  };

  return (
    <TouchableOpacity onPress={() => getChatInfo()}>
      <View style={styles.container}>
        <View style={styles.cardAvatar}>
          <Text style={styles.cardAvatarText}>{chat.chat_id}</Text>
        </View>

        {/* <TouchableOpacity onPress={() => getChatInfo()}> */}
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>{chat.name}</Text>
          {chat.last_message.author && (
            <Text style={styles.cardMessage}>
              <Text style={styles.cardName}>
                {chat.last_message.author.first_name.charAt(0).toUpperCase()}
                {chat.last_message.author.first_name
                  .charAt(chat.last_message.author.first_name.length - 1)
                  .toUpperCase()}
              </Text>{" "}
              {chat.last_message.message}{" "}
              <Text style={styles.cardTime}>
                - {formatTimestamp(chat.last_message.timestamp)}
              </Text>
            </Text>
          )}
        </View>

        {/* <Text>OPEN</Text> */}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    paddingVertical: 14,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#d6d6d6",
    height: 75,
    // borderRadius: 15,
  },
  cardAvatar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9ca1ac",
    width: 55,
    height: 55,
    borderRadius: 27,
    marginRight: 12,
  },
  cardAvatarText: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#fff",
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000",
  },
  cardMessage: {
    fontSize: 14,
    color: "#616d79",
    marginTop: 3,
    maxWidth: "70%",
  },
  cardName: {
    fontWeight: "700",
  },
  cardTime: {
    marginLeft: 4,
  },
});
