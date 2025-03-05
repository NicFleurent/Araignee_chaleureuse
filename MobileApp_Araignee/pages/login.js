import { View, Text, Image, Switch, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import StandardInput from '../components/StandardInput'
import StandardButton from '../components/StandardButton';

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [stayConnected, setStayConnected] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.fullWidthContainer}>
        <Image source={require("../assets/spider-bot.png")} />
        <StandardInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
          error={errors.errorEmail}
        />
        <StandardInput
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          error={errors.errorEmail}
          secureTextEntry={true}
        />
        <View style={styles.switchContainer}>
          <Text style={styles.stayConnectedTxt}>Rester connecté</Text>
          <Switch 
            value={stayConnected} 
            onValueChange={setStayConnected} 
            trackColor={{false:'lightgray', true:'#84DCC6'}} 
            thumbColor={stayConnected ? '#84DCC6' : 'gray'}
            style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
          />
        </View>
      </View>
      <View style={styles.fullWidthContainer}>
        <StandardButton
          label="Connexion"
        />
        <View style={styles.linkContainer}>
          <Text>Vous n'avez pas de compte?</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.link}
            //onPress={onPress}
          >
            <Text style={styles.linkTxt}>Inscrivez-vous</Text>
          </TouchableOpacity>
        </View>
        
      </View>
    </View>
  )
}

const styles = {
  container:{
    flex:1,
    backgroundColor:'white',
    padding:20,
    alignItems:'center',
    justifyContent:'space-between',
    paddingTop:50
  },
  fullWidthContainer:{
    width:'100%',
    alignItems:'center'
  },
  switchContainer:{
    width:'100%',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-end'
  },
  stayConnectedTxt:{
    marginRight:20,
    fontSize:16,
    fontWeight:'700'
  },
  linkContainer:{
    width:'100%',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-start'
  },
  link:{
    alignItems:'center',
    justifyContent:'center',
    marginLeft:10
  },
  linkTxt:{
    color:'#84DCC6'
  }
}

export default login