import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, SectionList } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import unblockContact from "../../../services/api/contactManagment/unblockContact";
import getContacts from "../../../services/api/contactManagment/getContacts";
import deleteContact from "../../../services/api/contactManagment/deleteContact";
import getBlockedContacts from "../../../services/api/contactManagment/getBlockedContacts";
import blockContact from "../../../services/api/contactManagment/blockContact";

import FilterButton from "./components/Button";
import Contact from "./components/Contact";
import Loading from "../../Loading";

export default function List() {
  const isFocused = useIsFocused();
  const [selectedValue, setSelectedValue] = useState("contacts");
  const [Contacts, setContacts] = useState([]);
  const [noContacts, setNoContacts] = useState(false);

  const fetchData = async (filter) => {
    try {
      let resContacts;
      switch (filter) {
        case "contacts":
          setSelectedValue("contacts");
          resContacts = await getContacts();
          break;
        case "blocked":
          setSelectedValue("blocked");
          resContacts = await getBlockedContacts();
          break;
        default:
          setSelectedValue("contacts");
          resContacts = await getContacts();
      }
      setContacts(resContacts.data);
      if (resContacts.data.length === 0) {
        setNoContacts(true);
      } else {
        setNoContacts(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchData("contacts");
    }
  }, [isFocused]);

  const handleDelete = async (id) => {
    const response = await deleteContact(id);
    if (response) {
      fetchData(selectedValue);
    }
  };

  const handleUnBlock = async (id) => {
    const response = await unblockContact(id);
    if (response) {
      fetchData(selectedValue);
    }
  };

  const handleBlock = async (id) => {
    const response = await blockContact(id);
    if (response) {
      fetchData(selectedValue);
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

  const renderItemContacts = ({ item }) => (
    <Contact
      contact={item}
      onDelete={() => handleDelete(item.user_id)}
      onBlock={() => handleBlock(item.user_id)}
    />
  );

  const renderItemBlockedContacts = ({ item }) => (
    <Contact
      contact={item}
      onDelete={() => handleDelete(item.user_id)}
      onUnBlock={() => handleUnBlock(item.user_id)}
    />
  );

  const handleFilterChange = (filter) => {
    setSelectedValue(filter);
    fetchData(filter);
  };
  return (
    <View style={styles.container}>
      <View>
        {/* <Picker onValueChange={handleFilterChange}>
          <Picker.Item label="Contacts" value="contacts" />
          <Picker.Item label="Blocked" value="blocked" />
        </Picker> */}
        <FilterButton
          options={[
            { label: "Contacts", value: "contacts" },
            { label: "Blocked", value: "blocked" },
          ]}
          defaultOption={{
            label: "Contacts",
            value: "contacts",
          }}
          onSelect={(selectedOption) =>
            handleFilterChange(selectedOption.value)
          }
        />
      </View>
      {!isFocused ? (
        <>
          <Loading />
        </>
      ) : (
        <>
          {noContacts ? (
            <>
              <Text>no contacts</Text>
            </>
          ) : (
            <>
              <SectionList
                sections={sections}
                renderItem={
                  selectedValue === "contacts"
                    ? renderItemContacts
                    : renderItemBlockedContacts
                }
                renderSectionHeader={({ section: { title } }) => (
                  <Text style={styles.sectionHeader}>{title}</Text>
                )}
                keyExtractor={(item) => item.user_id.toString()}
              />
            </>
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
    paddingHorizontal: 16,
    paddingTop: 40,
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
    justifyContent: "center", // Add this line
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

// export default function List() {
//   const isFocused = useIsFocused();
//   const [Contacts, setContacts] = useState([]);
//   const [filterOption, setFilterOption] = useState('contacts');

//   useEffect(() => {
//     if (isFocused) {
//       fetchContacts();
//     }
//   }, [isFocused]);

//   const fetchContacts = async () => {
//     try {
//       let resContacts;
//       switch (filterOption) {
//         case 'contacts':
//           resContacts = await getContacts();
//           break;
//         case 'blocked':
//           resContacts = await getBlockedContacts();
//           break;
//         case 'allUsers':
//           resContacts = await SearchUsers();
//           break;
//         default:
//           resContacts = await getContacts();
//           break;
//       }
//       setContacts(resContacts.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleDelete = async (id) => {
//     const response = await deleteContact(id);
//     if (response) {
//       fetchContacts();
//     }
//   };

//   const handleUnBlock = async (id) => {
//     const response = await unblockContact(id);
//     if (response) {
//       fetchContacts();
//     }
//   };

//   const sortedContacts = Contacts.sort((a, b) => {
//     if (a.first_name && b.first_name) {
//       return a.first_name.localeCompare(b.first_name);
//     }
//     return 0;
//   });

//   const groupedContacts = sortedContacts.reduce((acc, curr) => {
//     const firstLetter = curr.first_name.charAt(0).toUpperCase();
//     if (!acc[firstLetter]) {
//       acc[firstLetter] = { title: firstLetter, data: [curr] };
//     } else {
//       acc[firstLetter].data.push(curr);
//     }
//     return acc;
//   }, {});

//   const sections = Object.values(groupedContacts);

//   const renderItem = ({ item }) => (
//     <Contact
//       contact={item}
//       onDelete={() => handleDelete(item.user_id)}
//       onUnBlock={() => handleUnBlock(item.user_id)}
//     />
//   );

//   const handleFilterOptionChange = (value) => {
//     setFilterOption(value);
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.filterContainer}>
//         <Text style={styles.filterLabel}>Filter:</Text>
//         <Picker
//           selectedValue={filterOption}
//           onValueChange={handleFilterOptionChange}
//           style={styles.filterPicker}
//         >
//           <Picker.Item label="Contacts" value="contacts" />
//           <Picker.Item label="Blocked" value="blocked" />
//           <Picker.Item label="All Users" value="allUsers" />
//         </Picker>
//       </View>
//       {!isFocused ? (
//         <View>
//           <Text>Loading...</Text>
//         </View>
//       ) : (
//         <>
//           <SectionList
//             sections={sections}
//             renderItem={renderItem}
//             renderSectionHeader={({ section: { title } }) => (
//               <Text style={styles.sectionHeader}>{title}</Text>
//             )}
//             keyExtractor={(item) => item.user_id.toString()}
//           />
//         </>
//       )}
//     </View>
//   );
// }

// export default function Blocked() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [Contacts, setContacts] = useState([]);

//   useEffect(() => {
//     if (isLoading) {
//       fetchContacts();
//     }
//   }, [isLoading]);

//   const fetchContacts = async () => {
//     try {
//       const resContacts = await getContacts();
//       setContacts(resContacts.data);
//       setIsLoading(false);
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   const handleDelete = async (id) => {
//     const response = await deleteContact(id);
//     if (response) {
//       fetchContacts();
//       // setIsLoading(true)
//     }
//   };

//   const handleUnBlock = async (id) => {
//     const response = await unblockContact(id);
//     if (response) {
//       fetchContacts();
//     }
//   };

//   const sortedContacts = Contacts.sort((a, b) => {
//     if (a.first_name && b.first_name) {
//       return a.first_name.localeCompare(b.first_name);
//     }
//     return 0;
//   });

//   const groupedContacts = sortedContacts.reduce((acc, curr) => {
//     const firstLetter = curr.first_name.charAt(0).toUpperCase();
//     if (!acc[firstLetter]) {
//       acc[firstLetter] = { title: firstLetter, data: [curr] };
//     } else {
//       acc[firstLetter].data.push(curr);
//     }
//     return acc;
//   }, {});

//   const sections = Object.values(groupedContacts);

//   const renderItem = ({ item }) => (
//     <Contact
//       contact={item}
//       onDelete={() => handleDelete(item.user_id)}
//       onUnBlock={() => handleUnBlock(item.user_id)}
//     />
//   );
//   return (
//     <View style={styles.container}>
//       {isLoading ? (
//         <View>
//           <Text>Loading...</Text>
//         </View>
//       ) : (
//         <>
//           <SectionList
//             sections={sections}
//             renderItem={renderItem}
//             renderSectionHeader={({ section: { title } }) => (
//               <Text style={styles.sectionHeader}>{title}</Text>
//             )}
//             keyExtractor={(item) => item.user_id.toString()}
//           />
//         </>
//       )}
//     </View>
//   );
// }
// export default function List() {
//   const isFocused = useIsFocused();
//   const [Contacts, setContacts] = useState([]);

//   useEffect(() => {
//     if (isFocused) {
//       fetchContacts();
//     }
//   }, [isFocused]);

//   //third option of the filter drop down
//   const fetchContacts = async () => {
//     try {
//       const resContacts = await getContacts();
//       setContacts(resContacts.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   //second ootion of th efilter drop down
//   const fetchBlockedContacts = async () => {
//     try {
//       const resContacts = await getBlockedContacts();
//       setContacts(resContacts.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };
// //first option of the filter drop down
//   const fetchAllUsers = async () => {
//     try {
//       const resContacts = await SearchUsers();
//       setContacts(resContacts.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleDelete = async (id) => {
//     const response = await deleteContact(id);
//     if (response) {
//       fetchContacts();
//     }
//   };

//   const handleUnBlock = async (id) => {
//     const response = await unblockContact(id);
//     if (response) {
//       fetchContacts();
//     }
//   };

//   const sortedContacts = Contacts.sort((a, b) => {
//     if (a.first_name && b.first_name) {
//       return a.first_name.localeCompare(b.first_name);
//     }
//     return 0;
//   });

//   const groupedContacts = sortedContacts.reduce((acc, curr) => {
//     const firstLetter = curr.first_name.charAt(0).toUpperCase();
//     if (!acc[firstLetter]) {
//       acc[firstLetter] = { title: firstLetter, data: [curr] };
//     } else {
//       acc[firstLetter].data.push(curr);
//     }
//     return acc;
//   }, {});

//   const sections = Object.values(groupedContacts);

//   const renderItem = ({ item }) => (
//     <Contact
//       contact={item}
//       onDelete={() => handleDelete(item.user_id)}
//       onUnBlock={() => handleUnBlock(item.user_id)}
//     />
//   );
//   return (
//     <View style={styles.container}>
//       {!isFocused ? (
//         <View>
//           <Text>Loading...</Text>
//         </View>
//       ) : (
//         <>
//           <SectionList
//             sections={sections}
//             renderItem={renderItem}
//             renderSectionHeader={({ section: { title } }) => (
//               <Text style={styles.sectionHeader}>{title}</Text>
//             )}
//             keyExtractor={(item) => item.user_id.toString()}
//           />
//         </>
//       )}
//     </View>
//   );
// }
