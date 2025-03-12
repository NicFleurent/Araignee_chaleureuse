import { View, Text, TextInput } from 'react-native'
import React from 'react'

const StandardInput = ({
  placeholder,
  value, 
  onChangeText,
  keyboardType,
  secureTextEntry,
  error, 
  removeBottomMargin,
  darkMode
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={darkMode ? "#fff" : "gray"}
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, darkMode && styles.inputDarkmode, removeBottomMargin && styles.removeBottomMargin, error && styles.inputError]} 
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
      />
      {error && <Text style={[styles.error, removeBottomMargin && styles.removeBottomMargin]}>{error}</Text>}
    </View>
  )
}

const styles = {
  container:{
    width:'100%'
  },
  label:{
    color:'black'
  },
  input:{
    borderWidth:2,
    backgroundColor:'white',
    borderColor:"#4B4E6D",
    width:'100%',
    marginBottom:10,
    borderRadius:0,
    padding:10
  },
  inputDarkmode:{
    backgroundColor:'15202B',
    borderColor:"#fff",
    color:'#fff'
  },
  inputError:{
    marginBottom:2
  },
  error:{
    color:'red',
    marginBottom:15
  },
  removeBottomMargin:{
    marginBottom:0
  }
}

export default StandardInput