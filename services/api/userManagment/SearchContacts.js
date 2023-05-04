import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "@env";

const SearchContacts = async (text) => {
  return axios({
    method: "GET",
    url: `${BASE_URL}search?q=${text}&search_in=contacts&limit=100&offset=0`,
    headers: {
      "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token"),
    },
  })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export default SearchContacts;
