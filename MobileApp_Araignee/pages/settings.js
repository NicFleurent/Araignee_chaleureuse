import { View, Text, ScrollView, Image, Switch, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { getLocalUser } from '../api/secureStore';
import StandardButton from '../components/StandardButton';
import StandardDropdown from '../components/StandardDropdown';
import init from 'react_native_mqtt';
import AsyncStorage from '@react-native-async-storage/async-storage';

const settings = () => {
  const clientRef = useRef(null);

  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState("");
  const [temperatureUnit, setTemperatureUnit] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  function onConnect() {
    console.log("onConnect");
    clientRef.current.subscribe("spider_object")
  }

  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:" + responseObject.errorMessage);
    }
  }

  function onMessageArrived(message) {
    console.log("onMessageArrived:" + message.payloadString);
  }
  9
  useEffect(() => {
    init({
      size: 10000,
      storageBackend: AsyncStorage,
      defaultExpires: 1000 * 3600 * 24,
      enableCache: true,
      reconnect: true,
      sync: {},
    });
 
    clientRef.current = new Paho.MQTT.Client("172.16.207.219", 9001, "uname");
 
    clientRef.current.onConnectionLost = onConnectionLost;
    clientRef.current.onMessageArrived = onMessageArrived;
    clientRef.current.connect({ onSuccess:onConnect, useSSL: false });
  }, []);

  const publishTest = ()=>{
    clientRef.current.publish("spider_app", "test",0,false)
  }

  const languageData = [
    { label: 'Français', value: 'fr' },
    { label: 'English', value: 'en' },
  ]
  const temperatureUnitData = [
    { label: 'Celcius (°C)', value: 'celcius' },
    { label: 'Farenheit (°F)', value: 'farenheit' },
  ]

  useEffect(() => {
    const getUser = async () => {
      const user = await getLocalUser();
      //console.log(user.uid)
    }
    getUser();
  }, []);

  const openLanguageChangeAlert = (item) => {
    if (item)
      Alert.alert(t('settings.language_confirm_title'), t('settings.language_reload_warning'), [
        {
          text: t('no'),
          onPress: () => { },
        },
        {
          text: t('yes'),
          onPress: () => { handleLanguageChange(item.value) }
        }

      ]);
  }

  const handleLanguageChange = (value) => {
    i18n.changeLanguage(value);
  }

  const handleTempHumidChange = (value) => {
    setTemperatureUnit(value);
  }
  const handleDarkmodeChange = (value) => {
    setDarkMode(value);
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.fullWidthContainer}>
          <StandardDropdown
            data={languageData}
            value={language}
            onChange={setLanguage}
            placeholder={t('settings.language')}
          />
          <StandardButton
            label={t('settings.language_change')}
            color="green"
            onPress={publishTest} //() => openLanguageChangeAlert(language)
          />
          <StandardDropdown
            data={temperatureUnitData}
            value={temperatureUnit}
            onChange={(item) => handleTempHumidChange(item.value)}
            placeholder={t('settings.temperature_unit')}
          />
          <View style={styles.switchContainer}>
            <Text style={styles.stayConnectedTxt}>{t('settings.darkmode')}</Text>
            <Switch
              value={darkMode}
              onValueChange={(value) => handleDarkmodeChange(value)}
              trackColor={{ false: 'lightgray', true: '#84DCC6' }}
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
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  scrollView: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20
  },
  fullWidthContainer: {
    width: '100%',
    alignItems: 'center'
  },
  switchContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 10
  },
  stayConnectedTxt: {
    marginRight: 20,
    fontSize: 16,
    fontWeight: '700'
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20
  },
  linkContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  link: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10
  },
  linkTxt: {
    color: '#84DCC6'
  }
}

export default settings