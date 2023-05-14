import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  SectionList,
  ScrollView,
  Text,
  FlatList,
} from "react-native";
import SearchBox from "../users/components/SearchBox";
import SearchUsers from "../../../services/api/userManagment/SearchUsers";
import { useMemo } from "react";
import { useCallback } from "react";
import Loading from "../../Loading";
import Contact from "../contacts/components/Contact";
import SectionHeader from "../users/components/SectionHeader";
import blockContact from "../../../services/api/contactManagment/blockContact";
import deleteContact from "../../../services/api/contactManagment/deleteContact";
import { useToast } from "react-native-toast-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SearchContacts from "../../../services/api/userManagment/SearchContacts";
import { useIsFocused } from "@react-navigation/native";
import registerUser from "../../../services/api/userManagment/registerUser";

export default function NewContacts() {
  const [isLoading, setIsLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [query, setQuery] = useState("");
  const [timerId, setTimerId] = useState(null);
  const isFocused2 = useIsFocused();
  const [F, setF] = useState(true);
  const [refresh, setRefresh] = useState(0);

  const PAGE_SIZE = 20; // change this to whatever your API uses
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const toast = useToast();
  const refreshContacts = () => {
    setQuery("");
    setTimerId(null);
  };

  useEffect(() => {
    if (isFocused2 && F) {
      fetchContacts(query, 0);
      setRefresh(0);
      setHasMore(true);
      refreshContacts();
      setF(false);
    }
  }, [isLoading, query, isFocused2, F]);

  useEffect(() => {
    if (!isFocused2) {
      setF(true);
    }
  }, [isFocused2]);

  const fetchContacts = useCallback(async (text, offset) => {
    try {
      const user = await AsyncStorage.getItem("whatsthat_user_id");
      let myuser = parseInt(user);
      const response = await SearchContacts(text, offset);
      const filteredContacts = response.data.filter(
        (contact) => contact.user_id !== myuser
      );

      // Check if there are more contacts to load
      if (filteredContacts.length < PAGE_SIZE) {
        setHasMore(false);
        setRefresh((prevRefresh) => prevRefresh + 1); // Force a re-render
      }

      // Append the new contacts to the existing ones
      if (offset === 0) {
        setContacts(filteredContacts);
      } else {
        setContacts((prevContacts) => [...prevContacts, ...filteredContacts]);
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
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

  const handleDelete = async (id) => {
    try {
      const response = await deleteContact(id);
      console.log(response);
      if (response.status === 200) {
        toast.show("Deleted succesfully", {
          type: "success",
          placement: "top",
          duration: 1000,
          animationType: "slide-in",
        });
        fetchContacts(query, 0);
      }
    } catch (error) {
      if (error.response.status === 400) {
        toast.show("You can't remove yourself as a contact", {
          type: "danger",
          placement: "top",
          duration: 1000,
        });
      } else if (error.response.status === 401) {
        toast.show("Unauthorised", {
          type: "danger",
          placement: "top",
          duration: 1000,
        });
      } else if (error.response.status === 404) {
        toast.show("Not found", {
          type: "danger",
          placement: "top",
          duration: 1000,
        });
      } else if (error.response.status === 500) {
        toast.show("Bad Server", {
          type: "danger",
          placement: "top",
          duration: 1000,
        });
      }
    }
  };

  const handleBlock = async (id) => {
    try {
      const response = await blockContact(id);
      console.log(response);
      if (response.status === 200) {
        toast.show("Blocked succesfully", {
          type: "success",
          placement: "top",
          duration: 1000,
          animationType: "slide-in",
        });
        fetchContacts(query, 0);
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        toast.show("You can't block yourself as a contact", {
          type: "danger",
          placement: "top",
          duration: 1000,
        });
      } else if (error.response.status === 401) {
        toast.show("Unauthorised", {
          type: "danger",
          placement: "top",
          duration: 1000,
        });
      } else if (error.response.status === 404) {
        toast.show("Not found", {
          type: "danger",
          placement: "top",
          duration: 1000,
        });
      } else if (error.response.status === 500) {
        toast.show("Bad Server", {
          type: "danger",
          placement: "top",
          duration: 1000,
        });
      }
    }
  };

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
      <SearchBox
        value={query}
        onChangeText={handleSearch}
        // onFocus={handleFocus}
        // onBlur={handleBlur}
        isFocused={isFocused2}
      />
      {!isFocused2 ? (
        <Loading />
      ) : (
        <>
          {contacts.length > 0 ? (
            <FlatList
              data={contacts}
              renderItem={({ item }) => (
                <Contact
                  contact={item}
                  onDelete={() => handleDelete(item.user_id)}
                  onBlock={() => handleBlock(item.user_id)}
                  type={true}
                />
              )}
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
