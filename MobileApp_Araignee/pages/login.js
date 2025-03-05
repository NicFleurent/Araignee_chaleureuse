//TODO::Ajuster le responsive pour la tablette

import { View, Text, Image, Switch, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import StandardInput from '../components/StandardInput'
import StandardButton from '../components/StandardButton';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const login = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [stayConnected, setStayConnected] = useState(false);

  const handleLogin = async ()=>{
    if(validateForm()){
      try {
        //Connexion avec Firebase

        //Sauvegarder de la connexion si le rester connecté est coché
        //SecureStore

        navigation.reset({
          index:0,
          routes:[
            {
              name:'Menu',
              params:{screen:'home'}
            }
          ]
        })
      } catch (error) {
        //Toast?
        console.log(error);
      }
    }
  }
  
  const validateForm = () => {
    let tempErrors = [];

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if(email === "")
      tempErrors.errorEmail = t('input.error.email_required');
    else if(!emailRegex.test(email))
      tempErrors.errorEmail = t('input.error.email_invalid');

    if(password === "")
      tempErrors.errorPassword = t('input.error.password_required');
    
    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.fullWidthContainer}>
          <Image source={require("../assets/spider-bot.png")} />
          <StandardInput
            placeholder={t('input.email')}
            value={email}
            onChangeText={setEmail}
            keyboardType='email-address'
            error={errors.errorEmail}
          />
          <StandardInput
            placeholder={t('input.password')}
            value={password}
            onChangeText={setPassword}
            error={errors.errorPassword}
            secureTextEntry={true}
          />
          <View style={styles.switchContainer}>
            <Text style={styles.stayConnectedTxt}>{t('auth.stayConnected')}</Text>
            <Switch 
              value={stayConnected} 
              onValueChange={setStayConnected} 
              trackColor={{false:'lightgray', true:'#84DCC6'}} 
              thumbColor={stayConnected ? '#84DCC6' : 'gray'}
              style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <StandardButton
          label={t('auth.connexion')}
          onPress={handleLogin}
        />
        <View style={styles.linkContainer}>
          <Text>{t('auth.noAccount')}</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.link}
            onPress={()=>navigation.navigate('signup')}
          >
            <Text style={styles.linkTxt}>{t('auth.subscribe')}</Text>
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
    justifyContent:'space-between'
  },
  scrollView:{
    alignItems:'center',
    justifyContent:'space-between',
    paddingTop:20
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
  buttonContainer:{
    width:'100%',
    alignItems:'center',
    marginTop:20
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