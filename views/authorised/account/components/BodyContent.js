import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function BodyContent({ userDetails, setShowModal, onSubmitLogout }) {
  return (
    <View style={styles.bodyContent}>
      <Text style={styles.name}>
        {userDetails.first_name} {userDetails.last_name}
      </Text>
      <Text style={styles.name}>{userDetails.email}</Text>

      <TouchableOpacity style={styles.buttonContainer} onPress={() => setShowModal(true)}>
        <Text>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonContainer} onPress={() => onSubmitLogout()}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 30,
  },
  name: {
    fontSize: 28,
    color: '#696969',
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: '#00BFFF',
  },
});
