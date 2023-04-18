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
import getInitials from "./components/getInitials";
export default function OpenedChat({ route }) {
  const navigation = useNavigation();
  const { chat, id } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [chatDetails, setChatDetails] = useState(false);
  const [details, setDetails] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setmessage] = useState({
    message: "",
  });
  const [currentUser, setCurrentUser] = useState("");

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: chat.data.name,
      headerTitleAlign: "center",
      headerStyle: {
        // borderBottomLeftRadius: 20,
        // borderBottomRightRadius: 20,
      },
      headerRight: () => (
        <TouchableOpacity onPress={() => openModal()}>
          <SimpleLineIcons name="options-vertical" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (isLoading) {
      handleGetChat();
    }
  }, [chat, id, isLoading]);

  const handleTyping = (text) => {
    setmessage({ message: text });
  };

  const handleMessage = async (text, chat_id) => {
    const response = await sendMessage(text, chat_id);
    if (response) {
      handleGetChat();
      setmessage({ message: "" });
    }
  };

  const handleGetChat = async () => {
    const user = await AsyncStorage.getItem("whatsthat_user_id");
    const response = await getChatInfo(id);
    if (response) {
      setCurrentUser(user);
      // console.log(user);
      // console.log(response);
      setMessages(sortMessagesByTimestamp(response.data.messages));
      setIsLoading(false);
    }
  };

  const handleAddUser = async (user_id) => {
    const response = await addUserToChat(user_id);
    if (response) {
      //   console.log(response);
    }
  };

  const handleUpdateMessage = async (data, chatid, messageid) => {
    const response = await updateMesssage(data, chatid, messageid);
    if (response) {
      console.log(response);
      handleGetChat();
    }
  };

  const handleDeleteMessage = async (chatid, messageid) => {
    const response = await deleteMessage(chatid, messageid);
    if (response) {
      console.log(response);
      handleGetChat();
    }
  };

  const openModal = async (newid) => {
    handleOpenChat(id);
  };

  const closeModal = () => {
    setChatDetails(false);
  };
  const handleOpenChat = async (newid) => {
    const response = await getChatInfo(newid);
    if (response) {
      setDetails(response);
      setChatDetails(true);
    }
  };
  function sortMessagesByTimestamp(messages) {
    return messages.sort((a, b) => a.timestamp - b.timestamp);
  }

  // const groupedMessages = groupBy(messages, (message) => {
  //   const date = new Date(message.timestamp);
  //   return date.toDateString();
  // });

  const groupedMessages = groupBy(messages, (message) => {
    if (!isLoading) {
      const date = new Date(message.timestamp);
      return date.toDateString();
    }
  });

  // const sections = Object.entries(groupedMessages).map(([title, data]) => ({
  //   title,
  //   data,
  // }));

  const sections = Object.entries(groupedMessages).map(([title, data]) => {
    const authorData = Object.values(
      groupBy(data, (message) => message.author.user_id)
    );
    const subSections = authorData.map((authorMessages) => ({
      subTitle:
        authorMessages[0].author.first_name +
        " " +
        authorMessages[0].author.last_name,
      data: authorMessages,
    }));
    return {
      title,
      data: subSections,
    };
  });

  const renderItem = ({ item, index }) => {
    const receiverBackgroundColor =
      generateColorCode(
        item.data[0].author.first_name + item.data[0].author.last_name
      ) + "4D";

    return (
      <View style={styles.messageContainer}>
        {item.data.map((message, index) => (
          <Message
            key={message.message_id}
            message={message}
            user_id={currentUser}
            chat_id={id}
            updateMessage={handleUpdateMessage}
            deleteMessage={handleDeleteMessage}
            lastItem={item.data.length - 1 === index}
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

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Loading />
      ) : (
        <View style={{ flex: 1 }}>
          <Modal visible={chatDetails}>
            <ChatDetailsModal
              item={details}
              id={id}
              closeDetails={closeModal}
            />
          </Modal>
          <ScrollView>
            <View style={{ height: max }}>
              <SectionList
                sections={sections}
                keyExtractor={(item, index) => item + index}
                renderSectionHeader={({ section: { title, data } }) => (
                  <>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionHeaderText}>{title}</Text>
                    </View>
                  </>
                )}
                renderItem={renderItem}
              />
            </View>
          </ScrollView>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="message"
              onChangeText={handleTyping}
              value={message.message}
              style={[styles.searchBox, { flex: 1 }]}
            />
            <TouchableOpacity onPress={() => handleMessage(message, id)}>
              <Ionicons name="send" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#fff",
    paddingHorizontal: 6,
    paddingTop: 0,
  },
  sectionHeader: {
    // backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignSelf: "center",
    borderRadius: 5,
    padding: 5,
    marginBottom: 10,
  },
  sectionHeaderText: {
    color: "rgba(0, 0, 0, 0.6)",
    // fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: "#e9eaec",
  },
  searchBox: {
    borderRadius: 25,
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#d4d4d4",
  },
});
