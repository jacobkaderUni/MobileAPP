import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Modal,
  Text,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FeatherIcon from "react-native-vector-icons/Feather";
import EditProfileModal from "./components/EditProfileModal";
import ProfileData from "./components/ProfileData";
import { useAuth } from "../../../navigator/AuthContext";
import logoutUser from "../../../services/api/userManagment/logoutUser";
import Loading from "../../Loading";
import DisplayImage from "./cameraHandling.s/Display";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import { useToast } from "react-native-toast-notifications";

export default function Settings2() {
  const [userId, setUserId] = useState();
  const [userDetails, setUserDetails] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [_, setUser] = useAuth();
  const navigation = useNavigation();
  const toast = useToast();

  const onSubmitLogout = async () => {
    try {
      const response = await logoutUser();
      if (response.status === 200) {
        toast.show("logged out", {
          type: "success",
          placement: "top",
          duration: 1000,
          animationType: "slide-in",
        });
        setUser();
        AsyncStorage.removeItem("whatsthat_user_id");
        AsyncStorage.removeItem("whatsthat_session_token");
      } else {
        console.log("didnt logout, try again");
      }
    } catch (error) {
      if (error.response.status === 400) {
        toast.show("Unauthorised", {
          type: "warning",
          placement: "top",
          duration: 1000,
          animationType: "slide-in",
        });
      } else if (error.response.status === 500) {
        toast.show("Server Error", {
          type: "danger",
          placement: "top",
          duration: 1000,
          animationType: "slide-in",
        });
      }
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
        setImage={setImage}
      />
      {isLoading ? (
        <Loading />
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.profile}>
            <TouchableOpacity onPress={() => {}}>
              <View style={styles.profileAvatarWrapper}>
                <DisplayImage user_id={userId} type={"1"} />

                <TouchableOpacity
                  onPress={() => {
                    // handle onPress
                    navigation.navigate("Camera");
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
                console.log(userDetails);
              }}
            >
              <View style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: "#8e8d91" }]}>
                  <FeatherIcon color="#fff" size={18} name={"user"} />
                </View>
                <Text style={styles.rowLabel}>Edit profile details</Text>
                <View style={styles.rowSpacer} />
                <FeatherIcon color="#0c0c0c" name="chevron-right" size={22} />
              </View>
            </TouchableOpacity>
            <Text style={styles.sectionHeader}>preference</Text>

            <Text style={styles.sectionHeader}>Logout</Text>
            <TouchableOpacity onPress={() => onSubmitLogout()}>
              <View style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: "#8e8d91" }]}>
                  <FeatherIcon color="#fff" size={18} name={"log-out"} />
                </View>
                <Text style={styles.rowLabel}>Logout</Text>
                <View style={styles.rowSpacer} />
                <FeatherIcon color="#0c0c0c" name="chevron-right" size={22} />
              </View>
            </TouchableOpacity>
            <Modal visible={showModal}>
              <EditProfileModal
                userDetails={userDetails}
                close={closeModal}
                userId={userId}
                logout={onSubmitLogout}
              />
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
    fontWeight: "600",
    color: "#9e9e9e",
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  profile: {
    padding: 24,
    backgroundColor: "#fff",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 9999,
  },
  profileAvatarWrapper: {
    position: "relative",
  },
  profileAction: {
    position: "absolute",
    right: -4,
    bottom: -10,
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    borderRadius: 9999,
    backgroundColor: "#007bff",
  },
  profileName: {
    marginTop: 20,
    fontSize: 19,
    fontWeight: "600",
    color: "#414d63",
    textAlign: "center",
  },
  profileAddress: {
    marginTop: 5,
    fontSize: 16,
    color: "#989898",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 50,
    backgroundColor: "#f2f2f2",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: "400",
    color: "#0c0c0c",
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
});
