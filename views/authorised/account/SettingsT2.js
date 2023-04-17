import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Modal,
  Text,
  TouchableOpacity,
  Image,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FeatherIcon from 'react-native-vector-icons/Feather';

import EditProfileModal from './components/EditProfileModal';
import Avatar from './components/Avatar';
import BodyContent from './components/BodyContent';
import Header from './components/Header';
import ProfileData from './components/ProfileData';
import { useAuth } from '../../../navigator/AuthContext';
import logoutUser from '../../../services/api/userManagment/logoutUser';
import Loading from '../../Loading';
const SECTIONS = [
  {
    header: 'Preferences',
    icon: 'settings',
    items: [{ icon: 'globe', color: '#fe9400', label: 'Language', type: 'link' }],
  },
  {
    header: 'Help',
    icon: 'help-circle',
    items: [{ icon: 'user', color: '#8e8d91', label: 'Logout', type: 'link' }],
  },
];

export default function Settings2() {
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
    <SafeAreaView style={{ flex: 1 }}>
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
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.profile}>
            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}
            >
              <View style={styles.profileAvatarWrapper}>
                <Avatar />

                <TouchableOpacity
                  onPress={() => {
                    // handle onPress
                  }}
                >
                  <View style={styles.profileAction}>
                    <FeatherIcon color="#fff" name="edit-3" size={15} />
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            <View style={styles.profileBody}>
              <Text style={styles.profileName}>
                {userDetails.first_name} {userDetails.last_name}
              </Text>

              <Text style={styles.profileAddress}>{userDetails.email}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Settings</Text>
            <TouchableOpacity
              onPress={() => {
                setShowModal(true);
              }}
            >
              <View style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: '#8e8d91' }]}>
                  <FeatherIcon color="#fff" size={18} name={'user'} />
                </View>
                <Text style={styles.rowLabel}>Edit profile details</Text>
                <View style={styles.rowSpacer} />
                <FeatherIcon color="#0c0c0c" name="chevron-right" size={22} />
              </View>
            </TouchableOpacity>
            <Text style={styles.sectionHeader}>preference</Text>

            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}
            >
              <View style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: '#fe9400' }]}>
                  <FeatherIcon color="#fff" size={18} name={'globe'} />
                </View>
                <Text style={styles.rowLabel}>Language</Text>
                <View style={styles.rowSpacer} />
                <FeatherIcon color="#0c0c0c" name="chevron-right" size={22} />
              </View>
            </TouchableOpacity>
            <Text style={styles.sectionHeader}>....</Text>
            <TouchableOpacity onPress={() => onSubmitLogout()}>
              <View style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: '#8e8d91' }]}>
                  <FeatherIcon color="#fff" size={18} name={'log-out'} />
                </View>
                <Text style={styles.rowLabel}>Logout</Text>
                <View style={styles.rowSpacer} />
                <FeatherIcon color="#0c0c0c" name="chevron-right" size={22} />
              </View>
            </TouchableOpacity>
            <Modal visible={showModal}>
              <EditProfileModal close={closeModal} userId={userId} logout={onSubmitLogout} />
            </Modal>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 0,
  },
  section: {
    paddingHorizontal: 24,
  },
  sectionHeader: {
    paddingVertical: 12,
    fontSize: 12,
    fontWeight: '600',
    color: '#9e9e9e',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  profile: {
    padding: 24,
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 9999,
  },
  profileAvatarWrapper: {
    position: 'relative',
  },
  profileAction: {
    position: 'absolute',
    right: -4,
    bottom: -10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: 9999,
    backgroundColor: '#007bff',
  },
  profileName: {
    marginTop: 20,
    fontSize: 19,
    fontWeight: '600',
    color: '#414d63',
    textAlign: 'center',
  },
  profileAddress: {
    marginTop: 5,
    fontSize: 16,
    color: '#989898',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 50,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: '400',
    color: '#0c0c0c',
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
});
