import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env';

const updateChat = async (data, chat_id) => {
  return axios({
    method: 'PATCH',
    url: `${BASE_URL}chat/${chat_id}`,
    data,
    headers: {
      'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
    },
  })
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};

export default updateChat;
