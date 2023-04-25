import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Button,
} from "react-native";
import generateColorCode from "./generateColorCode";
import formatTimestamp from "./ConvertTime";
import { Modal } from "react-native-web";
import { Ionicons } from "@expo/vector-icons";

export default function Message({
  message,
  chat_id,
  user_id,
  updateMessage,
  deleteMessage,
  lastItem,
}) {
  const [prevAuthor, setPrevAuthor] = useState(null);
  const isLastItem = { lastItem };
  const [showOptions, setShowOptions] = useState(false);
  const [isedditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setShowOptions(false);
  };

  const handlePress = () => {
    setShowOptions(!showOptions);
  };
  useEffect(() => {
    if (prevAuthor && prevAuthor.id === message.author.id) {
      setPrevAuthor(message.author);
    } else {
      setPrevAuthor(null);
    }
  }, [message, prevAuthor]);

  const senderBackgroundColor = "#1982FC";
  const receiverBackgroundColor =
    generateColorCode(message.author.first_name + message.author.last_name) +
    "4D";

  function handleDelete() {
    deleteMessage(chat_id, message.message_id);
  }

  ///////
  const EditModal = () => {
    const [editedMessage, setEditedMessage] = useState({
      message: message.message,
    });
    const handleUpdate = () => {
      updateMessage(editedMessage, chat_id, message.message_id);
      setIsEditing(false);
      setShowOptions(false);
    };

    return (
      <View style={styles.modalContainer}>
        <TouchableOpacity
          onPress={() => setIsEditing((prevState) => !prevState)}
        >
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder={editedMessage.message}
          value={editedMessage.message}
          onChangeText={(text) => setEditedMessage({ message: text })}
        />
        <Button title="edit message" onPress={handleUpdate} />
      </View>
    );
  };
  ///////
  if (message.author.user_id === parseInt(user_id)) {
    if (isLastItem.lastItem) {
      return (
        <>
          <View
            style={[
              styles.container,
              styles.senderMessage,
              { backgroundColor: senderBackgroundColor },
            ]}
          >
            <TouchableOpacity onPress={handlePress}>
              <Text key={message.timestamp} style={styles.message}>
                {message.message}{" "}
              </Text>
              {showOptions && (
                <View style={styles.optionsContainer}>
                  <TouchableOpacity onPress={() => handleEdit()}>
                    <Text style={styles.option}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete()}>
                    <Text style={styles.option}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.timeSender}>
            {formatTimestamp(message.timestamp)}
          </Text>
          <Modal
            transparent={true}
            animationIn="fadeIn"
            animationOut="fadeOut"
            visible={isedditing}
          >
            <View style={styles.overlay}>
              <EditModal />
            </View>
          </Modal>
        </>
      );
    }
    return (
      <>
        <View
          style={[
            styles.container,
            styles.senderMessage,
            { backgroundColor: senderBackgroundColor },
          ]}
        >
          <TouchableOpacity onPress={handlePress}>
            <Text key={message.timestamp} style={styles.message}>
              {message.message}{" "}
            </Text>
            {showOptions && (
              <View style={styles.optionsContainer}>
                <TouchableOpacity onPress={() => handleEdit()}>
                  <Text style={styles.option}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete()}>
                  <Text style={styles.option}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <Modal
          transparent={true}
          animationIn="fadeIn"
          animationOut="fadeOut"
          visible={isedditing}
        >
          <View style={styles.overlay}>
            <EditModal />
          </View>
        </Modal>
      </>
    );
  }

  if (isLastItem.lastItem) {
    return (
      <>
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
            </Text>
          </View>
        </View>
        <Text style={styles.time}>{formatTimestamp(message.timestamp)}</Text>
      </>
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
  time: {
    fontSize: 10,
    marginLeft: 27,
    marginTop: 10,
    opacity: 0.5,
  },
  timeSender: {
    alignSelf: "flex-end",
    fontSize: 10,
    marginLeft: 27,
    marginTop: 3,
    opacity: 0.5,
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
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 5,
  },
  option: {
    color: "red",
    marginHorizontal: 10,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 80,
  },
  input: {
    height: 40,
    width: "100%",
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  overlay: { height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)" },
});
