import { Text, TouchableOpacity } from 'react-native';
import React from 'react';

import { StyleSheet } from 'react-native-web';
// export default function Btn({ bgColor, btnLabel, textColor, Press, topPadding }) {
//   const padding = topPadding || 0;
//   // Define a style object with dynamic properties
//   const styles = StyleSheet.create({
//     button: {
//       backgroundColor: bgColor,
//       borderRadius: 100,
//       alignItems: 'center',
//       width: 300,
//       paddingVertical: 5,
//       marginVertical: 10,
//       marginTop: padding,
//     },
//     label: {
//       color: textColor,
//       fontSize: 25,
//       fontWeight: 'bold',
//     },
//   });

//   return (
//     <TouchableOpacity onPress={Press} style={styles.button}>
//       <Text style={styles.label}>{btnLabel}</Text>
//     </TouchableOpacity>
//   );
// }
export default function Btn({
  bgColor,
  btnLabel,
  textColor,
  Press,
  topPadding,
  opacity,
  disabled,
}) {
  const padding = topPadding || 0;
  // Define a style object with dynamic properties
  const styles = StyleSheet.create({
    button: {
      backgroundColor: bgColor,
      borderRadius: 100,
      alignItems: 'center',
      width: 300,
      paddingVertical: 5,
      marginVertical: 10,
      marginTop: padding,
      opacity: opacity,
    },
    label: {
      color: textColor,
      fontSize: 25,
      fontWeight: 'bold',
    },
  });

  return (
    <TouchableOpacity onPress={Press} style={styles.button} disabled={disabled}>
      <Text style={styles.label}>{btnLabel}</Text>
    </TouchableOpacity>
  );
}
