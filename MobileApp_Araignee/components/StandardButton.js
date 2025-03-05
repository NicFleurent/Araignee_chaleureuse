import { Background } from '@react-navigation/elements'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

const StandardButton = ({label, onPress}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.button}
        onPress={onPress}
      >
        <Text style={styles.buttonTxt}>{label}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = {
  container:{
    width:'100%'
  },
  button:{
    backgroundColor:'#4B4E6D',
    height:60,
    alignItems:'center',
    justifyContent:'center',
    marginBottom:20
  },
  buttonTxt:{
    fontSize:20,
    color:'white'
  }
}

export default StandardButton