import React, { useState } from 'react';
import updateUser from '../../../../services/api/userManagment/updateUser';

import EditProfilePage from './EditProfilePage';
export default function EditProfileModal({ close, userId, logout }) {
  const [validationError, setValidationError] = useState({ email: false, password: false });
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });

  const [formError, setFormError] = useState(null);

  const onSubmitUpdateUser = async () => {
    try {
      // Check if all form fields are filled
      if (!form.first_name || !form.last_name || !form.email || !form.password) {
        setFormError('Please fill all fields');
        return;
      }

      console.log(`Name: ${form.first_name}, Email: ${form.email}, Password: ${form.password}`);

      const response = await updateUser(form, userId);

      if (response.status === 200) {
        console.log(response);
        logout();
      } else {
        console.log('didnt update user info');
      }
    } catch (error) {
      console.log(error);
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
