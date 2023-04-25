import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getUserInfo from "../../../../services/api/userManagment/getUserInfo";

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
    try {
      const user_id = await AsyncStorage.getItem("whatsthat_user_id");
      const response = await getUserInfo(user_id);
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
    } catch (error) {
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

    return null;
  };
}
