import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export default function User({ contact, addContact }) {
  const addContactHandler = () => {
    addContact();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.cardImg, styles.cardAvatar]}>
        <Text style={styles.cardAvatarText}>{contact.user_id}</Text>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>
          {contact.given_name} {contact.family_name}
        </Text>
        <Text style={styles.cardPhone}>{contact.email}</Text>
      </View>

      <TouchableOpacity onPress={() => addContactHandler()}>
        <AntDesign name="plus" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderColor: '#d6d6d6',
    height: 75,
  },
  cardImg: {
    width: 42,
    height: 42,
    borderRadius: 12,
  },
  cardAvatar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9ca1ac',
  },
  cardAvatarText: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardBody: {
    marginRight: 'auto',
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  cardPhone: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
    color: '#616d79',
    marginTop: 3,
  },
});
