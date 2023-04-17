import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '@env';

const getUserInfo = async (userId) => {
  return axios({
    method: 'GET',
    url: `${BASE_URL}user/${userId}`,
    headers: {
      'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
    },
  })
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};

export default getUserInfo;
