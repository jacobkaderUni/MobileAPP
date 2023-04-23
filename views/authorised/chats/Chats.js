import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
} from "react-native";
import { Modal, TouchableOpacity } from "react-native-web";
import { Ionicons } from "@expo/vector-icons";
import getChats from "../../../services/api/chatManagment/getChats";
import Chat from "./components/Chat";
import startChat from "../../../services/api/chatManagment/startChat";
import getChatInfo from "../../../services/api/chatManagment/getChatInfo";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import Loading from "../../Loading";
import FeatherIcon from "react-native-vector-icons/Feather";
import DraftSender from "./components/checkTimestamps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import sendMessage from "../../../services/api/chatManagment/sendMessage";
export default function Chats() {
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [createChatModel, setCreateChatModel] = useState(false);
  const [chatIds, setChatIds] = useState([]);
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Chats",
      headerTitleAlign: "center", // set title alignment to center
      headerLeft: () => (
        // use headerLeft instead of headerRight for the left icon
        <Ionicons name="options" style={styles.dummy} size={32} color="black" />
      ),
      headerRight: () => (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setCreateChatModel(true)}
        >
          {/* <AntDesign name="pluscircle" size={32} color="black" /> */}
          <FeatherIcon
            color="black"
            size={35}
            name={"plus-circle"}
            strokeWidth={3}
          />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: "white",
      },
    });
  }, [navigation]);

  useEffect(() => {
    if (isFocused || isLoading) {
      handleGetChats();
    }
    const intervalId = setInterval(() => {
      handleGetChats();
      console.log("checking drafts");
    }, 60000);

    return () => clearInterval(intervalId);
  }, [isFocused, isLoading]);

  const handleGetChats = async () => {
    try {
      const response = await getChats();
      if (response.status === 200) {
        setChats(response.data);
        const ids = response.data?.map((chat) => chat.chat_id);
        sendDueDrafts(ids);
        setIsLoading(false);
        if (createChatModel) {
          setCreateChatModel(false);
        }
      }
    } catch (error) {
      if (error.code === 999) {
        setChats([]);
        sendDueDrafts([]);
        setIsLoading(false);
      } else {
        console.log(error);
      }
    }
  };

  const handleOpenChat = async (newid) => {
    const response = await getChatInfo(newid);
    if (response) {
      console.log(response);
      navigation.navigate("OpenedChat", { chat: response, id: newid });
    }
  };
  //////////

  const sendDueDrafts = async (ids) => {
    for (const chatId of ids) {
      const draftsJson = await AsyncStorage.getItem(chatId);
      const drafts = JSON.parse(draftsJson) || [];
      drafts.forEach(async (draft) => {
        const timestamp = new Date(draft.timestamp);
        const now = new Date();

        if (draft.timestamp !== null) {
          if (now >= timestamp) {
            console.log("Draft sent:" + draft.message);
            sendMessage({ message: draft.message }, chatId);

            const newDrafts = drafts.filter(
              (d) => d.timestamp !== draft.timestamp
            );
            // console.log(newDrafts);
            await AsyncStorage.setItem(chatId, JSON.stringify(newDrafts));
          }
        }
      });
    }
  };

  // const sendDraft = async (index) => {
  //   handleMessage({ message: drafts[index].message }, id);
  //   const updatedDrafts = drafts.filter((_, i) => i !== index);
  //   setDrafts(updatedDrafts);
  //   await AsyncStorage.setItem(id, JSON.stringify(updatedDrafts));
  // };

  //////////
  const CreateChatScreen = () => {
    const [chatName, setChatName] = useState({
      name: "",
    });

    const handleCreateChat = () => {
      try {
        const response = startChat(chatName);
        console.log(response);
        const newChat = response.data;
        setIsLoading(true);
        handleGetChats();
      } catch (error) {
        console.log(chatName.name);
        console.log(error);
      }
    };

    return (
      <View style={styles.modalContainer}>
        <TouchableOpacity
          onPress={() => {
            setCreateChatModel(false);
            setIsLoading(true);
          }}
        >
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Enter chat name"
          value={chatName.name}
          onChangeText={(text) => setChatName({ name: text })}
        />
        <Button title="Create Chat" onPress={handleCreateChat} />
      </View>
    );
  };
  const renderItem = ({ item }) => {
    return <Chat chat={item} getChat={() => handleOpenChat(item.chat_id)} />;
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <>
          <Loading />
        </>
      ) : (
        <>
          <FlatList
            data={chats}
            renderItem={renderItem}
            keyExtractor={(item) => item.chat_id.toString()}
          />
        </>
      )}
      <Modal
        transparent={true}
        animationIn="fadeIn"
        animationOut="fadeOut"
        visible={createChatModel}
        onPress={() => handleOpenChat(item.chat_id)}
      >
        <DraftSender chatIds={chatIds} />
        <View style={styles.overlay}>
          <CreateChatScreen />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  overlay: { height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)" },
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
  dummy: {
    marginLeft: 10,
  },
  addButton: {
    marginRight: 10,
  },
});
