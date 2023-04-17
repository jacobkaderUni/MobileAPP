import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Background from './components/Background';
import Btn from './components/Btn';
import { darkGreen, green } from './components/Constants';

const Home = (props) => {
  return (
    <Background>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          alignContent: 'center',
          marginHorizontal: 46,
          marginVertical: 200,
        }}
      >
        <Text style={{ color: 'white', fontSize: 64 }}>Let's start</Text>
        <Text style={{ color: 'white', fontSize: 64, marginBottom: 40 }}>Chatting</Text>
        <Btn
          bgColor={green}
          textColor="white"
          btnLabel="Login"
          Press={() => props.navigation.navigate('login')}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 5,
            paddingBottom: 5,
          }}
        >
          <View>
            <Text style={{ color: 'white', marginHorizontal: 0 }}>or</Text>
          </View>
        </View>
        <Btn
          bgColor="white"
          textColor={darkGreen}
          btnLabel="Signup"
          Press={() => props.navigation.navigate('register')}
        />
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 0,
  },
  Btn: {
    backgroundColor: green,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    paddingVertical: 5,
    alignSelf: 'center', // add this line
    margin: 'auto',
  },
});

export default Home;
