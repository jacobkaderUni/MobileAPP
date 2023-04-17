import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env';

const startChat = async (data) => {
  return axios({
    method: 'POST',
    url: `${BASE_URL}chat/`,
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

export default startChat;
