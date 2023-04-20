import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-web";
import { Ionicons } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";

const Drafts = ({ id, handleMessage, setShowDrafts }) => {
  const [drafts, setDrafts] = useState([]);
  const [draftsLoading, setDraftsLoading] = useState(true);

  useEffect(() => {
    if (draftsLoading) {
      getdrafts();
    }
  }, [draftsLoading]);

  const getdrafts = async () => {
    const drafts = await AsyncStorage.getItem(id);
    setDrafts(JSON.parse(drafts));
    setDraftsLoading(false);
  };

  const sendDraft = async (index) => {
    handleMessage({ message: drafts[index] }, id);
    const updatedDrafts = drafts.filter((_, i) => i !== index);
    setDrafts(updatedDrafts);
    await AsyncStorage.setItem(id, JSON.stringify(updatedDrafts));
  };

  const deleteDraft = async (index) => {
    const updatedDrafts = drafts.filter((_, i) => i !== index);
    setDrafts(updatedDrafts);
    await AsyncStorage.setItem(id, JSON.stringify(updatedDrafts));
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.item}>
      <Text>{item}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.sendButtonModal, { backgroundColor: "red" }]}
          onPress={() => deleteDraft(index)}
        >
          <Text style={styles.sendButtonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sendButtonModal}
          onPress={() => sendDraft(index)}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.modalContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Drafts</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setShowDrafts(false)}
        >
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={drafts}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default Drafts;

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
