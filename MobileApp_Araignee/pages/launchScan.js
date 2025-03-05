import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import Toast from 'react-native-toast-message';

const launchScan = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={()=>{
        Toast.show({
          type: 'error',
          text1: 'Attention',
          text2: 'Le roboit doit etre au sol'
        });
      }}>
        <View style={{backgroundColor:"#84DCC6", alignItems:"center"}}>
            <Text style={{paddingVertical: 13, fontWeight:"bold", fontSize:20}}>Debut du scan</Text>
        </View>
      </TouchableOpacity>
      <Toast />
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    backgroundColor: "white",
    flex: 1,
    paddingHorizontal: 20,
    justifyContent:"center"
  }
});

export default launchScan