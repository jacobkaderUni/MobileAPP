import axios from "axios";
import { BASE_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SendImage = async (userId, data) => {
  try {
    const token = await AsyncStorage.getItem("whatsthat_session_token");
    const response = await axios.post(`${BASE_URL}user/${userId}/photo`, data, {
      headers: {
        "Content-Type": "image/png",
        "X-Authorization": token,
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export default SendImage;
// const SendImage = async (userId, data) => {
//   return fetch(`${BASE_URL}user/${userId}/photo`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "image/png",
//       "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token"),
//     },
//     body: data,
//   })
//     .then((response) => response)
//     .catch((err) => {
//       console.log(err);
//     });
// };

// export default SendImage;
