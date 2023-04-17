import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function SearchBox({ value, onChangeText, onFocus, onBlur, isFocused }) {
  return (
    <TextInput
      placeholder="Search contacts"
      value={value}
      onChangeText={onChangeText}
      style={[
        styles.searchBox,
        {
          borderColor: isFocused ? '#333' : '#000',
          borderWidth: isFocused ? 2 : 1,
        },
      ]}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
}

const styles = StyleSheet.create({
  searchBox: {
    borderRadius: 25,
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#000',
  },
});
