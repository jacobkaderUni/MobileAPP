import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env';

const deleteMessage = async (chat_id, message_id) => {
  return axios({
    method: 'DELETE',
    url: `${BASE_URL}chat/${chat_id}/message/${message_id}`,
    headers: {
      'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
    },
  })
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};

export default deleteMessage;
