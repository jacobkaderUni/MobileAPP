import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '@env';

const getChatInfo = async (chat_id) => {
  return axios({
    method: 'GET',
    url: `${BASE_URL}chat/${chat_id}`,
    headers: {
      'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
    },
  })
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};

export default getChatInfo;
