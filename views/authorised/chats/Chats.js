import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { Modal, TouchableOpacity } from 'react-native-web';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import getChats from '../../../services/api/chatManagment/getChats';
import Chat from './components/Chat';
import startChat from '../../../services/api/chatManagment/startChat';
import getChatInfo from '../../../services/api/chatManagment/getChatInfo';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import Loading from '../../Loading';
import { green } from '../../unauthorised/components/Constants';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Icon from 'react-native-feather1s';
export default function Chats() {
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [createChatModel, setCreateChatModel] = useState(false);
  const navigation = useNavigation();

  // React.useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerTitle: 'Chats',
  //     headerStyle: {
  //       // borderBottomLeftRadius: 20,
  //       // borderBottomRightRadius: 20,
  //     },

  //     headerRight: () => (
  //       <>
  //         <Ionicons name="options" style={styles.dummy} size={35} color="black" />
  //         <TouchableOpacity style={styles.addButton} onPress={() => setCreateChatModel(true)}>
  //           <AntDesign name="pluscircle" size={35} color="black" />
  //         </TouchableOpacity>
  //       </>
  //     ),
  //   });
  // }, [navigation]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Chats',
      headerTitleAlign: 'center', // set title alignment to center
      headerLeft: () => (
        // use headerLeft instead of headerRight for the left icon
        <Ionicons name="options" style={styles.dummy} size={32} color="black" />
      ),
      headerRight: () => (
        <TouchableOpacity style={styles.addButton} onPress={() => setCreateChatModel(true)}>
          {/* <AntDesign name="pluscircle" size={32} color="black" /> */}
          <FeatherIcon color="black" size={35} name={'plus-circle'} strokeWidth={3} />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: 'white',
      },
    });
  }, [navigation]);

  useEffect(() => {
    if (isFocused) {
      handleGetChats();
    }
  }, [isFocused]);

  const handleGetChats = async () => {
    const response = await getChats();
    if (response.status === 200) {
      setChats(response.data);
      setIsLoading(false);
      if (createChatModel) {
        setCreateChatModel(false);
      }
    }
  };

  const handleOpenChat = async (newid) => {
    const response = await getChatInfo(newid);
    if (response) {
      console.log(response);
      navigation.navigate('OpenedChat', { chat: response, id: newid });
    }
  };

  //////////
  const CreateChatScreen = () => {
    const [chatName, setChatName] = useState({
      name: '',
    });

    const handleCreateChat = () => {
      try {
        const response = startChat(chatName);
        const newChat = response.data;
        setIsLoading(true);
      } catch (error) {
        console.log(chatName.name);
        console.log(error);
      }
    };

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setCreateChatModel(false)}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Enter chat name"
          value={chatName.name}
          onChangeText={(text) => setChatName({ name: text })}
        />
        <Button title="Create Chat" onPress={handleCreateChat} />
      </View>
    );
  };
  const renderItem = ({ item }) => (
    <Chat chat={item} getChat={() => handleOpenChat(item.chat_id)} />
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <>
          <Loading />
        </>
      ) : (
        <>
          <FlatList
            data={chats}
            renderItem={renderItem}
            keyExtractor={(item) => item.chat_id.toString()}
          />
          <Modal visible={createChatModel} onPress={() => handleOpenChat(item.chat_id)}>
            <CreateChatScreen />
          </Modal>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    paddingHorizontal: 0,
    paddingTop: 0,
  },
  input: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  dummy: {
    marginLeft: 10,
  },
  addButton: {
    marginRight: 10,
  },
});
