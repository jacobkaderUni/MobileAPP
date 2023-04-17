import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env';

const deleteContact = async (userId) => {
  return axios({
    method: 'DELETE',
    url: `${BASE_URL}user/${userId}/contact`,
    headers: {
      'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
    },
  })
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};

export default deleteContact;
