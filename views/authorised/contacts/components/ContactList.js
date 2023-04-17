import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SectionList } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Contact from './Contact';
import getContacts from '../../../../services/api/contactManagment/getContacts';
import getBlockedContacts from '../../../../services/api/contactManagment/getBlockedContacts';
import deleteContact from '../../../../services/api/contactManagment/deleteContact';
import blockContact from '../../../../services/api/contactManagment/blockContact';

import unblockContact from '../../../../services/api/contactManagment/unblockContact';
import Loading from '../../../Loading';
export default function ContactsList({ contactType }) {
  const isFocused = useIsFocused();
  const [Contacts, setContacts] = useState([]);

  useEffect(() => {
    if (isFocused) {
      fetchContacts();
    }
  }, [isFocused]);

  const fetchContacts = async () => {
    try {
      if (contactType === 'blocked') {
        const resContacts = await getBlockedContacts();
        setContacts(resContacts.data);
      } else if (contactType === 'contacts') {
        const resContacts = await getContacts();
        setContacts(resContacts.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    const response = await deleteContact(id);
    if (response) {
      fetchContacts();
    }
  };

  const handleBlock = async (id) => {
    const response = await blockContact(id);
    if (response) {
      fetchContacts();
    }
  };

  const handleUnBlock = async (id) => {
    const response = await unblockContact(id);
    if (response) {
      fetchContacts();
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
    if (contactType === 'blocked') {
      return (
        <Contact
          contact={item}
          onDelete={() => handleDelete(item.user_id)}
          onUnBlock={() => handleUnBlock(item.user_id)}
        />
      );
    } else if (contactType === 'contacts') {
      return (
        <Contact
          contact={item}
          onDelete={() => handleDelete(item.user_id)}
          onBlock={() => handleBlock(item.user_id)}
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
          <SectionList
            sections={sections}
            renderItem={renderItem}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.sectionHeader}>{title}</Text>
            )}
            keyExtractor={(item) => item.user_id.toString()}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  searchBox: {
    borderRadius: 25,
    borderColor: '#333',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomColor: '#ccc',
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
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#333',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
