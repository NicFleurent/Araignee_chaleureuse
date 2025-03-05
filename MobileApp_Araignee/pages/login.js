import { View, Text, Image } from 'react-native'
import React, { useState } from 'react'
import StandardInput from '../components/StandardInput'

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/spider-bot.png")} />
      <StandardInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
        error={errors.errorEmail}
      />
      <Text>Bouton</Text>
      <Text>Lien</Text>
    </View>
  )
}

const styles = {
  container:{
    flex:1,
    backgroundColor:'white',
    padding:20,
    alignItems:'center'
  }
}

export default login