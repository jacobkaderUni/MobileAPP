import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "@env";

const getChats = async () => {
  return axios({
    timeout: 3000,
    method: "GET",
    url: `${BASE_URL}chat`,
    headers: {
      "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token"),
    },
  })
    .then((response) => response)
    .catch((error) => {
      if (error.code === "ECONNABORTED") {
        return Promise.reject({ code: 999, message: "Timeout Error" });
      } else {
        // Handle other errors
        throw error;
      }
    });
};

export default getChats;
