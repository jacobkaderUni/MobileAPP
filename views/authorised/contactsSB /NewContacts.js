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

  const PAGE_SIZE = 20; // change this to whatever your API uses
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const toast = useToast();
  useEffect(() => {
    setQuery("");
    setTimerId(null);
  }, []);

  useEffect(() => {
    if (isFocused2) {
      fetchContacts("", 0);
      console.log("isFocused2");
    }
  }, [isLoading, query, isFocused2]);

  const refreshContacts = () => {
    setOffset(0);
    setHasMore(true);
    fetchContacts(query, 0);
  };

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
    if (!hasMore || contacts.length === 0) {
      return null;
    }
    return (
      <View style={styles.noMoreContactsContainer}>
        <Text style={styles.noMoreContactsText}>No more contacts</Text>
      </View>
    );
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
          {!hasMore && contacts.length > 0 && (
            <View style={styles.noMoreContactsContainer}>
              <Text style={styles.noMoreContactsText}>No more contacts</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

{
  /* <SectionList
                sections={sections}
                renderItem={({ item }) => (
                  <Contact
                    contact={item}
                    onDelete={() => handleDelete(item.user_id)}
                    onBlock={() => handleBlock(item.user_id)}
                    type={true}
                  />
                )}
                renderSectionHeader={({ section: { title } }) => (
                  <SectionHeader title={title} />
                )}
                keyExtractor={(item) => item.user_id.toString()}
                ItemSeparatorComponent={() => (
                  <View style={styles.itemSeparator} />
                )}
              /> */
}

// Reset state when component is mounted
//   useEffect(() => {
//     setQuery("");
//     setTimerId(null);
//   }, []);

//   useEffect(() => {
//     if (isFocused2) {
//       fetchContacts("");
//     }
//   }, [isLoading, query, isFocused2]);

//   const sortedContacts = useMemo(() => {
//     return contacts.sort((a, b) => {
//       if (a.given_name && b.given_name) {
//         return a.given_name.localeCompare(b.given_name);
//       }
//       return 0;
//     });
//   }, [contacts]);

//   const groupedContacts = useMemo(() => {
//     return sortedContacts.reduce((acc, curr) => {
//       const firstLetter = curr.given_name.charAt(0).toUpperCase();
//       if (!acc[firstLetter]) {
//         acc[firstLetter] = { title: firstLetter, data: [curr] };
//       } else {
//         acc[firstLetter].data.push(curr);
//       }
//       return acc;
//     }, {});
//   }, [sortedContacts]);

//   const sections = useMemo(
//     () => Object.values(groupedContacts),
//     [groupedContacts]
//   );

//   const fetchContacts = useCallback(async (text) => {
//     try {
//       const user = await AsyncStorage.getItem("whatsthat_user_id");
//       let myuser = parseInt(user);
//       //   const response = await SearchContacts(text);
//       const response = await SearchContacts(text, 100, 0);
//       console.log(resonse);
//       const filteredContacts = response.data.filter(
//         (contact) => contact.user_id !== myuser
//       );
//       // setContacts(response.data);
//       if (page === 0) {
//         setContacts(filteredContacts); // for the initial load, replace the existing data
//       } else {
//         setContacts((prevContacts) => [...prevContacts, ...filteredContacts]); // append new data to old
//       }
//       setIsLoading(false);
//       setIsRefreshing(false);

//       //   setContacts(filteredContacts);
//       //   setIsLoading(false);
//     } catch (error) {
//       console.log(error);
//       if (error.response.status === 400) {
//         toast.show("Bad request, user might not exist", {
//           type: "warning",
//           placement: "top",
//           duration: 1000,
//           animationType: "slide-in",
//         });
//       } else if (error.response.status === 401) {
//         toast.show("Unauthorised", {
//           type: "danger",
//           placement: "top",
//           duration: 1000,
//           animationType: "slide-in",
//         });
//       } else if (error.response.status === 500) {
//         toast.show("Server Error", {
//           type: "danger",
//           placement: "top",
//           duration: 1000,
//           animationType: "slide-in",
//         });
//       }
//     }
//   }, []);

//   const handleSearch = useCallback(
//     (text) => {
//       setQuery(text);
//       if (timerId) {
//         clearTimeout(timerId);
//       }
//       const newTimerId = setTimeout(() => {
//         fetchContacts(text);
//       }, 1000);
//       setTimerId(newTimerId);
//     },
//     [timerId, fetchContacts]
//   );

//   const handleDelete = async (id) => {
//     try {
//       const response = await deleteContact(id);
//       console.log(response);
//       if (response.status === 200) {
//         toast.show("Deleted succesfully", {
//           type: "success",
//           placement: "top",
//           duration: 1000,
//           animationType: "slide-in",
//         });
//         fetchContacts("");
//       }
//     } catch (error) {
//       if (error.response.status === 400) {
//         toast.show("You can't remove yourself as a contact", {
//           type: "danger",
//           placement: "top",
//           duration: 1000,
//         });
//       } else if (error.response.status === 401) {
//         toast.show("Unauthorised", {
//           type: "danger",
//           placement: "top",
//           duration: 1000,
//         });
//       } else if (error.response.status === 404) {
//         toast.show("Not found", {
//           type: "danger",
//           placement: "top",
//           duration: 1000,
//         });
//       } else if (error.response.status === 500) {
//         toast.show("Bad Server", {
//           type: "danger",
//           placement: "top",
//           duration: 1000,
//         });
//       }
//     }
//   };

//   const handleBlock = async (id) => {
//     try {
//       const response = await blockContact(id);
//       console.log(response);
//       if (response.status === 200) {
//         toast.show("Blocked succesfully", {
//           type: "success",
//           placement: "top",
//           duration: 1000,
//           animationType: "slide-in",
//         });
//         fetchContacts("");
//       }
//     } catch (error) {
//       console.log(error);
//       if (error.response.status === 400) {
//         toast.show("You can't block yourself as a contact", {
//           type: "danger",
//           placement: "top",
//           duration: 1000,
//         });
//       } else if (error.response.status === 401) {
//         toast.show("Unauthorised", {
//           type: "danger",
//           placement: "top",
//           duration: 1000,
//         });
//       } else if (error.response.status === 404) {
//         toast.show("Not found", {
//           type: "danger",
//           placement: "top",
//           duration: 1000,
//         });
//       } else if (error.response.status === 500) {
//         toast.show("Bad Server", {
//           type: "danger",
//           placement: "top",
//           duration: 1000,
//         });
//       }
//     }
//   };

//   // ...

//   const loadMoreContacts = () => {
//     if (!isLoading) {
//       // add this condition to prevent loading more if we are already loading
//       setIsLoading(true);
//       setPage((prevPage) => prevPage + 1);
//       fetchContacts(query, page + 1);
//     }
//   };

//   const onRefresh = () => {
//     setIsRefreshing(true);
//     setPage(0); // reset the page count
//     fetchContacts(query);
//   };

//   // ...
//   return (
//     <View style={styles.container}>
//       <SearchBox
//         value={query}
//         onChangeText={handleSearch}
//         // onFocus={handleFocus}
//         // onBlur={handleBlur}
//         isFocused={isFocused2}
//       />
//       {!isFocused2 ? (
//         <Loading />
//       ) : (
//         <>
//           {sections.length > 0 ? (
//             <ScrollView>
//               <SectionList
//                 sections={sections}
//                 renderItem={({ item }) => (
//                   <Contact
//                     contact={item}
//                     onDelete={() => handleDelete(item.user_id)}
//                     onBlock={() => handleBlock(item.user_id)}
//                     type={true}
//                   />
//                 )}
//                 renderSectionHeader={({ section: { title } }) => (
//                   <SectionHeader title={title} />
//                 )}
//                 keyExtractor={(item) => item.user_id.toString()}
//                 ItemSeparatorComponent={() => (
//                   <View style={styles.itemSeparator} />
//                 )}
//                 onEndReached={loadMoreContacts} // load more when end of list is reached
//                 onEndReachedThreshold={0.5} // start loading more when user is half way from the end
//                 refreshing={isRefreshing}
//                 onRefresh={onRefresh}
//               />
//             </ScrollView>
//           ) : (
//             <View style={styles.noUsersContainer}>
//               <Text style={styles.noUsersText}>No users found</Text>
//             </View>
//           )}
//         </>
//       )}
//     </View>
//   );
// }

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
