//TODO::Ajuster le responsive pour la tablette

import { View, Text, Image, Switch, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import StandardInput from '../components/StandardInput'
import StandardButton from '../components/StandardButton';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { auth } from '../api/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getLocalUser, saveLocalUser } from '../api/secureStore';
import useAsyncStorage from '../hooks/useAsyncStorage';
import { useDispatch } from 'react-redux';
import { setDarkMode, setTemperatureHumidityUnit } from '../stores/sliceParameters';
import Toast from 'react-native-toast-message';
import { defineScreen } from '../stores/sliceScreen';

const login = ({route}) => {
  const {height, width} = useWindowDimensions();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const {getLocalData} = useAsyncStorage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [stayConnected, setStayConnected] = useState(false);

  const getParameters = async (user)=>{
    try {
      const tempHumidUnit = await getLocalData(`${user.uid}_tempHumidUnit`);
      const darkmode = await getLocalData(`${user.uid}_darkmode`);
      if(tempHumidUnit)
        dispatch(setTemperatureHumidityUnit(tempHumidUnit));
      if(darkmode)
        dispatch(setDarkMode(darkmode));

      return true
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: error,
      });
    }
  }

  useEffect(()=>{
    const validateUser = async ()=>{
      const user = await getLocalUser();
      if(user){
        const result = await getParameters(user);
        navigation.reset({
          index:0,
          routes:[
            {
              name:'Menu',
              params:{screen:'settings'}
            }
          ]
        })
      }
    }
    validateUser();
  },[])

  useEffect(()=>{
    if(route.params){
      if(route.params.success){
        Toast.show({
          type: 'success',
          text1: route.params.success
        });
      }
    }
  },[route])
  
  useEffect(()=>{
    setScreen(height, width);
  }, [height, width])

  const setScreen = (height, width)=>{
    const screen = {
      height:height,
      width:width
    }

    dispatch(defineScreen(screen));
  }

  const handleLogin = async ()=>{
    if(validateForm()){
      try {
        const result = await signInWithEmailAndPassword(auth, email, password)

        if(stayConnected){
          saveLocalUser(result.user)
        }
        
        await getParameters(result.user);
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
        let message;
        if(error.message = "Firebase: Error (auth/email-already-in-use).")
          message = t('auth.connexion_failed_credentials')
        else
          message = t('auth.connexion_failed')

        console.log(error);
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: message,
        });
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
      <Toast position='top' bottomOffset={20} />
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

export default login