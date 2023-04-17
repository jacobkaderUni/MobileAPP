import React from 'react';
import { Image, StyleSheet } from 'react-native-web';

export default function Avatar() {
  return (
    <Image
      alt=""
      source={require('/Users/jkader/Documents/GitHub/2023Project/AwesomeProject/assets/defaultUser.png')}
      style={styles.profileAvatar}
    />
  );
}

const styles = StyleSheet.create({
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 9999,
  },
});
