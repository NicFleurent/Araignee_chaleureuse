import { View, Text, ScrollView, Switch, ActivityIndicator, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import StandardInput from '../../components/StandardInput'
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import StandardButton from '../../components/StandardButton';
import { getLocalUser } from '../../api/secureStore';
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../api/firebase';
import Toast from 'react-native-toast-message';
import { setRefreshHome } from '../../stores/sliceRefresh';

const addUpdateTempPrefs = ({route}) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const temperatureUnit = useSelector((state) => state.parameters.temperature_humidity_unit);
  const darkMode = useSelector((state) => state.parameters.darkmode);
  const isTablet = useSelector((state) => state.screen.isTablet);

  const [isLoading, setIsLoading] = useState("");
  const [userId, setUserId] = useState("");
  const [updateDocId, setUpdateDocId] = useState("");
  const [name, setName] = useState("");
  const [temperature, setTemperature] = useState();
  const [humidity, setHumidity] = useState();
  const [isActive, setIsActive] = useState(false);

  const [errors, setErrors] = useState([])
  
  useEffect(() => {
    const getUser = async () => {
      const user = await getLocalUser();
      setUserId(user.data.uid);
    }
    getUser();
  }, []);

  useEffect(()=>{
    if(route.params?.item){
      const item = route.params.item
      setUpdateDocId(item.id)
      setIsActive(item.active)
      setName(item.name)
      setHumidity(item.humidity)

      let fahrenheitTemp;
      if(temperatureUnit === "farenheit"){
        fahrenheitTemp = celsiusToFahrenheit(item.temperature);
        setTemperature(fahrenheitTemp);
      }else{
        setTemperature(item.temperature);
      }
      
    }
  }, [route])

  useEffect(() => {
      if(darkMode)
        navigation.setOptions({
          title: route.params?.item ? route.params.item.name : t('addUpdate.title'),
          headerStyle: {
              backgroundColor: '#15202B',
          },
          headerTintColor:'#fff',
        });
      else
        navigation.setOptions({
          headerStyle: {
              backgroundColor: '#fff',
          },
          headerTintColor:'#000',
        });
    }, [navigation, darkMode]);
  
  const handleSave = async ()=>{
    if(validateForm()){
      setIsLoading(true);
      let celciusTemp = temperature;
      let modifiedDocId;
      if(temperatureUnit === "farenheit")
        celciusTemp = fahrenheitToCelsius(celciusTemp);

      if(updateDocId){
        await updateToFirebase(celciusTemp);
        modifiedDocId = updateDocId;
      }
      else{
        const docAddResult = await addToFirebase(celciusTemp);
        modifiedDocId = docAddResult.id;
      }


      if(isActive)
        await updateActivePref(modifiedDocId);

      dispatch(setRefreshHome(true));
      setIsLoading(false);
      navigation.goBack();
    }
  }

  const validateForm = () => {
    let tempErrors = {};

    const decimalRegex = /^\d+(\.\d{1})?$/;
    const numberRegex = /^\d+$/;

    if (name.trim() === "")
        tempErrors.errorName = t('input.error.name_required');

    if (temperature === undefined)
        tempErrors.errorTemperature = t('input.error.temperature_required');
    else if (!decimalRegex.test(temperature))
        tempErrors.errorTemperature = t('input.error.temperature_invalid'); 

    if (humidity === undefined)
        tempErrors.errorHumidity = t('input.error.humidity_required');
    else if (humidity < 0 || humidity > 100 || (!numberRegex.test(humidity)))
        tempErrors.errorHumidity = t('input.error.humidity_invalid');

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  }

  const fahrenheitToCelsius = (fahrenheit) => {
    return ((fahrenheit - 32) * 5 / 9).toFixed(1);
  };
  const celsiusToFahrenheit = (celsius) => {
    return ((celsius * 9 / 5) + 32).toFixed(1);
  };

  const addToFirebase = async (temperature)=>{
    const newTempPref = {
      userId:userId,
      name:name,
      temperature:temperature,
      humidity:humidity,
      active:isActive
    }

    try {
      const result = await addDoc(collection(db, "comfort_preferences"), newTempPref);
      if(result)
        return result;
      else
        throw new Error("");
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('addUpdate.error_add'),
      });
    }
  }

  const updateToFirebase = async (temperature)=>{
    const docRef = doc(db, "comfort_preferences", updateDocId);
    const docSnap = await getDoc(docRef);

    const updatedTempPref = {
      name:name,
      temperature:temperature,
      humidity:humidity,
      active:isActive
    }

    try {
      await updateDoc(docSnap.ref, updatedTempPref);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('addUpdate.error_update'),
      });
    }
  }

  const updateActivePref = async (docId)=>{
    const preferences = await getUserComfortPreferences();
    preferences.map(async (preferenceDoc)=>{
      if(preferenceDoc.id === docId){
        await updateDoc(preferenceDoc.ref, {"active":true})
      }
      else{
        await updateDoc(preferenceDoc.ref, {"active":false})
      }
    })
  }

  const getUserComfortPreferences = async () => {
    try {
      const comfortRef = collection(db, "comfort_preferences");
      const q = query(comfortRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      let preferences = [];
      querySnapshot.forEach((doc) => {
          preferences.push(doc);
      });
      return preferences;
    } catch (error) {
      console.error("Erreur lors de la récupération des préférences :", error);
      return [];
    }
};

  return (
    <View style={[styles.container, darkMode && styles.containerDarkmode, isTablet && styles.containerTablet]}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.fullWidthContainer}>
          <Text style={[styles.inputLabel, darkMode && styles.inputLabelDarkmode]}>{t('input.name')}</Text>
          <StandardInput
            value={name}
            onChangeText={setName}
            error={errors.errorName}
            darkMode={darkMode}
          />
          <Text style={[styles.inputLabel, darkMode && styles.inputLabelDarkmode]}>{t('input.temperature')} ({temperatureUnit === "celcius" ? "°C" : "°F"})</Text>
          <StandardInput
            value={temperature}
            onChangeText={setTemperature}
            error={errors.errorTemperature}
            darkMode={darkMode}
            keyboardType="decimal-pad"
          />
          <Text style={[styles.inputLabel, darkMode && styles.inputLabelDarkmode]}>{t('input.humidity')} (%)</Text>
          <StandardInput
            value={humidity}
            onChangeText={setHumidity}
            error={errors.errorHumidity}
            darkMode={darkMode}
            keyboardType="number-pad"
          />
          <View style={styles.switchContainer}>
            <Text style={[styles.stayConnectedTxt, darkMode && styles.stayConnectedTxtDarkmode]}>{t('addUpdate.activate')}</Text>
            <Switch
              value={isActive}
              onValueChange={(value) => setIsActive(value)}
              trackColor={{ false: 'lightgray', true: '#84DCC6' }}
              thumbColor={isActive ? '#84DCC6' : 'gray'}
              style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <StandardButton
            label={t('button.cancel')}
            onPress={()=>navigation.goBack()}
          />
        </View>
        <View style={styles.buttonContainer}>
          <StandardButton
            label={t('button.save')}
            color="green"
            onPress={handleSave}
          />
        </View>
      </View>

      {isLoading && (
        <View style={loadingStyles.overlay}>
          <ActivityIndicator size="large" color={darkMode ? '#84DCC6' : '#4B4E6D'} />
        </View>
      )}

      <Toast position='top' bottomOffset={20} />
    </View>
  )
}

const styles = {
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerTablet:{
    padding: 150
  },
  containerDarkmode:{
    backgroundColor:'#15202B'
  },
  scrollView: {
    alignItems: 'center',
    justifyContent: 'space-between',
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
  stayConnectedTxtDarkmode:{
    color:'#fff'
  },
  buttonsContainer: {
    flexDirection:'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 20
  },
  buttonContainer: {
    width: '47%',
  },
  inputLabel:{
    width:'100%',
    fontSize:16,
    paddingBottom:5
  },
  inputLabelDarkmode:{
    color:'white'
  }
}

const loadingStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default addUpdateTempPrefs