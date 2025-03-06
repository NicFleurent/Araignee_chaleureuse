import { View, Text, ScrollView, Image, Switch } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { getLocalUser } from '../api/secureStore';
import StandardButton from '../components/StandardButton';
import StandardDropdown from '../components/StandardDropdown';

const settings = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [language, setLanguage] = useState("");
  const [temperatureUnit, setTemperatureUnit] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const languageData = [
    { label: 'Français', value: 'fr' },
    { label: 'English', value: 'en' },
  ]
  const temperatureUnitData = [
    { label: 'Celcius (°C)', value: 'celcius' },
    { label: 'Farenheit (°F)', value: 'farenheit' },
  ]

  useEffect(()=>{
      const getUser = async ()=>{
        const user = await getLocalUser();
        //console.log(user.uid)
      }
      getUser();
    },[]);

  const handleLanguageChange = (value)=>{
    setLanguage(value);
  }
  const handleTempHumidChange = (value)=>{
    setTemperatureUnit(value);
  }
  const handleDarkmodeChange = (value)=>{
    setDarkMode(value);
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.fullWidthContainer}>
          <StandardDropdown
            data={languageData}
            value={language}
            onChange={(item)=>handleLanguageChange(item.value)}
            placeholder={t('settings.language')}
          />
          <StandardDropdown
            data={temperatureUnitData}
            value={temperatureUnit}
            onChange={(item)=>handleTempHumidChange(item.value)}
            placeholder={t('settings.temperature_unit')}
          />
          <View style={styles.switchContainer}>
            <Text style={styles.stayConnectedTxt}>{t('settings.darkmode')}</Text>
            <Switch 
              value={darkMode} 
              onValueChange={(value)=>handleDarkmodeChange(value)} 
              trackColor={{false:'lightgray', true:'#84DCC6'}} 
              thumbColor={darkMode ? '#84DCC6' : 'gray'}
              style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <StandardButton
          label={t('auth.logout')}
          color="green"
          //onPress={handleLogin}
        />
        <StandardButton
          label={t('settings.delete_account')}
          color="red"
          //onPress={handleLogin}
        />
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

export default settings