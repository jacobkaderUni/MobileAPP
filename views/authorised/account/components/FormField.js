import React from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';

export default function FormField({
  label,
  value,
  onChangeText,
  onBlur,
  error,
  secureTextEntry = false,
}) {
  return (
    <View style={styles.formGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        secureTextEntry={secureTextEntry}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}
const styles = StyleSheet.create({
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
  },
});
