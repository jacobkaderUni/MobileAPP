import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '@env';

const logoutUser = async () => {
  return axios({
    method: 'POST',
    url: `${BASE_URL}logout`,
    headers: {
      'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
    },
  })
    .then(async (response) => {
      await AsyncStorage.removeItem('whatsthat_user_id');
      await AsyncStorage.removeItem('whatsthat_session_token');
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export default logoutUser;
