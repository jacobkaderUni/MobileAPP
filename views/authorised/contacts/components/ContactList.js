import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, SectionList } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import Contact from "./Contact";
import getContacts from "../../../../services/api/contactManagment/getContacts";
import getBlockedContacts from "../../../../services/api/contactManagment/getBlockedContacts";
import deleteContact from "../../../../services/api/contactManagment/deleteContact";
import blockContact from "../../../../services/api/contactManagment/blockContact";
import { useToast } from "react-native-toast-notifications";
import unblockContact from "../../../../services/api/contactManagment/unblockContact";
import Loading from "../../../Loading";
export default function ContactsList({ contactType }) {
  const isFocused = useIsFocused();
  const [Contacts, setContacts] = useState([]);
  const toast = useToast();
  useEffect(() => {
    if (isFocused) {
      fetchContacts();
    }
  }, [isFocused]);

  const fetchContacts = async () => {
    try {
      if (contactType === "blocked") {
        const resContacts = await getBlockedContacts();
        setContacts(resContacts.data);
      } else if (contactType === "contacts") {
        const resContacts = await getContacts();
        setContacts(resContacts.data);
      }
    } catch (error) {
      if (error.response.status === 401) {
        toast.show("Unauthorised", {
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

  const handleDelete = async (id) => {
    try {
      const response = await deleteContact(id);
      if (response.status === 200) {
        toast.show("Deleted succesfully", {
          type: "success",
          placement: "top",
          duration: 1000,
          animationType: "slide-in",
        });
        fetchContacts();
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
        fetchContacts();
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

  const handleUnBlock = async (id) => {
    try {
      const response = await unblockContact(id);
      if (response.status === 200) {
        toast.show("Unblocked succesfully", {
          type: "success",
          placement: "top",
          duration: 1000,
          animationType: "slide-in",
        });
        fetchContacts();
      }
    } catch (error) {
      if (error.response.status === 400) {
        toast.show("You can't unblock yourself as a contact", {
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

  const sortedContacts = Contacts.sort((a, b) => {
    if (a.first_name && b.first_name) {
      return a.first_name.localeCompare(b.first_name);
    }
    return 0;
  });

  const groupedContacts = sortedContacts.reduce((acc, curr) => {
    const firstLetter = curr.first_name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = { title: firstLetter, data: [curr] };
    } else {
      acc[firstLetter].data.push(curr);
    }
    return acc;
  }, {});

  const sections = Object.values(groupedContacts);

  const renderItem = ({ item }) => {
    if (contactType === "blocked") {
      return (
        <Contact
          contact={item}
          onDelete={() => handleDelete(item.user_id)}
          onUnBlock={() => handleUnBlock(item.user_id)}
        />
      );
    } else if (contactType === "contacts") {
      return (
        <Contact
          contact={item}
          onDelete={() => handleDelete(item.user_id)}
          onBlock={() => handleBlock(item.user_id)}
          type={true}
        />
      );
    }
  };
  return (
    <View style={styles.container}>
      {!isFocused ? (
        <>
          <Loading />
        </>
      ) : (
        <>
          {sections.length > 0 ? (
            <SectionList
              sections={sections}
              renderItem={renderItem}
              renderSectionHeader={({ section: { title } }) => (
                <Text style={styles.sectionHeader}>{title}</Text>
              )}
              keyExtractor={(item) => item.user_id.toString()}
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
    paddingTop: 5,
  },
  searchBox: {
    borderRadius: 25,
    borderColor: "#333",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#333",
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
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
});
