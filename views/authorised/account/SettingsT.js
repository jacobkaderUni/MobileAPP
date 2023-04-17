import React, { useState } from 'react';
import { StyleSheet, View, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuth } from '../../../navigator/AuthContext';
import logoutUser from '../../../services/api/userManagment/logoutUser';
import Loading from '../../Loading';

import EditProfileModal from './components/EditProfileModal';
import Avatar from './components/Avatar';
import BodyContent from './components/BodyContent';
import Header from './components/Header';
import ProfileData from './components/ProfileData';

export default function Settings() {
  const [userId, setUserId] = useState();
  const [userDetails, setUserDetails] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [_, setUser] = useAuth();

  const onSubmitLogout = async () => {
    try {
      const response = await logoutUser();
      if (response.status === 200) {
        setUser();
        AsyncStorage.removeItem('whatsthat_user_id');
        AsyncStorage.removeItem('whatsthat_session_token');
      } else {
        console.log('didnt logout, try again');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      <ProfileData
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setUserId={setUserId}
        userDetails={userDetails}
        setUserDetails={setUserDetails}
      />
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Header />
          <Avatar />
          <View style={styles.body}>
            <BodyContent
              userDetails={userDetails}
              setShowModal={setShowModal}
              onSubmitLogout={onSubmitLogout}
            />
            <Modal visible={showModal}>
              <EditProfileModal close={closeModal} userId={userId} logout={onSubmitLogout} />
            </Modal>
          </View>
        </>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  body: {
    marginTop: 40,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
});
