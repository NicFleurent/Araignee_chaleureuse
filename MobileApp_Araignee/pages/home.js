import { View, Text } from 'react-native'
import React from 'react'

const home = () => {
  return (
    <View style={styles.container}>
      <Text>home</Text>
    </View>
  )
}

const styles = {
  container:{
    flex:1,
    backgroundColor:'white'
  }
}

export default home