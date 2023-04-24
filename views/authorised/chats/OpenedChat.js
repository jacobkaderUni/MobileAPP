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
import { FlatList } from "react-native-web";
import {
  Ionicons,
  SimpleLineIcons,
  FontAwesome,
  AntDesign,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { groupBy, max, set } from "lodash";
import sendMessage from "../../../services/api/chatManagment/sendMessage";
import getChatInfo from "../../../services/api/chatManagment/getChatInfo";
import addUserToChat from "../../../services/api/chatManagment/addUserToChat";
import updateMesssage from "../../../services/api/chatManagment/updateMessage";
import deleteMessage from "../../../services/api/chatManagment/deleteMessage";
import Loading from "../../Loading";
import Message from "./components/message";
import ChatDetailsModal from "./components/ChatDetailsModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import generateColorCode from "./components/generateColorCode";
import Circle from "./components/Circle";
import getInitials from "./components/getInitials";
import Drafts from "./components/Drafts";
import moment from "moment";
import AddUsers from "./components/addUser";
// import SetDateTimeModal from "./components/DraftSetTime";
import ModaleDT from "./components/DraftSetTime";
export default function OpenedChat({ route }) {
  const navigation = useNavigation();
  const { chat, id } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [chatDetails, setChatDetails] = useState(false);
  const [showDrafts, setShowDrafts] = useState(false);
  const [draftMessages, setDraftMessages] = useState([]);
  const [details, setDetails] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setmessage] = useState({
    message: "",
  });

  const [currentDraft, setCurrentDraft] = useState("");
  const [showDateTime, setShowDateTime] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);

  // React.useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerTitle: chat.data.name,
  //     headerTitleAlign: "center",
  //     headerStyle: {},
  //     headerRight: () => (
  //       <View style={{ flexDirection: "row" }}>
  //         <TouchableOpacity>
  //           <AntDesign
  //             name="adduser"
  //             style={{ marginRight: 18, marginBottom: 0 }}
  //             size={30}
  //             color="black"
  //           />
  //         </TouchableOpacity>
  //         <TouchableOpacity
  //           style={{ marginRight: 15 }}
  //           onPress={() => setShowDrafts(true)}
  //         >
  //           <FontAwesome name="edit" size={30} color="black" />
  //         </TouchableOpacity>
  //         <TouchableOpacity
  //           style={{ marginRight: 5 }}
  //           onPress={() => openModal()}
  //         >
  //           <SimpleLineIcons name="options-vertical" size={24} color="black" />
  //         </TouchableOpacity>
  //       </View>
  //     ),
  //   });
  // }, [navigation]);
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle:
        chat.data.name.length > 15
          ? chat.data.name.slice(0, 15) + "..."
          : chat.data.name, //chat.data.name.slice(0, 15) + "...",
      headerTitleAlign: "center",
      headerStyle: {},
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => setShowAddUser(true)}>
            <AntDesign
              name="adduser"
              style={{ marginRight: 18, marginBottom: 0 }}
              size={30}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={() => setShowDrafts(true)}
          >
            <FontAwesome name="edit" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginRight: 5 }}
            onPress={() => openModal()}
          >
            <SimpleLineIcons name="options-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (isLoading) {
      handleGetChat();
      getDrafts();
    }
  }, [chat, id, isLoading, draftMessages]);

  const handleTyping = (text) => {
    setmessage({ message: text });
  };

  const handleMessage = async (text, chat_id) => {
    const response = await sendMessage(text, chat_id);
    if (response) {
      console.log(response);
      handleGetChat();
      setmessage({ message: "" });
    }
  };

  const handleGetChat = async () => {
    const user = await AsyncStorage.getItem("whatsthat_user_id");
    const response = await getChatInfo(id);
    if (response) {
      setCurrentUser(user);
      setMessages(sortMessagesByTimestamp(response.data.messages));
      setIsLoading(false);
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

  const groupedMessages = groupBy(messages, (message) => {
    if (!isLoading) {
      const date = new Date(message.timestamp);
      return date.toDateString();
    }
  });

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

  const handlecloseModal = async () => {
    getDrafts();
    setShowDrafts(false);
  };

  const getDrafts = async () => {
    try {
      const drafts = await AsyncStorage.getItem(id);
      if (drafts) {
        setDraftMessages(JSON.parse(drafts));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveDraftWithTimestamp = async (date) => {
    try {
      getDrafts();
      if (message.message.trim() === "") {
        // If the message is empty, do not save it as a draft
        return;
      }
      // Create a new draft object that includes the message and the selected timestamp

      const newDraft = { message: currentDraft, timestamp: date };
      // Add the current draft object to the draft messages array
      const newDraftMessages = [...draftMessages, newDraft];
      // Store the draft messages array in AsyncStorage
      await AsyncStorage.setItem(id, JSON.stringify(newDraftMessages));
      // Update the draft messages state
      setDraftMessages(newDraftMessages);
      // Close the DateTime modal
      setShowDateTime(false);

      setmessage({ message: "" });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveDraft = () => {
    if (message.message.trim() === "") {
      // If the message is empty, do not save it as a draft
      return;
    }
    setShowDateTime(true);
    setCurrentDraft(message.message);
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
          <Modal
            transparent={true}
            animationIn="fadeIn"
            animationOut="fadeOut"
            visible={showDrafts}
          >
            <View style={styles.overlay}>
              {/* <DraftScreen /> */}
              <Drafts
                id={id}
                handleMessage={handleMessage}
                setShowDrafts={handlecloseModal}
              />
            </View>
          </Modal>
          <Modal
            transparent={true}
            animationIn="fadeIn"
            animationOut="fadeOut"
            visible={showDateTime}
          >
            <View style={styles.overlay}>
              <ModaleDT
                onSetDateTime={handleSaveDraftWithTimestamp}
                setShowModal={setShowDateTime}
              />
              {/* <SetDateTimeModal /> */}
            </View>
          </Modal>
          <Modal visible={showAddUser}>
            <AddUsers />
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
            <TouchableOpacity onPress={() => handleSaveDraft()}>
              <FontAwesome name="edit" size={24} color="black" />
            </TouchableOpacity>
            <TextInput
              placeholder="Text Message"
              onChangeText={handleTyping}
              value={message.message}
              style={[styles.searchBox, { flex: 1 }]}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => handleMessage(message, id)}
            >
              <Ionicons name="send" size={24} color="#1982FC" />
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
  sendButton: {
    position: "absolute",
    right: 10,
    color: "red",
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
    paddingHorizontal: 0,
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
    marginRight: 0,
    borderWidth: 1,
    borderColor: "#d4d4d4",
    opacity: 0.5,
  },
  overlay: { height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    maxHeight: 400,
    width: "90%",
    alignSelf: "center",
    position: "absolute",
    bottom: 20,
    left: "5%",
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 8,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  buttonContainer: {
    flexDirection: "row",
  },
  sendButtonModal: {
    backgroundColor: "#6C63FF",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  sendButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});
