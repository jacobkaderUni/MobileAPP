import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Background from "./components/Background";
import Btn from "./components/Btn";
import { darkGreen } from "./components/Constants";
import Field from "./components/Fielf";
import loginUser from "../../services/api/userManagment/loginUser";
import ValidateEmail from "../../functions/ValidateEmail";
import ValidatePass from "../../functions/ValidatePass";
import { useAuth } from "../../navigator/AuthContext";
import { useToast } from "react-native-toast-notifications";
import { errorMessages } from "../ErrorMessages";
const Login = (props) => {
  const [form, setForm] = useState({
    email: "ashley.williams@mmu.ac.uk",
    password: "Wr3xh4m!",
  });
  const [emailError, setEmailError] = useState(true);
  const [passError, setPassError] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [_, setUser] = useAuth();
  const toast = useToast();

  const handleValidation = () => {
    const isEmailValid = ValidateEmail(form.email);
    const isPasswordValid = ValidatePass(form.password);
    setEmailError(!isEmailValid && form.email.length > 0);
    setPassError(!isPasswordValid && form.password.length > 0);
    setIsValid(isEmailValid && isPasswordValid);
  };
  const onSubmit = async () => {
    try {
      if (ValidateEmail(form.email) && ValidatePass(form.password)) {
        const response = await loginUser(form);
        if (response.status === 200) {
          toast.show("Logged in", {
            type: "success",
            placement: "top",
            duration: 2000,
            animationType: "slide-in",
          });
          setUser(response);
        }
      }
    } catch (error) {
      if (error.response.status === 400) {
        toast.show("Invalid password or email", {
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
  useEffect(() => {
    handleValidation();
  }, [form.email, form.password, emailError, passError]);

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
            Login
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
                justifyContent: "flex-end",
              }}
            >
              {/* <TouchableOpacity>
                <Text
                  style={{ color: darkGreen, fontWeight: "bold", fontSize: 12 }}
                >
                  Forgot Password?
                </Text>
              </TouchableOpacity> */}
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
                marginTop: 200,
              }}
            >
              <Btn
                textColor="white"
                bgColor={darkGreen}
                btnLabel="Login"
                opacity={isValid ? 1 : 0.6}
                disabled={!isValid}
                Press={onSubmit}
              />

              <View
                style={{
                  display: "flex",

                  justifyContent: "center",
                  alignItems: "center",
                  width: "78%",
                  paddingRight: 16,
                  marginBottom: 7,
                }}
              >
                <Text style={{ color: "grey", fontSize: 12 }}>
                  Don't have an account?{" "}
                </Text>
                {/* <TouchableOpacity
                  onPress={() => props.navigation.navigate("register")}
                >
                  <Text
                    style={{
                      color: darkGreen,
                      fontWeight: "bold",
                      fontSize: 12,
                    }}
                  >
                    Signup
                  </Text>
                </TouchableOpacity> */}
              </View>
              <Btn
                textColor="white"
                bgColor={darkGreen}
                btnLabel="Register"
                Press={() => props.navigation.navigate("register")}
              />
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

export default Login;
