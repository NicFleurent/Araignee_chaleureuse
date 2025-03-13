import { View, Text } from 'react-native'
import React from 'react'
import { Dropdown } from 'react-native-element-dropdown';

const StandardDropdown = ({data, value, onChange, placeholder, darkMode}) => {
  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown, darkMode && styles.dropdownDarkmode]}
        placeholderStyle={[styles.placeholderStyle, darkMode && styles.placeholderStyleDarkMode]}
        selectedTextStyle={[styles.selectedTextStyle, darkMode && styles.selectedTextStyleDarkmode]}
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
  dropdownDarkmode:{
    borderColor:'#fff'
  },
  placeholderStyle: {
    fontSize: 14,
    color:'gray'
  },
  placeholderStyleDarkMode:{
    color:'#fff'
  },
  selectedTextStyle: {
    fontSize: 14,
    color:'#4B4E6D'
  },
  selectedTextStyleDarkmode:{
    color:'#fff'
  },
};

export default StandardDropdown