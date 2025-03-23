import React, { useEffect, useRef, useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowUp, faSquare, faArrowDown, faRotateLeft, faRotateRight, faSpider } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../api/firebase';
import init from 'react_native_mqtt';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StandardButton from '../components/StandardButton';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux'; 
import Toast from 'react-native-toast-message';
import { getLocalUser } from '../api/secureStore';

const Scan = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const darkMode = useSelector((state) => state.parameters.darkmode); 
  const [conf, setConf] = useState({});
  const [loading, setLoading] = useState(true);
  const [isRobotEnable, setIsRobotEnable] = useState(true);
  const [isCollisionDetected, setIsCollisionDetected] = useState(false);
  const [isDangerousGaz, setIsDangerousGaz] = useState(false);
  const unit = useSelector((state) => state.parameters.temperature_humidity_unit);
  const clientRef = useRef(null);

  useEffect(() => {
    if (darkMode) {
      navigation.setOptions({
        headerStyle: {
          backgroundColor: '#15202B',
        },
        headerTintColor: '#fff',
        tabBarActiveBackgroundColor: "#15202B",
        tabBarInactiveBackgroundColor: "#15202B",
      });
    } else {
      navigation.setOptions({
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#000',
        tabBarActiveBackgroundColor: "#fff",
        tabBarInactiveBackgroundColor: "#fff",
      });
    }
  }, [navigation, darkMode]);

  useEffect(() => {
    const getPrefs = async () => {
      setLoading(true);
      const user = await getLocalUser();
      try {
        const querySnapshot = await getDocs(collection(db, "comfort_preferences"));
        querySnapshot.forEach((doc) => {
          if (doc.data().userId === user.data.uid && doc.data().active == true) {
            setConf(doc.data());
          }
        });
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: t('asyncStorage.get_error'),
        });
        console.log("Erreur lors de la récupération : " + error);
      } finally {
        setLoading(false);
      }
    };

    getPrefs();
  }, []);

  const COLORS = {
    primary: darkMode ? '#84DCC6' : '#4B4E6D',
    secondary: darkMode ? '#FFFFFF' : '#4B4E6D',
    textDark: darkMode ? '#FFFFFF' : '#4B4E6D',
    white: darkMode ? '#15202B' : '#FFFFFF',
    iconGray: darkMode ? '#A3A3A3' : '#737373',
  };

  const onConnect = useCallback(() => {
    console.log("Connected");
    clientRef.current.publish("spider_app", "start_detections", 0, false);
    clientRef.current.subscribe("spider_object");
  }, []);

  const onConnectionLost = useCallback((responseObject) => {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:" + responseObject.errorMessage);
      showAlertError(t('scan.connection_lost'));
      navigation.goBack();
    }
  }, []);

  const onMessageArrived = useCallback((message) => {
    console.log("onMessageArrived:", message.payloadString);
    
    try {
      const response = JSON.parse(message.payloadString);
      
      if (response.climat) {
        setConf(response.climat);
      }

      if (response.robotEnabled !== undefined) {
        setIsRobotEnable(response.robotEnabled);
        showAlertError(response.robotEnabled ? t('scan.robot_upright') : t('scan.robot_on_side'));
      }

      if (response.collision !== undefined) {
        setIsCollisionDetected(response.collision);
        showAlertError(response.collision ? t('scan.collision_detected') : t('scan.collision_cleared'));
      }

      if (response.dangerous_gas !== undefined) {
        setIsDangerousGaz(response.dangerous_gas);
        showAlertError(response.dangerous_gas ? t('scan.dangerous_gas_detected') : t('scan.dangerous_gas_cleared'));
      }

      if (response.final_spot !== undefined) {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'closeScan',
              params: {
                temperature: response.final_spot["temperature"],
                humidity: response.final_spot["humidity"],
              },
            },
          ],
        }); 
      }
    } catch (error) {
      console.error("Erreur lors du parsing du message MQTT:", error);
    }
  }, []);

  const showAlertError = (message) => {
    Alert.alert(t('error'), message);
  };

  const showAlertSuccess = (message) => {
    Alert.alert(t('warning'), message);
  };

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
    clientRef.current.connect({ onSuccess: onConnect, useSSL: false });

    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
      }
    };
  }, [onConnect, onConnectionLost, onMessageArrived]);

  const publish = useCallback((command) => {
    clientRef.current.publish("spider_app", command, 0, false);
  }, []);

  const ControlIcon = ({ icon, onPress, disabled }) => (
    <TouchableOpacity disabled={disabled} onPress={onPress}>
      <FontAwesomeIcon size={80} color={disabled ? COLORS.iconGray : COLORS.secondary} icon={icon} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: COLORS.white }]}>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <StandardButton
            label={t('scan.stop')}
            onPress={() => {
              publish("cancel");
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'launchScan',
                  },
                ],
              });
            }}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <StandardButton
            label={t('scan.finish')}
            color="green"
            onPress={() => {
              publish("finish");
              setIsRobotEnable(false);
              showAlertSuccess(t('closeScan.title'));
            }}
          />
        </View>
      </View>

      <View style={styles.dataContainer}>
        <View style={styles.dataItem}>
          <Text style={[styles.dataText, { color: COLORS.textDark }]}>
            {unit === "fahrenheit" ? celsiusToFahrenheit(conf.temperature) + "°F" : conf.temperature + "°C"}
          </Text>
        </View>
        <View style={styles.dataItem}>
          <Text style={[styles.dataText, { color: COLORS.textDark }]}>{conf.humidity}%</Text>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <ControlIcon disabled={isCollisionDetected || !isRobotEnable} icon={faArrowUp} onPress={() => publish("forward")} />
        <View style={styles.controlRow}>
          <ControlIcon disabled={!isRobotEnable} icon={faRotateLeft} onPress={() => publish("turn_left")} />
          <ControlIcon disabled={!isRobotEnable} icon={faSpider} onPress={() => publish("stand")} />
          <ControlIcon disabled={!isRobotEnable} icon={faRotateRight} onPress={() => publish("turn_right")} />
        </View>
        <ControlIcon disabled={!isRobotEnable} icon={faArrowDown} onPress={() => publish("backward")} />
      </View>
      <Toast position='top' />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonWrapper: {
    width: "48%",
  },
  dataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  dataItem: {
    flex: 1,
    alignItems: 'center',
  },
  dataText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  controlsContainer: {
    alignItems: 'center',
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginVertical: 20,
  },
});

export default Scan;