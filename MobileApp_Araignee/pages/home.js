import { View, Text } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux';

const home = () => {
  const temperatureUnit = useSelector((state) => state.parameters.temperature_humidity_unit);
  return (
    <View style={styles.container}>
      {temperatureUnit == "farenheit" && <Text>60°F</Text> || <Text>20°C</Text>}
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