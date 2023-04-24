import React, { useState, useEffect } from "react";
import { Image, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@env";
import { useIsFocused } from "@react-navigation/native";
import { useToast } from "react-native-toast-notifications";

const DisplayImage = ({ user_id, type }) => {
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();
  const toast = useToast();
  // useEffect(() => {
  //   getProfileImage();
  // }, []);

  useEffect(() => {
    if (isFocused) {
      setIsLoading(true);
      getProfileImage();
    }
  }, [isFocused]);

  const getProfileImage = async () => {
    // let userId = await AsyncStorage.getItem("whatsthat_user_id");
    // console.log(`${BASE_URL}user/${user_id}/photo`);
    fetch(`${BASE_URL}user/${user_id}/photo`, {
      method: "GET",
      headers: {
        "X-Authorization": await AsyncStorage.getItem(
          "whatsthat_session_token"
        ),
      },
    })
      .then((res) => {
        return res.blob();
      })
      .then((resBlob) => {
        let data = URL.createObjectURL(resBlob);
        setPhoto(data);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast.show("Bad request, user might already exist", {
            type: "warning",
            placement: "top",
            duration: 2000,
            animationType: "slide-in",
          });
        } else if (err.response.status === 401) {
          toast.show("Unauthorised", {
            type: "danger",
            placement: "top",
            duration: 2000,
            animationType: "slide-in",
          });
        } else if (err.response.status === 404) {
          toast.show("Not Found", {
            type: "danger",
            placement: "top",
            duration: 2000,
            animationType: "slide-in",
          });
        } else if (err.response.status === 500) {
          toast.show("Server Error", {
            type: "danger",
            placement: "top",
            duration: 2000,
            animationType: "slide-in",
          });
        }
      });
  };

  if (isLoading) {
    return <Text>Loading</Text>;
  }

  let stylesToUse;
  if (type === "1") {
    stylesToUse = styles.profileAvatar;
  } else if (type === "2") {
    stylesToUse = styles.user;
  } else if (type === "3") {
    stylesToUse = styles.contact;
  }

  return (
    <Image
      source={{
        uri: photo,
      }}
      style={stylesToUse}
    />
  );
};

const styles = StyleSheet.create({
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 9999,
  },
  user: {
    width: 42,
    height: 42,
    borderRadius: 14,
  },
  contact: {
    // contact styling
  },
});

export default DisplayImage;
