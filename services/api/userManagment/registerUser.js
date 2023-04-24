import axios from "axios";
import { BASE_URL } from "@env";

const registerUser = async (data) => {
  return axios({
    method: "POST",
    url: `${BASE_URL}user`,
    data,
  })
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};

export default registerUser;
