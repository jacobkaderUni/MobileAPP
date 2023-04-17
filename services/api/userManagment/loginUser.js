import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env';

const loginUser = async (data) => {
  return axios({
    method: 'POST',
    url: `${BASE_URL}login`,
    data,
  })
    .then(async (response) => {
      await AsyncStorage.setItem('whatsthat_user_id', response.data.id);
      await AsyncStorage.setItem('whatsthat_session_token', response.data.token);
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export default loginUser;
