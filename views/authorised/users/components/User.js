import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import DisplayImage from "../../account/cameraHandling.s/Display";
import asyncStorage from "@react-native-async-storage/async-storage";
export default function User({ contact, addContact, type }) {
  const [showAdd, setShowAdd] = useState(true);
  const addContactHandler = () => {
    addContact();
  };
  const user = async () => {
    let id = await asyncStorage.getItem("whatsthat_user_id");
    if (parseInt(id) === contact.user_id) {
      setShowAdd(false);
    }
  };

  useEffect(() => {
    user();
  }, []);

  if (type) {
    return (
      <View style={styles.container}>
        <View style={[styles.cardImg, styles.cardAvatar]}>
          <DisplayImage user_id={contact.user_id} type={"2"} />
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>
            {(contact.first_name + " " + contact.last_name).length > 13
              ? (contact.first_name + " " + contact.last_name).slice(0, 13) +
                "..."
              : contact.first_name + " " + contact.last_name}
          </Text>
          <Text style={styles.cardPhone}>
            {contact.email.length > 13
              ? contact.email.slice(0, 13) + "..."
              : contact.email}
          </Text>
        </View>
        {showAdd && (
          <TouchableOpacity
            onPress={() => addContactHandler()}
            styles={styles.addBtn}
          >
            <AntDesign name="plus" size={34} color="green" />
          </TouchableOpacity>
        )}
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={[styles.cardImg, styles.cardAvatar]}>
          <DisplayImage user_id={contact.user_id} type={"2"} />
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>
            {contact.given_name} {contact.family_name}
          </Text>
          <Text style={styles.cardPhone}>
            <Text style={styles.cardPhone}>
              {contact.email.length > 15
                ? contact.email.slice(0, 15) + "..."
                : contact.email}
            </Text>
          </Text>
        </View>
        {showAdd && (
          <TouchableOpacity
            onPress={() => addContactHandler()}
            styles={styles.addBtn}
          >
            <AntDesign name="plus" size={34} color="grey" />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  addBtn: {
    marginRight: 6,
    opacity: 0.6,
  },
});
