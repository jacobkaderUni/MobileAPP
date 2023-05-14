import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { Camera, CameraType, requestCameraPermissionsAsync } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import SendImage from "../../../../services/api/userManagment/sendImage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "react-native-toast-notifications";
import { errorMessages } from "../../../ErrorMessages";

export default function Camera2() {
  const [type, setType] = useState(CameraType.back);
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [displayPhoto, setdisplayPhoto] = useState(null);
  const isFocused = useIsFocused();
  const cameraRef = useRef(null);

  const toast = useToast();
  useEffect(() => {
    (async () => {
      const { status } = await requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    if (isFocused) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isFocused]);

  async function startCamera() {
    if (cameraRef.current && !camera) {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === "granted") {
        setCamera(cameraRef.current);
      }
    }
  }

  function stopCamera() {
    if (camera) {
      //camera.release();
      setCamera(null);
    }
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
    console.log(type);
  }

  async function takePhoto() {
    if (camera) {
      const options = { quality: 0.5, base64: true };
      const data = await camera.takePictureAsync(options);
      setdisplayPhoto(data.uri);
      let res = await fetch(data.uri);
      let blob = await res.blob();
      setPhoto(blob);
    }
  }

  async function savePhoto() {
    try {
      let userId = await AsyncStorage.getItem("whatsthat_user_id");
      const response = await SendImage(userId, photo);
      if (response.status === 200) {
        toast.show("Picture uploaded successfully", {
          type: "success",
          placement: "top",
          duration: 1000,
          animationType: "slide-in",
        });
        setPhoto(null);
      }
    } catch (error) {
      console.log(error.response.status);
      if (error.response.status === 401) {
        toast.show("Unauthorised", {
          type: "warning",
          placement: "top",
          duration: 1000,
          animationType: "slide-in",
        });
      } else if (error.response.status === 404) {
        toast.show("Not found", {
          type: "danger",
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
  }

  function cancelPhoto() {
    setPhoto(null);
  }

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  if (photo) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: displayPhoto }} style={styles.photo} />
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons name="ios-arrow-back-circle" size={36} color="black" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonContainer} onPress={savePhoto}>
            <Ionicons name="save" size={48} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={cancelPhoto}
          >
            <Ionicons name="reload-circle" size={36} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        {isFocused && (
          <Camera
            style={styles.camera}
            type={type}
            ref={(ref) => setCamera(ref)}
          >
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <Ionicons
                  name="ios-arrow-back-circle"
                  size={36}
                  color="black"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={takePhoto}
              >
                <Ionicons name="camera" size={48} color="black" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={toggleCameraType}
              >
                <Ionicons
                  name="md-camera-reverse-sharp"
                  size={36}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          </Camera>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  photo: {
    flex: 1,
    width: "100%",
  },
  rightButton: {
    alignSelf: "flex-end",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 80,
    position: "absolute",
    bottom: 0,
    backgroundColor: "transparent",
  },
  buttonContainer: {
    padding: 5,
    margin: 5,
    borderRadius: 5,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  buttonContainerImage: {
    padding: 5,
    margin: 5,
    borderRadius: 5,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  button: {
    width: "100%",
    height: "100%",
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ddd",
  },
});
