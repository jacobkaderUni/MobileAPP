import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native-web";
import getChatInfo from "../../../../services/api/chatManagment/getChatInfo";
import addUserToChat from "../../../../services/api/chatManagment/addUserToChat";
import updateChat from "../../../../services/api/chatManagment/updateChat";
import removeUserFromChat from "../../../../services/api/chatManagment/removeUserFromChat";
import Loading from "../../../Loading";
import DisplayImage from "../../account/cameraHandling.s/Display";

export default function ChatDetailsModal({ item, id, closeDetails }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chatName, setChatName] = useState({
    name: "",
  });
  const [userToAdd, setUserToAdd] = useState("");

  useEffect(() => {
    if (isLoading) {
      fetchChatInfo();
    }
  }, []);

  const fetchChatInfo = async () => {
    const response = await getChatInfo(id);
    if (response) {
      setUsers(response.data.members);
      setChatName({ name: response.data.name });
      setIsLoading(false);
    }
  };

  const handleAddUserToChat = async () => {
    const response = await addUserToChat(id, userToAdd);
    if (response) {
      fetchChatInfo();
      setUserToAdd("");
    }
  };

  const handleChangeChatName = async () => {
    const response = await updateChat(chatName, id);
    if (response) {
      fetchChatInfo();
    }
  };

  const renderItem = ({ item }) => {
    const handleRemoveUser = async () => {
      const response = await removeUserFromChat(id, item.user_id);
      if (response) {
        fetchChatInfo();
      }
    };

    return (
      <View style={styles.memberContainer}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <DisplayImage user_id={item.user_id} type={"2"} />
          <Text style={styles.memberName}>
            {item.first_name} {item.last_name}
          </Text>
          <TouchableOpacity style={styles.addButton} onPress={handleRemoveUser}>
            <Text style={styles.addButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => closeDetails()}
        style={styles.closeButton}
      >
        <Ionicons name="close" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Chat Details</Text>
      <Text style={styles.label}>Chat Name:</Text>
      <TextInput
        style={styles.input}
        value={chatName.name}
        onChangeText={(text) => setChatName({ name: text })}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleChangeChatName}>
        <Text style={styles.addButtonText}>Change</Text>
      </TouchableOpacity>
      <Text style={styles.label}>Members:</Text>
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={(item) => item.user_id}
        />
      )}
      {/*  <Text style={styles.label}>Add User:</Text>
    <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter User ID"
          value={userToAdd}
          onChangeText={(text) => setUserToAdd(text)}
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddUserToChat}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: "#fff",
  //   padding: 20,
  //   justifyContent: "center",
  // },
  container: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    height: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  chatName: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#4285F4",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#4285F4",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  membersTitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  memberName: {
    fontSize: 16,
    marginBottom: 5,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
