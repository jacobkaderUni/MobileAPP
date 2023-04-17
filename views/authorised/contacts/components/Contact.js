import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Entypo, AntDesign } from '@expo/vector-icons';

export default function Contact({ contact, onDelete, onBlock, onUnBlock, onAdd }) {
  const deleteContactHandler = () => {
    onDelete();
  };

  const blockContactHandler = () => {
    onBlock();
  };

  const unBlockHandler = () => {
    onUnBlock();
  };

  const onAddHandler = () => {
    onAdd();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.cardImg, styles.cardAvatar]}>
        <Text style={styles.cardAvatarText}>{contact.user_id}</Text>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>
          {contact.first_name} {contact.last_name}
        </Text>
        <Text style={styles.cardPhone}>{contact.email}</Text>
      </View>

      {onBlock && (
        <TouchableOpacity onPress={() => blockContactHandler(true)}>
          {/* <Entypo name="block" size={24} color="black" /> */}
          <Text> block </Text>
        </TouchableOpacity>
      )}

      {onDelete && (
        <TouchableOpacity onPress={() => deleteContactHandler(true)}>
          {/* <AntDesign name="delete" size={24} color="red" /> */}
          <Text> delete </Text>
        </TouchableOpacity>
      )}

      {onUnBlock && (
        <TouchableOpacity onPress={() => unBlockHandler(true)}>
          {/* <Entypo name="circle-with-cross" size={24} color="black" /> */}
          <Text> unBlock </Text>
        </TouchableOpacity>
      )}
      {onAdd && (
        <TouchableOpacity onPress={() => onAddHandler()}>
          {/* <AntDesign name="plus" size={24} color="black" /> */}
          <Text> Add </Text>
        </TouchableOpacity>
      )}
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
