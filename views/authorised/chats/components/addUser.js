import React, { useState, useEffect } from "react";
import { StyleSheet, View, SectionList, ScrollView } from "react-native";
import addContact from "../../../../services/api/contactManagment/addContact";
import { useMemo } from "react";
import { useCallback } from "react";
import Loading from "../../../Loading";
import ContactItem from "../../users/components/ContactItem";
import SectionHeader from "../../users/components/SectionHeader";
import getContacts from "/Users/jacobkader/Documents/GitHub/MobileAPP/services/api/contactManagment/getContacts.js";

export default function AddUsers() {
  const [isLoading, setIsLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [query, setQuery] = useState("");
  const [timerId, setTimerId] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  // Reset state when component is mounted
  useEffect(() => {
    setQuery("");
    setTimerId(null);
    setIsFocused(false);
  }, []);

  useEffect(() => {
    if (isLoading) {
      fetchContacts();
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

  const fetchContacts = useCallback(async () => {
    try {
      const response = await getContacts();
      console.log(response);
      setContacts(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleAddContact = useCallback(
    async (id) => {
      const response = await addContact(id);
      console.log(response);
      if (response) {
        fetchContacts("");
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
