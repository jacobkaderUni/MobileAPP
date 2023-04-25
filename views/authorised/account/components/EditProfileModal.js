import React, { useState, useEffect } from "react";
import updateUser from "../../../../services/api/userManagment/updateUser";
import EditProfilePage from "./EditProfilePage";
import { useToast } from "react-native-toast-notifications";
export default function EditProfileModal({
  userDetails,
  close,
  userId,
  logout,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [validationError, setValidationError] = useState({
    email: false,
    password: false,
  });
  const toast = useToast();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (isLoading) {
      setForm(userDetails);
      setIsLoading(false);
    }
  });

  const onSubmitUpdateUser = async () => {
    try {
      // Check if all form fields are filled
      if (
        !form.first_name ||
        !form.last_name ||
        !form.email ||
        !form.password
      ) {
        setFormError("Please fill all fields");
        return;
      }

      console.log(
        `Name: ${form.first_name}, Email: ${form.email}, Password: ${form.password}`
      );

      const response = await updateUser(form, userId);

      if (response.status === 200) {
        toast.show("Details updated", {
          type: "success",
          placement: "top",
          duration: 1000,
          animationType: "slide-in",
        });
        logout();
      } else {
        console.log("didnt update user info");
      }
    } catch (error) {
      if (error.response.status === 400) {
        toast.show("Bad request, check inputs", {
          type: "warning",
          placement: "top",
          duration: 1000,
          animationType: "slide-in",
        });
      } else if (error.response.status === 401) {
        toast.show("Unauthorised", {
          type: "danger",
          placement: "top",
          duration: 1000,
          animationType: "slide-in",
        });
      } else if (error.response.status === 403) {
        toast.show("Forbidden", {
          type: "danger",
          placement: "top",
          duration: 1000,
          animationType: "slide-in",
        });
      } else if (error.response.status === 404) {
        toast.show("Not Found", {
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
  };

  const handleCloseModal = () => {
    close();
  };

  return (
    <>
      <EditProfilePage
        form={form}
        validationError={validationError}
        setValidationError={setValidationError}
        formError={formError}
        setForm={setForm}
        onSubmitUpdateUser={onSubmitUpdateUser}
        handleCloseModal={handleCloseModal}
      />
    </>
  );
}
