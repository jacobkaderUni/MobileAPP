import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import ActionSheet from "react-native-actionsheet";
import { useRef } from "react";
import DisplayImage from "../../account/cameraHandling.s/Display";

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
  // const showActionSheet = () => {
  //   actionSheet.current.show();
  // };

  const showActionSheet = () => {
    Animated.timing(new Animated.Value(0), {
      toValue: 1,
      duration: 300,
      useNativeDriver: true, // add this line
    }).start(() => {
      actionSheet.current.show();
    });
  };
  const handleAction = (index) => {
    if (type) {
      if (index === 0) {
        onBlock();
      } else if (index === 1) {
        onDelete();
      }
    } else {
      if (index === 0) {
        onUnBlock();
      } else if (index === 1) {
        onDelete();
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.cardImg, styles.cardAvatar]}>
        {/* <Text style={styles.cardAvatarText}>{contact.user_id}</Text> */}
        <DisplayImage user_id={contact.user_id} type={"2"} />
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>
          {contact.first_name} {contact.last_name}
        </Text>
        <Text style={styles.cardPhone}>{contact.email}</Text>
      </View>
      <TouchableOpacity onPress={showActionSheet}>
        <SimpleLineIcons name="options-vertical" size={24} color="black" />
      </TouchableOpacity>
      <ActionSheet
        ref={actionSheet}
        title={"Which one do you like ?"}
        options={actions}
        cancelButtonIndex={2}
        onPress={(index) => {
          handleAction(index);
        }}
      />
    </View>
  );
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

// {onBlock && (
//   <TouchableOpacity
//     onPress={() => blockContactHandler(true)}
//     style={styles.blockBtn}
//   >
//     {/* <Entypo name="block" size={24} color="black" /> */}
//     <Text> block </Text>
//   </TouchableOpacity>
// )}

// {onDelete && (
//   <TouchableOpacity
//     onPress={() => deleteContactHandler(true)}
//     style={styles.deleteBtn}
//   >
//     {/* <AntDesign name="delete" size={24} color="red" /> */}
//     <Text> delete </Text>
//   </TouchableOpacity>
// )}

// {onUnBlock && (
//   <TouchableOpacity
//     onPress={() => unBlockHandler(true)}
//     styles={styles.unBlockBtn}
//   >
//     {/* <Entypo name="circle-with-cross" size={24} color="black" /> */}
//     <Text> unBlock </Text>
//   </TouchableOpacity>
// )}
// {onAdd && (
//   <TouchableOpacity onPress={() => onAddHandler()} styles={styles.addBtn}>
//     {/* <AntDesign name="plus" size={24} color="black" /> */}
//     <Text> Add </Text>
//   </TouchableOpacity>
// )}
