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

export default function Chats() {
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [createChatModel, setCreateChatModel] = useState(false);
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
    if (isFocused) {
      handleGetChats();
    }
  }, [isFocused]);

  const handleGetChats = async () => {
    const response = await getChats();
    console.log(response);
    if (response.status === 200) {
      setChats(response.data);
      setIsLoading(false);
      if (createChatModel) {
        setCreateChatModel(false);
      }
    } else {
      console.log("no chats ");
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
        <TouchableOpacity onPress={() => setCreateChatModel(false)}>
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
  const renderItem = ({ item }) => (
    <Chat chat={item} getChat={() => handleOpenChat(item.chat_id)} />
  );

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
