import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { isNumeric } from "validator";
import { useToast } from "react-native-toast-notifications";

export default function ModaleDT({ onSetDateTime, setShowModal }) {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const toast = useToast();

  const handleSetDateTime = () => {
    if (!day || !month || !year || !hours || !minutes) {
      toast.show("Draft saved (without date/time)", {
        type: "success",
        placement: "top",
        duration: 1000,
        animationType: "slide-in",
      });
      return onSetDateTime(null);
    }
    if (
      !isNumeric(day) ||
      !isNumeric(month) ||
      !isNumeric(year) ||
      !isNumeric(hours) ||
      !isNumeric(minutes)
    ) {
      toast.show("Enter numbers only", {
        type: "warning",
        placement: "top",
        duration: 1000,
        animationType: "slide-in",
      });
      console.log("enter numbers please");
      setDay("");
      setMonth("");
      setYear("");
      setHours("");
      setMinutes("");
      return;
      //return onSetDateTime(null);
    }

    const timestamp = moment(
      `${day}/${month}/${year} ${hours}:${minutes}`,
      "DD/MM/YYYY HH:mm"
    ).valueOf();
    onSetDateTime(timestamp);
    toast.show("Draft saved (with date/time)", {
      type: "success",
      placement: "top",
      duration: 1000,
      animationType: "slide-in",
    });
  };

  return (
    <View style={styles.modalContainer}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setShowModal(false)}
      >
        <Ionicons name="close" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.dateTimeContainer}>
        <Text style={styles.dateTimeLabel}>Date:</Text>
        <TextInput
          style={styles.dateTimeInput}
          placeholder="dd"
          value={day}
          maxLength={2}
          onChangeText={(text) => {
            if (text > 31 || text < 0) {
              text = "31";
            }
            setDay(text);
          }}
        />
        <Text style={styles.dateTimeSeparator}>/</Text>
        <TextInput
          style={styles.dateTimeInput}
          placeholder="mm"
          value={month}
          maxLength={2}
          onChangeText={(text) => {
            if (text > 12 || text < 0) {
              text = "12";
            }
            setMonth(text);
          }}
        />
        <Text style={styles.dateTimeSeparator}>/</Text>
        <TextInput
          style={styles.dateTimeInput}
          placeholder="yyyy"
          value={year}
          maxLength={4}
          onChangeText={(text) => {
            if (text.length === 4 && (text < 2023 || text < 0)) {
              text = "2023";
            }
            setYear(text);
          }}
        />
      </View>
      <View style={styles.dateTimeContainer}>
        <Text style={styles.dateTimeLabel}>Time:</Text>
        <TextInput
          style={styles.dateTimeInput}
          placeholder="hh"
          value={hours}
          maxLength={2}
          onChangeText={(text) => {
            if (text > 23 || text < 0) {
              text = "23";
            }
            setHours(text);
          }}
        />
        <Text style={styles.dateTimeSeparator}>:</Text>
        <TextInput
          style={styles.dateTimeInput}
          placeholder="mm"
          value={minutes}
          maxLength={2}
          onChangeText={(text) => {
            if (text > 59 || text < 0) {
              text = "59";
            }
            setMinutes(text);
          }}
        />
      </View>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.saveDraftButton}
          onPress={() => handleSetDateTime()}
        >
          <Text style={styles.buttonText}>Save Draft</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "#F5F5F5",
    marginTop: 100,
    borderRadius: 10,
    padding: 20,
    width: "100%",
    alignItems: "stretch",
  },
  headerContainer: {
    flexDirection: "column",
    alignItems: "stretch",
    width: "100%",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 10,
  },
  closeButton: {
    alignSelf: "center",
    padding: 10,
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dateTimeLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  dateInputContainer: {
    flexDirection: "row",
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 5,
    flex: 1,
  },
  dateTimeSeparator: {
    marginHorizontal: 5,
  },
  dateTimeInput: {
    width: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 5,
    flex: 1,
  },
  saveDraftButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
