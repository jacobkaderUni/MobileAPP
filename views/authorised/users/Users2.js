import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, Text } from "react-native";
import addContact from "../../../services/api/contactManagment/addContact";
import SearchBox from "./components/SearchBox";
import SearchUsers from "../../../services/api/userManagment/SearchUsers";
import { useCallback } from "react";
import Loading from "../../Loading";
import ContactItem from "./components/ContactItem";
import { useToast } from "react-native-toast-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

export default function Users2() {
  const [isLoading, setIsLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [query, setQuery] = useState("");
  const [timerId, setTimerId] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const toast = useToast();
  const isScreenFocused = useIsFocused();

  useEffect(() => {
    if (isScreenFocused) {
      const resetState = () => {
        setQuery("");
        setContacts([]);
        setOffset(0);
        setHasMore(true);
        setIsLoading(true);
      };

      resetState();
      fetchContacts("", 0);
    }
  }, [isScreenFocused]);

  const fetchContacts = useCallback(async (text, offset) => {
    try {
      const user = await AsyncStorage.getItem("whatsthat_user_id");
      let myuser = parseInt(user);
      const response = await SearchUsers(text, offset);
      const filteredContacts = response.data.filter(
        (contact) => contact.user_id !== myuser
      );

      if (filteredContacts.length > 0) {
        setContacts((prevContacts) => [...prevContacts, ...filteredContacts]);
      } else {
        setHasMore(false);
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      // ... (handle error messages)
    }
  }, []);

  const handleSearch = useCallback(
    (text) => {
      setQuery(text);
      setContacts([]);
      setOffset(0);
      setHasMore(true);
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

          // fetchContacts(query);
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
    [fetchContacts, query]
  );

  const loadMoreData = () => {
    if (!hasMore) return;
    fetchContacts(query, contacts.length);
  };

  const renderFooter = () => {
    console.log("render footer");
    console.log(hasMore);
    console.log(contacts.length);
    if (!hasMore && contacts.length > 0) {
      return (
        <View style={styles.noMoreContactsContainer}>
          <Text style={styles.noMoreContactsText}>No more contacts</Text>
        </View>
      );
    } else {
      return null;
    }
  };

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
          {contacts.length > 0 ? (
            // <ScrollView>
            <FlatList
              data={contacts}
              renderItem={({ item }) => (
                <ContactItem contact={item} addContact={handleAddContact} />
              )}
              // keyExtractor={(item) => item.user_id.toString()}
              keyExtractor={(item, index) =>
                `${item.user_id.toString()}-${index}`
              }
              ItemSeparatorComponent={() => (
                <View style={styles.itemSeparator} />
              )}
              onEndReached={loadMoreData}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderFooter}
            />
          ) : (
            // </ScrollView>
            <View style={styles.noUsersContainer}>
              <Text style={styles.noUsersText}>No users found</Text>
            </View>
          )}
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
  noUsersContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noUsersText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "gray",
  },
  noMoreContactsContainer: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  noMoreContactsText: {
    fontSize: 16,
    color: "gray",
  },
});
