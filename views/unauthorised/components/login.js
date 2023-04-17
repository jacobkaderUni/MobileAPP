import React, { useState } from 'react';
import { Text, View, TextInput, StyleSheet, Button } from 'react-native';
import loginUser from '../../../services/api/userManagment/loginUser';
import ValidateEmail from '../../../functions/ValidateEmail';
import ValidatePass from '../../../functions/ValidatePass';
import { useAuth } from '../../../navigator/AuthContext';

export default function Login(props) {
  const { navigation } = props;

  const [_, setUser] = useAuth();

  const [form, setForm] = useState({
    email: 'ashley.williams@mmu.ac.uk',
    password: 'Wr3xh4m!',
  });

  const [formError, setFormError] = useState({ email: false, password: false });

  const onSubmit = async () => {
    try {
      if (ValidateEmail(form.email) && ValidatePass(form.password)) {
        const response = await loginUser(form);
        if (response.data) {
          setUser(response);
          // navigation.navigate("appnav");
        } else {
          console.log('Invalid email and/or password');
        }
      }
    } catch (error) {
      console.log('Error: ', error);
    }
  };
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Fill out to login</Text>
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
      {formError.password && <Text style={styles.errorText}>Password is invalid, try again.</Text>}
      <Button title="Login" onPress={onSubmit} />
      <Text onPress={() => navigation.navigate('register')}>Need to Register?</Text>
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
