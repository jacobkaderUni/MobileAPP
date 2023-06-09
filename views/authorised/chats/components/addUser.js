import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  SectionList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import addContact from "../../../../services/api/contactManagment/addContact";
import { useMemo } from "react";
import { useCallback } from "react";
import Loading from "../../../Loading";
import ContactItem from "../../users/components/ContactItem";
import SectionHeader from "../../users/components/SectionHeader";
import getContacts from "../../../../services/api/contactManagment/getContacts";
import addUserToChat from "../../../../services/api/chatManagment/addUserToChat";
import { useToast } from "react-native-toast-notifications";

export default function AddUsers({ chatId, close }) {
  const [isLoading, setIsLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [query, setQuery] = useState("");
  const [timerId, setTimerId] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const toast = useToast();
  // Reset state when component is mounted
  useEffect(() => {
    setQuery("");
    setTimerId(null);
    setIsFocused(false);
  }, []);

  useEffect(() => {
    if (isLoading) {
      fetchContacts();
      console.log(chatId.chatId);
    }
  }, [isLoading, query]);

  const handleclose = () => {
    console.log("close");
    close();
  };
  const fetchContacts = useCallback(async () => {
    try {
      const response = await getContacts();
      console.log(response);
      setContacts(response.data);
      setIsLoading(false);
    } catch (error) {
      if (error.response.status === 401) {
        toast.show("Unauthorised", {
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
  }, []);

  const handleAddContact = useCallback(
    async (id) => {
      try {
        const response = await addUserToChat(chatId, id);
        if (response.status === 200) {
          toast.show("Contact Added", {
            type: "success",
            placement: "top",
            duration: 1000,
            animationType: "slide-in",
          });
          fetchContacts("");
        }
      } catch (error) {
        if (error.response.status === 400) {
          //when user is removed from a chat they need to be readded to the contacrts list in order to add back into the chat 
          toast.show("User has already been added", {
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
        } else if (error.response.status === 404) {
          toast.show("Contact not found", {
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
    },
    [fetchContacts]
  );

  const groupContactsByLastInitial = (contacts) => {
    return contacts.reduce((groups, contact) => {
      const { last_name } = contact;
      const groupLetter = last_name[0].toUpperCase();
      if (!groups[groupLetter]) {
        groups[groupLetter] = [];
      }
      groups[groupLetter].push(contact);
      return groups;
    }, {});
  };

  const groupedContacts = groupContactsByLastInitial(contacts);

  const sections = Object.keys(groupedContacts)
    .sort()
    .map((key) => {
      return {
        title: key,
        data: groupedContacts[key],
      };
    });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handleclose()}>
        <Ionicons name="close" size={24} color="black" />
      </TouchableOpacity>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <ScrollView>
            <SectionList
              sections={sections}
              renderItem={({ item }) => (
                <ContactItem
                  contact={item}
                  addContact={handleAddContact}
                  type={"chat"}
                />
              )}
              renderSectionHeader={({ section: { title } }) => (
                <SectionHeader title={title} />
              )}
              keyExtractor={(item) => item.user_id.toString()}
              ItemSeparatorComponent={() => (
                <View style={styles.itemSeparator} />
              )}
            />
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "70%",
    height: "70%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
  },
});

// const handleFocus = () => setIsFocused(true);
// const handleBlur = () => setIsFocused(false);
// const sortedContacts = useMemo(() => {
//   return contacts.sort((a, b) => {
//     if (a.given_name && b.given_name) {
//       return a.given_name.localeCompare(b.given_name);
//     }
//     return 0;
//   });
// }, [contacts]);

// const groupedContacts = useMemo(() => {
//   return sortedContacts.reduce((acc, curr) => {
//     const firstLetter = curr.given_name.charAt(0).toUpperCase();
//     if (!acc[firstLetter]) {
//       acc[firstLetter] = { title: firstLetter, data: [curr] };
//     } else {
//       acc[firstLetter].data.push(curr);
//     }
//     return acc;
//   }, {});
// }, [sortedContacts]);

// const sections = useMemo(() => Object.values(contacts), [contacts]);
