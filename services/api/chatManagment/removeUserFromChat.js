import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env';

const removeUserFromChat = async (chat_id, user_id) => {
  return axios({
    method: 'DELETE',
    url: `${BASE_URL}chat/${chat_id}/user/${user_id}`,
    headers: {
      'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
    },
  })
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};

export default removeUserFromChat;
