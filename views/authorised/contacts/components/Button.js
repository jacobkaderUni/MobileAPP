import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function FilterButton({ options, defaultOption, onSelect }) {
  const [selectedOption, setSelectedOption] = useState(defaultOption);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    onSelect(option);
  };

  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.optionButton,
            selectedOption.value === option.value && styles.selectedOptionButton,
          ]}
          onPress={() => handleOptionSelect(option)}
        >
          <Text
            style={[
              styles.optionText,
              selectedOption.value === option.value && styles.selectedOptionText,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingVertical: 4, // modify paddingVertical to make the button smaller
    paddingHorizontal: 16,
  },
  optionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4, // modify paddingVertical to make the button smaller
  },
  selectedOptionButton: {
    backgroundColor: '#333',
    borderRadius: 20, // modify borderRadius to make the button simpler
  },
  optionText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedOptionText: {
    color: '#fff',
  },
});
