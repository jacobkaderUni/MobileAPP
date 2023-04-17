import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import ValidateEmail from '../../../../functions/ValidateEmail';
import ValidatePass from '../../../../functions/ValidatePass';
import FormField from './FormField';

export default function EditProfilePage({
  form,
  validationError,
  setValidationError,
  formError,
  setForm,
  onSubmitUpdateUser,
  handleCloseModal,
}) {
  return (
    <View style={styles.container}>
      <FormField
        label="First Name:"
        value={form.first_name}
        onChangeText={(text) => setForm({ ...form, first_name: text })}
      />
      <FormField
        label="Last Name:"
        value={form.last_name}
        onChangeText={(text) => setForm({ ...form, last_name: text })}
      />
      <FormField
        label="Email:"
        value={form.email}
        onBlur={() =>
          !ValidateEmail(form.email)
            ? setValidationError({ ...validationError, email: true })
            : setValidationError({ ...validationError, email: false })
        }
        onChangeText={(text) => setForm({ ...form, email: text })}
        error={validationError.email && 'Email not valid'}
      />
      <FormField
        label="Password:"
        value={form.password}
        onChangeText={(text) => setForm({ ...form, password: text })}
        secureTextEntry
        onBlur={() =>
          !ValidatePass(form.password)
            ? setValidationError({ ...validationError, password: true })
            : setValidationError({ ...validationError, password: false })
        }
        error={validationError.password && 'Password is invalid, try again'}
      />
      {formError && <Text style={styles.errorText}>{formError}</Text>}
      <TouchableOpacity style={styles.button} onPress={() => onSubmitUpdateUser()}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => handleCloseModal()}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    marginTop: 10,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
  },
});
