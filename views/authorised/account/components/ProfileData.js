import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getUserInfo from '../../../../services/api/userManagment/getUserInfo';

export default function ProfileData({
  isLoading,
  setIsLoading,
  setUserId,
  userDetails,
  setUserDetails,
}) {
  useEffect(() => {
    if (isLoading) {
      fetchProfileData();
    }
  }, []);

  const fetchProfileData = async () => {
    const user_id = await AsyncStorage.getItem('whatsthat_user_id');
    const response = await getUserInfo(user_id);
    console.log(response);
    if (user_id && response) {
      setUserId(user_id);
      setUserDetails({
        ...userDetails,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        email: response.data.email,
      });
      setIsLoading(false);
    }
  };

  return null;
}