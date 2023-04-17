import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env';

const updateUser = async (data, userId) => {
  return axios({
    method: 'PATCH',
    url: `${BASE_URL}user/${userId}`,
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

export default updateUser;
