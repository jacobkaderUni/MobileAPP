import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useRef } from "react";
import DisplayImage from "../../account/cameraHandling.s/Display";
import ActionModal from "./modal";
export default function Contact({
  contact,
  onDelete,
  onBlock,
  onUnBlock,
  type,
}) {
  const contactsArray = ["Block", "Delete", "Cancel"];
  const blockedArray = ["unBlock", "Delete", "Cancel"];
  const actions = type ? contactsArray : blockedArray;
  let actionSheet = useRef();
  const [showModal, setShowModal] = useState(false);

  const showActionSheet = () => {
    setShowModal(true);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.cardImg, styles.cardAvatar]}>
        {/* <Text style={styles.cardAvatarText}>{contact.user_id}</Text> */}
        <DisplayImage user_id={contact.user_id} type={"2"} />
      </View>

      <View style={styles.cardBody}>
        {/* <Text style={styles.cardTitle}>

          {contact.first_name} {contact.last_name}
        </Text> */}
        <Text style={styles.cardTitle}>
          {!type
            ? `${contact.first_name || ""} ${contact.last_name || ""}`
            : `${contact.given_name || ""} ${contact.family_name || ""}`}
        </Text>
        <Text style={styles.cardPhone}>{contact.email}</Text>
      </View>
      <TouchableOpacity onPress={showActionSheet}>
        <SimpleLineIcons name="options-vertical" size={24} color="black" />
      </TouchableOpacity>
      <Modal visible={showModal} transparent={true}>
        <View style={styles.overlay}>
          {/* <DraftScreen /> */}
          <ActionModal
            type={type}
            onBlock={onBlock}
            onUnBlock={onUnBlock}
            onDelete={onDelete}
            onClose={() => setShowModal(false)}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    paddingHorizontal: 4,
    paddingVertical: 14,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#d6d6d6",
    height: 75,
  },
  cardImg: {
    width: 42,
    height: 42,
    borderRadius: 12,
  },
  cardAvatar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9ca1ac",
  },
  cardAvatarText: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#fff",
  },
  cardBody: {
    marginRight: "auto",
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  cardPhone: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "500",
    color: "#616d79",
    marginTop: 3,
  },
  blockBtn: {
    backgroundColor: "amber",
    borderRadius: 25,
    paddingVertical: 20,
    marginRight: 15,
    marginVertical: -20,
  },
  deleteBtn: {
    backgroundColor: "red",
    borderRadius: 25,
    paddingVertical: 20,
    marginRight: 15,
    marginVertical: -20,
  },
  unBlockBtn: {},
  addBtn: {},
});
