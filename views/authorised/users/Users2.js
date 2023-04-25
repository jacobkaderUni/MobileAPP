import React, { useState, useEffect } from "react";
import { StyleSheet, View, SectionList, ScrollView } from "react-native";
import addContact from "../../../services/api/contactManagment/addContact";
import SearchBox from "./components/SearchBox";
import SearchUsers from "../../../services/api/userManagment/SearchUsers";
import { useMemo } from "react";
import { useCallback } from "react";
import Loading from "../../Loading";
import ContactItem from "./components/ContactItem";
import SectionHeader from "./components/SectionHeader";
import { useToast } from "react-native-toast-notifications";

export default function Users2() {
  const [isLoading, setIsLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [query, setQuery] = useState("");
  const [timerId, setTimerId] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const toast = useToast();
  // Reset state when component is mounted
  useEffect(() => {
    setQuery("");
    setTimerId(null);
    setIsFocused(false);
  }, []);

  useEffect(() => {
    if (isLoading) {
      fetchContacts("");
    }
  }, [isLoading, query]);

  const sortedContacts = useMemo(() => {
    return contacts.sort((a, b) => {
      if (a.given_name && b.given_name) {
        return a.given_name.localeCompare(b.given_name);
      }
      return 0;
    });
  }, [contacts]);

  const groupedContacts = useMemo(() => {
    return sortedContacts.reduce((acc, curr) => {
      const firstLetter = curr.given_name.charAt(0).toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = { title: firstLetter, data: [curr] };
      } else {
        acc[firstLetter].data.push(curr);
      }
      return acc;
    }, {});
  }, [sortedContacts]);

  const sections = useMemo(
    () => Object.values(groupedContacts),
    [groupedContacts]
  );

  const fetchContacts = useCallback(async (text) => {
    try {
      const response = await SearchUsers(text);
      console.log(response);
      setContacts(response.data);
      setIsLoading(false);
    } catch (error) {
      if (error.response.status === 400) {
        toast.show("Bad request, user might not exist", {
          type: "warning",
          placement: "top",
          duration: 1000,
          animationType: "slide-in",
        });
      } else if (error.response.status === 401) {
        toast.show("Unauthorised", {
          type: "danger",
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

  const handleSearch = useCallback(
    (text) => {
      setQuery(text);
      if (timerId) {
        clearTimeout(timerId);
      }
      const newTimerId = setTimeout(() => {
        fetchContacts(text);
      }, 1000);
      setTimerId(newTimerId);
    },
    [timerId, fetchContacts]
  );

  const handleAddContact = useCallback(
    async (id) => {
      try {
        const response = await addContact(id);
        console.log(response);
        if (response.status === 200) {
          if (response.data === "OK") {
            toast.show("Contact Added", {
              type: "success",
              placement: "top",
              duration: 1000,
              animationType: "slide-in",
            });
          } else {
            toast.show("Already a contact", {
              type: "normal",
              placement: "top",
              duration: 1000,
              animationType: "slide-in",
            });
          }

          fetchContacts("");
        }
      } catch (error) {
        if (error.response.status === 400) {
          toast.show("You cant add yourself", {
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

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <SearchBox
            value={query}
            onChangeText={handleSearch}
            onFocus={handleFocus}
            onBlur={handleBlur}
            isFocused={isFocused}
          />
          <ScrollView>
            <SectionList
              sections={sections}
              renderItem={({ item }) => (
                <ContactItem contact={item} addContact={handleAddContact} />
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
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 1,
    paddingTop: 8,
  },
});
