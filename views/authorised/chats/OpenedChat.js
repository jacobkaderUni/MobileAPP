import React, { useState, useEffect, useRef } from "react";
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
import { useToast } from "react-native-toast-notifications";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

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
  const [chatName, setChatName] = useState(chat.data.name);
  const [currentDraft, setCurrentDraft] = useState("");
  const [showDateTime, setShowDateTime] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);
  const [isAnyModalOpen, setIsAnyModalOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [distanceFromBottom, setDistanceFromBottom] = useState(0);
  const prevMessageCountRef = useRef(0);
  const curMessageCountRef = useRef(0);
  const myLastMessage = useRef(false);
  const [showNewMessageNotification, setShowNewMessageNotification] =
    useState(false);

  const toast = useToast();
  const scrollViewRef = useRef();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      // headerTitle:
      //   chat.data.name.length > 15
      //     ? chat.data.name.slice(0, 15) + "..."
      //     : chat.data.name, //chat.data.name.slice(0, 15) + "...",
      headerTitle:
        chatName.length > 15 ? chatName.slice(0, 15) + "..." : chatName, //chat.data.name.slice(0, 15) + "...",
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
  }, [navigation, chatName]);

  useEffect(() => {
    if (isLoading) {
      handleGetChat();
      getDrafts();
    }
    if (!isAnyModalOpen) {
      const intervalId = setInterval(() => {
        handleGetChat();
        if (curMessageCountRef.current > prevMessageCountRef.current) {
          console.log(myLastMessage.current);
          if (!myLastMessage.current && prevMessageCountRef.current !== 0) {
            handleNewMessage();
            console.log("new message");
          }
          // Update the previous message count ref with the current message count
          prevMessageCountRef.current = curMessageCountRef.current;
        }
      }, 2000);
      return () => clearInterval(intervalId);
    }
  }, [
    chat,
    id,
    isLoading,
    draftMessages,
    isAnyModalOpen,
    showNewMessageNotification,
    distanceFromBottom,
  ]);

  const handleTyping = (text) => {
    setmessage({ message: text });
  };

  const handleMessage = async (text, chat_id) => {
    try {
      const response = await sendMessage(text, chat_id);
      if (response.status === 200) {
        // console.log(response);
        handleGetChat();
        setmessage({ message: "" });
      }
    } catch (error) {
      if (error.response.status === 400) {
        toast.show("Message cant be send", {
          type: "warning",
          placement: "top",
          duration: 1000,
          animationType: "slide-in",
        });
      } else if (error.response.status === 401) {
        toast.show("Unauthorised", {
          type: "warning",
          placement: "top",
          duration: 1000,
          animationType: "slide-in",
        });
      } else if (error.response.status === 403) {
        toast.show("Forbidden", {
          type: "warning",
          placement: "top",
          duration: 1000,
          animationType: "slide-in",
        });
      } else if (error.response.status === 404) {
        toast.show("Not found", {
          type: "warning",
          placement: "top",
          duration: 1000,
          animationType: "slide-in",
        });
      } else if (error.response.status === 500) {
        toast.show("Server Error", {
          type: "danger",
          placement: "top",
          duration: 1000,
          animationType: "slide-in",
        });
      }
    }
  };

  const handleGetChat = async () => {
    try {
      const user = await AsyncStorage.getItem("whatsthat_user_id");
      const response = await getChatInfo(id);
      if (response.status === 200) {
        if (response.data.messages.length == 0) {
          curMessageCountRef.current = response.data.messages.length;
          setChatName(response.data.name);
          setCurrentUser(user);
          // setMessages(sortMessagesByTimestamp(response.data.messages));
          setIsLoading(false);
        } else {
          curMessageCountRef.current = response.data.messages.length;
          let sender = sortMessagesByTimestamp(response.data.messages)[
            response.data.messages.length - 1
          ].author.user_id;

          if (sender === parseInt(user)) {
            myLastMessage.current = true;
          } else {
            myLastMessage.current = false;
          }
          setChatName(response.data.name);
          setCurrentUser(user);
          setMessages(sortMessagesByTimestamp(response.data.messages));
          setIsLoading(false);
        }
        // curMessageCountRef.current = response.data.messages.length;
        // // console.log(
        // //   sortMessagesByTimestamp(response.data.messages)[
        // //     response.data.messages.length - 1
        // //   ].author.user_id
        // // );
        // let sender = sortMessagesByTimestamp(response.data.messages)[
        //   response.data.messages.length - 1
        // ].author.user_id;

        // if (sender === parseInt(user)) {
        //   myLastMessage.current = true;
        // } else {
        //   myLastMessage.current = false;
        // }
        // setChatName(response.data.name);
        // setCurrentUser(user);
        // setMessages(sortMessagesByTimestamp(response.data.messages));
        // setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
        toast.show("Unauthorised", {
          type: "warning",
          placement: "top",
          duration: 1000,
          animationType: "slide-in",
        });
      } else if (error.response.status === 403) {
        toast.show("You have been removed from the chat", {
          type: "danger",
          placement: "top",
          duration: 1000,
          animationType: "slide-in",
        });
        navigation.goBack();
      }
      //  else if (error.response.status === 404) {
      //   toast.show("Not found", {
      //     type: "danger",
      //     placement: "top",
      //     duration: 1000,
      //     animationType: "slide-in",
      //   });
      // }
      else if (error.response.status === 500) {
        toast.show("Server Error", {
          type: "danger",
          placement: "top",
          duration: 1000,
          animationType: "slide-in",
        });
      }
    }
  };

  const handleUpdateMessage = async (data, chatid, messageid) => {
    try {
      const response = await updateMesssage(data, chatid, messageid);
      if (response.status === 200) {
        toast.show("message edited", {
          type: "normal",
          placement: "top",
          duration: 1000,
          animationType: "slide-in",
        });
        handleGetChat();
        setIsAnyModalOpen(false);
      }
    } catch (error) {
      if (error.response.status === 400) {
        toast.show("Message cant be edited", {
          type: "warning",
          placement: "top",
          duration: 1000,
          animationType: "slide-in",
        });
      } else if (error.response.status === 401) {
        toast.show("Unauthorised", {
          type: "warning",
          placement: "top",
          duration: 1000,
          animationType: "slide-in",
        });
      } else if (error.response.status === 403) {
        toast.show("Forbidden, possibly removed from the chat", {
          type: "warning",
          placement: "top",
          duration: 1000,
          animationType: "slide-in",
        });
      } else if (error.response.status === 404) {
        toast.show("Not found", {
          type: "warning",
          placement: "top",
          duration: 1000,
          animationType: "slide-in",
        });
      } else if (error.response.status === 500) {
        toast.show("Server Error", {
          type: "danger",
          placement: "top",
          duration: 1000,
          animationType: "slide-in",
        });
      }
    }
  };

  const handleDeleteMessage = async (chatid, messageid) => {
    try {
      const response = await deleteMessage(chatid, messageid);
      if (response.status === 200) {
        if (response.data === "OK") {
          toast.show("Message deleted", {
            type: "success",
            placement: "top",
            duration: 1000,
            animationType: "slide-in",
          });
        }
        handleGetChat();
      }
    } catch (error) {
      if (error.response.status === 401) {
        toast.show("Unauthorised", {
          type: "warning",
          placement: "top",
          duration: 1000,
          animationType: "slide-in",
        });
      } else if (error.response.status === 403) {
        console.log(error);
        toast.show("Forbidden", {
          type: "warning",
          placement: "top",
          duration: 1000,
          animationType: "slide-in",
        });
      } else if (error.response.status === 404) {
        toast.show("not found", {
          type: "warning",
          placement: "top",
          duration: 1000,
          animationType: "slide-in",
        });
      } else if (error.response.status === 500) {
        toast.show("Server Error", {
          type: "danger",
          placement: "top",
          duration: 1000,
          animationType: "slide-in",
        });
      }
    }
  };

  const openModal = async (newid) => {
    handleOpenChat(id);
  };

  const closeModal = () => {
    handleGetChat();
    setChatDetails(false);
  };

  const closeAddUser = () => {
    setShowAddUser(false);
  };
  const handleOpenChat = async (newid) => {
    const response = await getChatInfo(newid);
    if (response) {
      setDetails(response);
      setChatDetails(true);
    }
  };

  // function groupMessagesByAuthor(messages) {
  //   // Sort messages by timestamp
  //   messages.sort((a, b) => a.timestamp - b.timestamp);

  //   // Group messages by author
  //   const groups = [];
  //   let currentAuthor = null;
  //   for (const message of messages) {
  //     if (message.author !== currentAuthor) {
  //       groups.push({ author: message.author, messages: [] });
  //       currentAuthor = message.author;
  //     }
  //     const lastGroup = groups[groups.length - 1];
  //     lastGroup.messages.push(message);
  //   }

  //   return groups;
  // }
  function sortMessagesByTimestamp(messages) {
    return messages.sort((a, b) => a.timestamp - b.timestamp);
  }

  // const groupedMessages = groupBy(messages, (message) => {
  //   if (!isLoading) {
  //     const date = new Date(message.timestamp);

  //     return date.toDateString();
  //   }
  // });
  // const sections = Object.entries(groupedMessages).map(([title, data]) => {
  //   const authorData = Object.values(
  //     groupBy(data, (message) => message.author.user_id)
  //   );
  //   const test = Object.values(groupedMessages);

  //   const subSections = authorData.map((authorMessages) => ({
  //     subTitle:
  //       authorMessages[0].author.first_name +
  //       " " +
  //       authorMessages[0].author.last_name,
  //     data: authorMessages,
  //   }));
  //   return {
  //     title,
  //     data: subSections,
  //   };
  // });
  const sortedMessages = sortMessagesByTimestamp(messages);

  const groupedMessagesByDate = groupBy(sortedMessages, (message) => {
    if (!isLoading) {
      const date = new Date(message.timestamp);
      return date.toDateString();
    }
  });

  const sections = Object.entries(groupedMessagesByDate).map(
    ([title, data]) => {
      const subSections = [];
      let currentAuthor = null;
      let currentSection = null;

      data.forEach((message) => {
        if (!currentAuthor || currentAuthor !== message.author.user_id) {
          if (currentSection) {
            subSections.push({
              subTitle:
                currentSection[0].author.first_name +
                " " +
                currentSection[0].author.last_name,
              data: currentSection,
            });
          }
          currentAuthor = message.author.user_id;
          currentSection = [message];
        } else {
          currentSection.push(message);
        }
      });

      if (currentSection) {
        subSections.push({
          subTitle:
            currentSection[0].author.first_name +
            " " +
            currentSection[0].author.last_name,
          data: currentSection,
        });
      }

      return {
        title,
        data: subSections,
      };
    }
  );

  // console.log(sections);
  const renderItem = ({ item, index }) => {
    // console.log("item: ");
    // console.log(item);
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
            setIsAnyModalOpen={setIsAnyModalOpen}
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

  // const handleScroll = (event) => {
  //   const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
  //   setScrollPosition(contentOffset.y);
  //   setDistanceFromBottom(
  //     contentSize.height - layoutMeasurement.height - contentOffset.y
  //   );
  // };

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    setScrollPosition(contentOffset.y);
    const currentDistanceFromBottom =
      contentSize.height - layoutMeasurement.height - contentOffset.y;
    setDistanceFromBottom(currentDistanceFromBottom);

    if (currentDistanceFromBottom < 50 && showNewMessageNotification) {
      console.log("show  notification notification");
      setShowNewMessageNotification(false);
    }
  };
  const handleNewMessage = () => {
    if (distanceFromBottom > 50) {
      setShowNewMessageNotification(true);
    }
  };

  const NewMessageNotification = () => (
    <TouchableOpacity
      onPress={() => scrollViewRef.current.scrollToEnd({ animated: true })}
      style={styles.newMessageNotification}
    >
      <Text style={styles.newMessageNotificationText}>
        New message received...
      </Text>
    </TouchableOpacity>
  );
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
          <Modal visible={chatDetails} transparent>
            <View style={styles.overlay}>
              <ChatDetailsModal
                item={details}
                id={id}
                closeDetails={closeModal}
              />
            </View>
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
            </View>
          </Modal>
          <Modal visible={showAddUser} transparent={true}>
            <View style={styles.overlay}>
              <AddUsers chatId={id} close={closeAddUser} />
            </View>
          </Modal>
          <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            onContentSizeChange={() => {
              // Scroll to the bottom only if the user is already near the bottom
              if (distanceFromBottom < 50) {
                scrollViewRef.current.scrollToEnd({ animated: true });
              }
            }}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            ref={scrollViewRef}
          >
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
          </KeyboardAwareScrollView>
          {showNewMessageNotification && <NewMessageNotification />}
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
  newMessageNotification: {
    position: "absolute", // Add this line to position the notification
    backgroundColor: "rgba(52, 152, 219, 0.9)", // Change the background color to be more visible
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    bottom: 70, // Add this line to position the notification above the input field
    zIndex: 100,
    elevation: 5,
  },
  newMessageNotificationText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
  },
});
