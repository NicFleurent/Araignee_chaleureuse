import { Background } from '@react-navigation/elements'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

const StandardButton = ({label, onPress, color}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[
          styles.button,
          color === "green" && styles.greenButton,
          color === "red" && styles.redButton
        ]}
        onPress={onPress}
      >
        <Text style={[styles.buttonTxt,color === "green" && styles.greenButtonTxt]}>{label}</Text>
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
  greenButton:{
    backgroundColor:'#84DCC6',
  },
  redButton:{
    backgroundColor:'#F13030',
  },
  buttonTxt:{
    fontSize:20,
    color:'white'
  },
  greenButtonTxt:{
    color:'black',
    fontWeight: 'bold',
    color: '#4B4E6D',
  }
}

export default StandardButton