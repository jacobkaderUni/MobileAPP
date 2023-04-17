import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '@env';

const unblockContact = async (userId) => {
  return axios({
    method: 'DELETE',
    url: `${BASE_URL}user/${userId}/block`,
    headers: {
      'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
    },
  })
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};

export default unblockContact;
