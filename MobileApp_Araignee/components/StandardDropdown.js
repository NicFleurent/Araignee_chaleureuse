import { View, Text } from 'react-native'
import React from 'react'
import { Dropdown } from 'react-native-element-dropdown';

const StandardDropdown = ({data, value, onChange, placeholder}) => {
  return (
    <View style={styles.container}>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </View>
  )
}

const styles = {
  container:{
    width:'100%',
    marginBottom:10,
  },
  dropdown: {
    height: 50,
    borderColor: '#4B4E6D',
    borderWidth: 2,
    paddingLeft:10
  },
  placeholderStyle: {
    fontSize: 14,
    color:'gray'
  },
  selectedTextStyle: {
    fontSize: 14,
    color:'#4B4E6D'
  },
};

export default StandardDropdown