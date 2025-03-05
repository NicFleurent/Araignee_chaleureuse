import { View, Text, TextInput } from 'react-native'
import React from 'react'

const StandardInput = ({
  label,
  value, 
  onChangeText,
  keyboardType,
  error, 
  removeBottomMargin
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, removeBottomMargin && styles.removeBottomMargin, error && styles.inputError]} 
        keyboardType={keyboardType}
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
    borderWidth:1,
    backgroundColor:'white',
    borderColor:"gray",
    width:'100%',
    marginBottom:10,
    borderRadius:5
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