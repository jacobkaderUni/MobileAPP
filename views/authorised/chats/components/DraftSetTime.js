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

// export default function ModaleDT({ onSetDateTime, setShowModal }) {
//   const [dateTime, setDateTime] = useState("");

//   const handleSetDateTime = () => {
//     if (!dateTime) return onSetDateTime(null);

//     const timestamp = moment(dateTime, "HH:mm DD/MM/YYYY").valueOf();
//     onSetDateTime(dateTime);
//   };
//   return (
//     <View style={styles.modalContainer}>
//       <TouchableOpacity
//         style={styles.closeButton}
//         onPress={() => setShowModal(false)}
//       >
//         <Ionicons name="close" size={24} color="black" />
//       </TouchableOpacity>
//       <View style={styles.headerContainer}>
//         <Text style={styles.headerText}>Want to set a date/time?</Text>
//         <TouchableOpacity
//           style={styles.closeButton}
//           onPress={() => handleSetDateTime()}
//         >
//           <Ionicons name="send" size={24} color="black" />
//         </TouchableOpacity>
//       </View>
//       <View style={styles.dateTimeContainer}>
//         <Text style={styles.dateTimeLabel}>Date/Time:</Text>
//         <TextInput
//           style={styles.dateTimeInput}
//           placeholder="hh:mm dd/mm/yyyy"
//           value={dateTime}
//           onChangeText={(text) => setDateTime(text)}
//         />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   modalContainer: {
//     backgroundColor: "white",
//     borderRadius: 10,
//     padding: 20,
//     alignItems: "center",
//   },
//   headerContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   headerText: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginRight: 10,
//   },
//   closeButton: {
//     padding: 10,
//   },
//   dateTimeContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   dateTimeLabel: {
//     fontSize: 16,
//     marginRight: 10,
//   },
//   dateTimeInput: {
//     borderWidth: 1,
//     borderColor: "gray",
//     borderRadius: 5,
//     padding: 5,
//     flex: 1,
//   },
// });

// export default function ModaleDT({ onSetDateTime, setShowModal }) {
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");

//   const handleSetDateTime = () => {
//     if (!date || !time) return onSetDateTime(null);

//     // const dateTime = `${date} ${time}`;
//     const timestamp = moment(`${date} ${time}`, "DD/MM/YYYY HH:mm").valueOf();
//     onSetDateTime(timestamp);
//   };

//   return (
//     <View style={styles.modalContainer}>
//       <TouchableOpacity
//         style={styles.closeButton}
//         onPress={() => setShowModal(false)}
//       >
//         <Ionicons name="close" size={24} color="black" />
//       </TouchableOpacity>
//       <View style={styles.headerContainer}>
//         <Text style={styles.headerText}>Want to set a date/time?</Text>
//         <TouchableOpacity
//           style={styles.closeButton}
//           onPress={() => handleSetDateTime()}
//         >
//           <Ionicons name="send" size={24} color="black" />
//         </TouchableOpacity>
//       </View>
//       <View style={styles.dateTimeContainer}>
//         <Text style={styles.dateTimeLabel}>Date:</Text>

//         <TextInput
//           style={styles.dateInput}
//           placeholder="dd/mm/yyyy"
//           value={date}
//           onChangeText={(text) => {
//             let day = text.slice(0, 2);
//             let month = text.slice(2, 4);
//             let year = text.slice(4, 8);

//             // Limit the day to 31
//             if (day > 31) {
//               day = "31";
//             }

//             // Limit the month to 12
//             if (month > 12) {
//               month = "12";
//             }

//             let formattedText = `${day}/${month}/${year}`;
//             // Add separators only if the length of the text is correct
//             if (text.length === 8) {
//               formattedText = formattedText.replace(
//                 /(\d{2})(\d{2})(\d{4})/,
//                 "$1/$2/$3"
//               );
//             }
//             // Check the length of the input
//             if (text.length === 8 || text.length < 9) {
//               setDate(formattedText);
//             }
//           }}
//         />
//       </View>
//       <View style={styles.dateTimeContainer}>
//         <Text style={styles.dateTimeLabel}>Time:</Text>
//         {/* <TextInput
//           style={styles.timeInput}
//           placeholder="hh:mm"
//           value={time}
//           onChangeText={(text) => setTime(text)}
//         /> */}
//         <TextInput
//           style={styles.timeInput}
//           placeholder="hh:mm"
//           value={time}
//           onChangeText={(text) => {
//             const formattedText = text
//               .replace(/[^0-9]/g, "")
//               .replace(/(\d{2})(\d{2})/, "$1:$2");
//             setTime(formattedText);
//           }}
//         />
//       </View>
//     </View>
//   );
// }

export default function ModaleDT({ onSetDateTime, setShowModal }) {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");

  const handleSetDateTime = () => {
    if (!day || !month || !year || !hours || !minutes) {
      return onSetDateTime(null);
    }

    const timestamp = moment(
      `${day}/${month}/${year} ${hours}:${minutes}`,
      "DD/MM/YYYY HH:mm"
    ).valueOf();
    onSetDateTime(timestamp);
  };

  return (
    <View style={styles.modalContainer}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setShowModal(false)}
      >
        <Ionicons name="close" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Want to set a date/time?</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => handleSetDateTime()}
        >
          <Ionicons name="send" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.dateTimeContainer}>
        <Text style={styles.dateTimeLabel}>Date:</Text>
        <TextInput
          style={styles.dateTimeInput}
          placeholder="dd"
          value={day}
          maxLength={2}
          onChangeText={(text) => {
            if (text > 31) {
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
            if (text > 12) {
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
            if (text < 2023) {
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
            if (text > 23) {
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
            if (text > 59) {
              text = "59";
            }
            setMinutes(text);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 10,
  },
  closeButton: {
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
});
