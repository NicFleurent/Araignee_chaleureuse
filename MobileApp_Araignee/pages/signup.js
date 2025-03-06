//TODO::Ajuster le responsive pour la tablette

import { View, Text, Image, Switch, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import StandardInput from '../components/StandardInput';
import StandardButton from '../components/StandardButton';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../api/firebase';
import { saveLocalUser } from '../api/secureStore';

const signup = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState([]);
  const [stayConnected, setStayConnected] = useState(false);

  const handleSignup = async ()=>{
    if(validateForm()){
      try {
        const result = await createUserWithEmailAndPassword(auth, email, password)
        console.log(result.user)

        if(stayConnected){
          saveLocalUser(result.user)
        }

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
    const numberRegex = /\d/;
    const majRegex = /[A-Z]/;
    const minRegex = /[a-z]/;
    const specialCaracterRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if(email === "")
      tempErrors.errorEmail = t('input.error.email_required');
    else if(!emailRegex.test(email))
      tempErrors.errorEmail = t('input.error.email_invalid');

    if(password === "")
      tempErrors.errorPassword = t('input.error.password_required');
    else if(password.length < 6)
      tempErrors.errorPassword = t('input.error.password_min_length');
    else if (!numberRegex.test(password))
      tempErrors.errorPassword = t('input.error.password_number');
    else if (!majRegex.test(password))
      tempErrors.errorPassword = t('input.error.password_maj');
    else if (!minRegex.test(password))
      tempErrors.errorPassword = t('input.error.password_min');
    else if (!specialCaracterRegex.test(password))
      tempErrors.errorPassword = t('input.error.password_special_caracter');
    if (password != passwordConfirm)
      tempErrors.errorPasswordConfirm = t('input.error.passwordConfirm_required');
    
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
          <StandardInput
            placeholder={t('input.passwordConfirm')}
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
            error={errors.errorPasswordConfirm}
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
          label={t('auth.signup')}
          onPress={handleSignup}
        />
        <View style={styles.linkContainer}>
          <Text>{t('auth.alreadyAccount')}</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.link}
            onPress={()=>navigation.navigate('login')}
          >
            <Text style={styles.linkTxt}>{t('auth.connect')}</Text>
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
    justifyContent:'flex-end',
    paddingRight:10
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

export default signup