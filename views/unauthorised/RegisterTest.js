import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Background from "./components/Background";
import Btn from "./components/Btn";
import { darkGreen } from "./components/Constants";
import Field from "./components/Fielf";
import registerUser from "../../services/api/userManagment/registerUser";
import ValidateEmail from "../../functions/ValidateEmail";
import ValidatePass from "../../functions/ValidatePass";
import { useToast } from "react-native-toast-notifications";
const Register = (props) => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [emailError, setEmailError] = useState(false);
  const [passError, setPassError] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const toast = useToast();

  const handleValidation = () => {
    const isEmailValid = ValidateEmail(form.email);
    const isPasswordValid = ValidatePass(form.password);
    setEmailError(!isEmailValid && form.email.length > 0);
    setPassError(!isPasswordValid && form.password.length > 0);
    setIsValid(isEmailValid && isPasswordValid);
  };
  useEffect(() => {
    handleValidation();
  }, [form.email, form.password, emailError, passError]);

  const onSubmit = async () => {
    try {
      if (ValidateEmail(form.email) && ValidatePass(form.password)) {
        console.log(form);
        const response = await registerUser(form);
        console.log(response);
        console.log(response.status);
        if (response.status === 201) {
          toast.show("Account created successfully", {
            type: "success",
            placement: "top",
            duration: 2000,
            animationType: "slide-in",
          });
          navigation.navigate("logintest");
        }
      }
    } catch (error) {
      if (error.response.status === 400) {
        toast.show("Bad request, user might already exist", {
          type: "warning",
          placement: "top",
          duration: 2000,
          animationType: "slide-in",
        });
      } else if (error.response.status === 500) {
        toast.show("Server Error", {
          type: "danger",
          placement: "top",
          duration: 2000,
          animationType: "slide-in",
        });
      }
    }
  };
  return (
    <Background style={{ width: "100%" }}>
      <View
        style={{
          alignItems: "center",
          marginHorizontal: "auto",
          height: "100%",
          flexDirection: "column",
        }}
      >
        <View
          id="text"
          style={{ alignItems: "center", marginVertical: 0, height: 290 }}
        >
          <Text
            style={{
              paddingTop: 90,
              color: "white",
              fontSize: 64,
              fontWeight: "bold",
            }}
          >
            Register
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: 19,
              fontWeight: "bold",
            }}
          >
            Create a new account
          </Text>
        </View>
        <View id="form" style={{ alignItems: "center" }}>
          <View
            style={{
              backgroundColor: "white",
              height: 561,
              width: 393,
              borderTopLeftRadius: 130,
              paddingTop: 100,
              alignItems: "center",
              marginTop: 0,
            }}
          >
            <Field
              placeholder="First Name"
              id="fName"
              name="fName"
              value={form.first_name}
              onChangeText={(text) => setForm({ ...form, first_name: text })}
            />
            <Field
              placeholder="Last Name"
              name="lName"
              id="lName"
              value={form.last_name}
              onChangeText={(text) => setForm({ ...form, last_name: text })}
            />
            <Field
              placeholder="Email"
              id="email"
              name="email"
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
            />
            {emailError && (
              <Text style={styles.errorText}>
                Wrong email format, try ___@__.com
              </Text>
            )}
            <Field
              secureTextEntry
              placeholder="**********"
              name="password"
              id="password"
              value={form.password}
              onChangeText={(text) => setForm({ ...form, password: text })}
            />
            {passError && (
              <Text style={styles.errorText}>
                Password is invalid, try again.
              </Text>
            )}

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                width: "78%",
                paddingRight: 0,
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "grey", fontSize: 12 }}>
                By signing up, you agree to our{" "}
              </Text>
              <TouchableOpacity>
                <Text
                  style={{ color: darkGreen, fontWeight: "bold", fontSize: 12 }}
                >
                  Terms & Conditions
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                width: "78%",
                paddingRight: 16,
                marginBottom: 7,
              }}
            >
              <Text style={{ color: "grey", fontSize: 12 }}>and </Text>
              <TouchableOpacity>
                <Text
                  style={{ color: darkGreen, fontWeight: "bold", fontSize: 12 }}
                >
                  Privacy Policy
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "78%",
                paddingRight: 16,
                paddingStart: 16,
                marginBottom: 7,
                marginTop: 100,
              }}
            >
              <Btn
                textColor="white"
                bgColor={darkGreen}
                btnLabel="Register"
                opacity={isValid ? 1 : 0.6}
                disabled={!isValid}
                Press={onSubmit}
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "78%",
                  paddingRight: 16,
                  marginBottom: 7,
                }}
              >
                <Text style={{ color: "grey", fontSize: 12 }}>
                  Already have an account?{" "}
                </Text>
                <TouchableOpacity
                  onPress={() => props.navigation.navigate("login")}
                >
                  <Text
                    style={{
                      color: darkGreen,
                      fontWeight: "bold",
                      fontSize: 12,
                    }}
                  >
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  errorText: {
    color: "grey",
    fontSize: 12,
  },
});
export default Register;
