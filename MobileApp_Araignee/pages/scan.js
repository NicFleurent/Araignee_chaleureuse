import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowUp, faSquare, faArrowDown, faRotateLeft, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import init from 'react_native_mqtt';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StandardButton from '../components/StandardButton';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux'; 

const Scan = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const darkMode = useSelector((state) => state.parameters.darkmode); 
  const clientRef = useRef(null);

  useEffect(() => {
    if(darkMode)
      navigation.setOptions({
        headerStyle: {
            backgroundColor: '#15202B',
        },
        headerTintColor:'#fff',
        tabBarActiveBackgroundColor: "#15202B",
        tabBarInactiveBackgroundColor: "#15202B",
      });
    else
      navigation.setOptions({
        headerStyle: {
            backgroundColor: '#fff',
        },
        headerTintColor:'#000',
        tabBarActiveBackgroundColor: "#fff",
        tabBarInactiveBackgroundColor: "#fff",
      });
  }, [navigation, darkMode]);


  const COLORS = {
    primary: darkMode ? '#84DCC6' : '#4B4E6D',
    secondary: darkMode ? '#FFFFFF' : '#4B4E6D',
    textDark: darkMode ? '#FFFFFF' : '#4B4E6D',
    white: darkMode ? '#15202B' : '#FFFFFF',
  };

  const onConnect = useCallback(() => {
    console.log("onConnect");
    clientRef.current.subscribe("spider_object");
  }, []);

  const onConnectionLost = useCallback((responseObject) => {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:" + responseObject.errorMessage);
    }
  }, []);

  const onMessageArrived = useCallback((message) => {
    console.log("onMessageArrived:" + message.payloadString);
  }, []);

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
    console.log(command);
    // clientRef.current.publish("spider_app", command, 0, false);
  }, []);

  const ControlIcon = ({ icon, onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <FontAwesomeIcon size={80} color={COLORS.secondary} icon={icon} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: COLORS.white }]}>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <StandardButton
            label={t('scan.stop')}
            onPress={() => publish("arret")}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <StandardButton
            label={t('scan.finish')}
            color="green"
            onPress={() => {
              publish("arret");
              navigation.navigate("closeScan");
            }}
          />
        </View>
      </View>

      <View style={styles.dataContainer}>
        <View style={styles.dataItem}>
          <Text style={[styles.dataText, { color: COLORS.textDark }]}>-9°C</Text>
        </View>
        <View style={styles.dataItem}>
          <Text style={[styles.dataText, { color: COLORS.textDark }]}>80%</Text>
        </View>
      </View>

      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>

      <View style={styles.controlsContainer}>
        <ControlIcon icon={faArrowUp} onPress={() => publish("haut")} />
        <View style={styles.controlRow}>
          <ControlIcon icon={faRotateLeft} onPress={() => publish("gauche")} />
          <ControlIcon icon={faSquare} onPress={() => publish("arret")} />
          <ControlIcon icon={faRotateRight} onPress={() => publish("droit")} />
        </View>
        <ControlIcon icon={faArrowDown} onPress={() => publish("bas")} />
      </View>
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
  loaderContainer: {
    marginVertical: 40,
    alignItems: 'center',
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