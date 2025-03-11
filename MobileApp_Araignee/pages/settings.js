import { View, Text, ScrollView, Image, Switch, Alert, Modal, Button } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { deleteLocalUser, getLocalUser } from '../api/secureStore';
import StandardButton from '../components/StandardButton';
import StandardDropdown from '../components/StandardDropdown';
// import init from 'react_native_mqtt';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import useAsyncStorage from '../hooks/useAsyncStorage';
import { setDarkMode, setLanguage, setTemperatureHumidityUnit } from '../stores/sliceParameters';
import { deleteUser, EmailAuthProvider, getAuth, reauthenticateWithCredential } from 'firebase/auth';
import Toast from 'react-native-toast-message';
import { auth } from '../api/firebase';
import StandardInput from '../components/StandardInput';

const settings = () => {

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {saveLocalData, getLocalData} = useAsyncStorage();
  const temperatureUnit = useSelector((state) => state.parameters.temperature_humidity_unit);
  const darkMode = useSelector((state) => state.parameters.darkmode);

  const { t, i18n } = useTranslation();
  const [user, setUser] = useState({});
  const [localLanguage, setLocalLanguage] = useState("");
  const [language, setLanguage] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  // const clientRef = useRef(null);
  // function onConnect() {
  //   console.log("onConnect");
  //   clientRef.current.subscribe("spider_object")
  // }
  // function onConnectionLost(responseObject) {
  //   if (responseObject.errorCode !== 0) {
  //     console.log("onConnectionLost:" + responseObject.errorMessage);
  //   }
  // }
  // function onMessageArrived(message) {
  //   console.log("onMessageArrived:" + message.payloadString);
  // }
  // const publishTest = ()=>{
  //   clientRef.current.publish("spider_app", "test",0,false)
  // }
  // useEffect(() => {
  //   init({
  //     size: 10000,
  //     storageBackend: AsyncStorage,
  //     defaultExpires: 1000 * 3600 * 24,
  //     enableCache: true,
  //     reconnect: true,
  //     sync: {},
  //   });
 
  //   clientRef.current = new Paho.MQTT.Client("172.16.207.219", 9001, "uname");
  //   clientRef.current.onConnectionLost = onConnectionLost;
  //   clientRef.current.onMessageArrived = onMessageArrived;
  //   clientRef.current.connect({ onSuccess:onConnect, useSSL: false });
  // }, []);


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
      setUser(user);
    }
    getUser();
  }, []);

  useEffect(() => {
    const getLocalLanguage = async () => {
      try {
        const language = await getLocalData(`${user.uid}_language`);
        setLanguage(language);
        setLocalLanguage(language);
      } catch (error) {
        console.log(error);
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: error,
        });
      }
    }
    getLocalLanguage();
  }, [user]);

  const openLanguageChangeAlert = () => {
    if (language && language !== localLanguage)
      Alert.alert(t('settings.language_confirm_title'), t('settings.language_reload_warning'), [
        {
          text: t('no'),
          onPress: () => { },
        },
        {
          text: t('yes'),
          onPress: () => { handleLanguageChange(language.value) }
        }

      ]);
    else if(language === localLanguage){
      alert(t('settings.language_already_chosen'))
    }
    else{
      alert(t('settings.language_choose_one'))
    }
  }

  const handleLanguageChange = (value) => {
    try {
      const language_key = `${user.uid}_language`
      saveLocalData(language_key, value)
      i18n.changeLanguage(value);
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: error,
      });
    }
  }

  const handleTempHumidChange = (value) => {
    try {
      const tempHumidUnit_key = `${user.uid}_tempHumidUnit`
      saveLocalData(tempHumidUnit_key, value)
      dispatch(setTemperatureHumidityUnit(value));
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: error,
      });
    }
  }
  const handleDarkmodeChange = (value) => {
    try {
      const darkmode_key = `${user.uid}_darkmode`
      saveLocalData(darkmode_key, value)
      dispatch(setDarkMode(value));
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: error,
      });
    }
  }

  const handleLogout = async ()=>{
    try {
      await deleteLocalUser();
      navigation.reset({
        index:0,
        routes:[
          {
            name:'login',
            params:{success:t('settings.logout_success')}
          }
        ]
      })
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('settings.logout_error'),
      });
    }
  }

  const openDeleteModal = () => {
    setDeleteModalVisible(true)
  }

  const handleDelete = async ()=>{
    if(validatedeleteForm()){
      const user = auth.currentUser;

      const credential = EmailAuthProvider.credential(user.email, password);

      reauthenticateWithCredential(user, credential)
        .then(() => {
          return deleteUser(user);
        })
        .then(async () => {
          try {
            await deleteLocalUser();
            navigation.reset({
              index:0,
              routes:[
                {
                  name:'login',
                  params:{success:t('settings.delete_account_success')}
                }
              ]
            })
          } catch (error) {
            console.log(error);
            Toast.show({
              type: 'error',
              text1: t('error'),
              text2: t('settings.delete_account_error'),
            });
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la suppression :", error);
          Toast.show({
            type: 'error',
            text1: t('error'),
            text2: t('settings.delete_account_error'),
          });
        });
    }
  }

  const validatedeleteForm = () => {
    let tempErrors = [];

    if(password === "")
      tempErrors.errorPassword = t('input.error.password_required');
    
    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.fullWidthContainer}>
          <StandardDropdown
            data={temperatureUnitData}
            value={temperatureUnit}
            onChange={(item) => handleTempHumidChange(item.value)}
            placeholder={t('settings.temperature_unit')}
          />
          <StandardDropdown
            data={languageData}
            value={language}
            onChange={setLanguage}
            placeholder={t('settings.language')}
          />
          <StandardButton
            label={t('settings.language_change')}
            color="green"
            onPress={openLanguageChangeAlert} 
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
          onPress={handleLogout}
        />
        <StandardButton
          label={t('settings.delete_account')}
          color="red"
          onPress={openDeleteModal}
        />
      </View>

      <Modal visible={deleteModalVisible}
        transparent={true}
        onRequestClose={()=>setDeleteModalVisible(false)}
      >
        <View style={styles.centre}>
          <View style={styles.modal}>
            <Text style={styles.modalTitleTxt}>{t('settings.delete_account')}</Text>
            <Text style={styles.modalTxt}>{t('settings.delete_account_modal_text')}</Text>
            <StandardInput
              placeholder={t('input.password')}
              value={password}
              onChangeText={setPassword}
              error={errors.errorPassword}
              secureTextEntry={true}
            />
            <StandardButton
              label={t('settings.delete_account')}
              color="red"
              onPress={handleDelete}
            />
          </View>
        </View>
      </Modal>


      <Toast position='top' bottomOffset={20} />
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
  },
  centre: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  modal: {
    width:'90%',
    backgroundColor: "white",
    borderRadius: 5,
    padding: 25,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitleTxt:{
    fontSize:24,
    fontWeight:'700',
    marginBottom:10
  },
  modalTxt:{
    fontSize:16,
    marginBottom:10
  }
}

export default settings