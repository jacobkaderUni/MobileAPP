import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Textarea,
  TextInput,
} from "react-native";

function generateColorCode(name) {
  const hash = name.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
}

// export default function Message({
//   message,
//   chat_id,
//   user_id,
//   updateMessage,
//   deleteMessage,
// })
//   function formatTimestamp(timestamp) {
//     const date = new Date(timestamp);
//     const timeOptions = { hour: "numeric", minute: "numeric" };
//     return date.toLocaleTimeString([], timeOptions);
//   }

//   const messageBackgroundColor =
//     message.author.user_id === parseInt(user_id)
//       ? "#1982FC"
//       : generateColorCode(
//           message.author.first_name + message.author.last_name
//         ) + "4D";
//   const messageStyle =
//     message.author.user_id === parseInt(user_id)
//       ? styles.senderMessage
//       : styles.receiverMessage;

//   const timestampStyle =
//     message.author.user_id === parseInt(user_id)
//       ? styles.senderTimestamp
//       : styles.receiverTimestamp;
//   const getInitials = (firstName, lastName) => {
//     return `${firstName.charAt(0)}${lastName.charAt(0)}`;
//   };

//   const Circle = ({ initials, backgroundColor }) => {
//     return (
//       <View style={[styles.circle, { backgroundColor: backgroundColor }]}>
//         <Text style={styles.initials}>{initials}</Text>
//       </View>
//     );
//   };

//   const senderBackgroundColor = "#1982FC";
//   const receiverBackgroundColor =
//     generateColorCode(message.author.first_name + message.author.last_name) +
//     "4D";
//   if (message.author.user_id === parseInt(user_id)) {
//     return (
//       <View
//         style={[
//           styles.container,
//           styles.senderMessage,
//           { backgroundColor: senderBackgroundColor },
//         ]}
//       >
//         <Text key={message.timestamp} style={styles.message}>
//           {message.message}{" "}
//           <Text style={styles.timestamp}>
//             {formatTimestamp(message.timestamp)}{" "}
//             {message.author.first_name.charAt(0)}{" "}
//             {message.author.last_name.charAt(0)}
//           </Text>
//         </Text>
//       </View>
//     );
//   }
//   return (
//     <>
//      <Circle
//           initials={getInitials(message.author.first_name, message.author.last_name)}
//           backgroundColor={senderBackgroundColor}
//         />
//     <View
//       style={[
//         styles.container,
//         styles.receiverMessage,
//         { backgroundColor: receiverBackgroundColor },
//       ]}
//     >
//       <Text key={message.timestamp} style={styles.message}>
//         {message.message}{" "}
//         <Text style={styles.timestamp}>
//           {formatTimestamp(message.timestamp)}{" "}
//           {message.author.first_name.charAt(0)}{" "}
//           {message.author.last_name.charAt(0)}
//         </Text>
//       </Text>
//     </View>
//     </
//   );
// }
export default function Message({
  message,
  chat_id,
  user_id,
  updateMessage,
  deleteMessage,
}) {
  const [prevAuthor, setPrevAuthor] = useState(null);
  useEffect(() => {
    if (prevAuthor && prevAuthor.id === message.author.id) {
      setPrevAuthor(message.author);
    } else {
      setPrevAuthor(null);
    }
  }, [message, prevAuthor]);
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const timeOptions = { hour: "numeric", minute: "numeric" };
    return date.toLocaleTimeString([], timeOptions);
  }

  const messageBackgroundColor =
    message.author.user_id === parseInt(user_id)
      ? "#1982FC"
      : generateColorCode(
          message.author.first_name + message.author.last_name
        ) + "4D";
  const messageStyle =
    message.author.user_id === parseInt(user_id)
      ? styles.senderMessage
      : styles.receiverMessage;

  const timestampStyle =
    message.author.user_id === parseInt(user_id)
      ? styles.senderTimestamp
      : styles.receiverTimestamp;

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  const Circle = ({ initials, backgroundColor }) => {
    return (
      <View style={[styles.circle, { backgroundColor: backgroundColor }]}>
        <Text style={styles.initials}>{initials}</Text>
      </View>
    );
  };

  const senderBackgroundColor = "#1982FC";
  const receiverBackgroundColor =
    generateColorCode(message.author.first_name + message.author.last_name) +
    "4D";
  if (message.author.user_id === parseInt(user_id)) {
    return (
      <View
        style={[
          styles.container,
          styles.senderMessage,
          { backgroundColor: senderBackgroundColor },
        ]}
      >
        <Text key={message.timestamp} style={styles.message}>
          {message.message}{" "}
          <Text style={styles.timestamp}>
            {formatTimestamp(message.timestamp)}{" "}
            {/* {message.author.first_name.charAt(0)}{" "}
            {message.author.last_name.charAt(0)} */}
          </Text>
        </Text>
      </View>
    );
  }
  return (
    <View style={{ flexDirection: "row" }}>
      <Circle
        initials={getInitials(
          message.author.first_name,
          message.author.last_name
        )}
        backgroundColor={receiverBackgroundColor}
      />
      <View
        style={[
          styles.container,
          styles.receiverMessage,
          { backgroundColor: receiverBackgroundColor },
        ]}
      >
        <Text key={message.timestamp} style={styles.message}>
          {message.message}{" "}
          <Text style={styles.timestamp}>
            {formatTimestamp(message.timestamp)}{" "}
            {/* {message.author.first_name.charAt(0)}{" "}
            {message.author.last_name.charAt(0)} */}
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    maxWidth: "75%",
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#f2f2f2",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1.41,
    elevation: 2,
    marginBottom: 30,
    marginLeft: -10,
  },

  senderMessage: {
    alignSelf: "flex-end",
    borderBottomRightRadius: 0,
  },
  receiverMessage: {
    alignSelf: "flex-start",
    borderBottomLeftRadius: 0,
  },
  message: {
    fontFamily: "System",
    fontSize: 16,
    lineHeight: 24,
    color: "white",
  },
  senderTimestamp: {
    fontSize: 12,
    lineHeight: 16,
    color: "#666",
    alignSelf: "flex-end",
  },
  receiverTimestamp: {
    fontSize: 12,
    lineHeight: 16,
    color: "#666",
    alignSelf: "flex-start",
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginLeft: 0,
    marginTop: 45,
  },
  initials: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
