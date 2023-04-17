import React, { useState } from 'react';
import { Text, View, TextInput, StyleSheet, Button } from 'react-native';
import registerUser from '../../../services/api/userManagment/registerUser';
import ValidateEmail from '../../../functions/ValidateEmail';
import ValidatePass from '../../../functions/ValidatePass';

export default function Register(props) {
  const { navigation } = props;

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });

  const [formError, setFormError] = useState({ email: false, password: false });

  const onSubmit = () => {
    try {
      if (ValidateEmail(form.email) && ValidatePass(form.password)) {
        const response = registerUser(form);
        if (response.status === 201) {
          //   navigation.navigate('login');
        } else {
          console.log('Check details please');
        }
      }
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>First name</Text>
      <TextInput
        placeholder="first_name"
        style={styles.input}
        value={form.first_name}
        id="first_name"
        onChangeText={(text) => setForm({ ...form, first_name: text })}
      />
      <Text>Last name</Text>
      <TextInput
        placeholder="last_name"
        style={styles.input}
        value={form.last_name}
        id="last_name"
        onChangeText={(text) => setForm({ ...form, last_name: text })}
      />
      <Text>Phone Number</Text>
      <TextInput style={styles.input} />
      <Text>Email</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={form.email}
        id="email"
        onBlur={() =>
          !ValidateEmail(form.email)
            ? setFormError({ ...formError, email: true })
            : setFormError({ ...formError, email: false })
        }
        name="email"
        onChangeText={(text) => setForm({ ...form, email: text })}
      />
      {formError.email && <Text style={styles.errorText}>Email not valid</Text>}
      <Text>Password</Text>
      <TextInput
        secureTextEntry
        placeholder="**********"
        name="password"
        id="password"
        style={styles.input}
        value={form.password}
        onBlur={() =>
          !ValidatePass(form.password)
            ? setFormError({ ...formError, password: true })
            : setFormError({ ...formError, password: false })
        }
        onChangeText={(text) => setForm({ ...form, password: text })}
      />
      {formError.password && <Text style={styles.errorText}>Password is invalid, try again</Text>}
      <Button title="Login" onPress={onSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
  },
});
