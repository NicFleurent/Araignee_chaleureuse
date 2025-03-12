import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {faArrowUp, faSquare, faArrowDown, faRotateLeft, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import init from 'react_native_mqtt';
import AsyncStorage from '@react-native-async-storage/async-storage';

  const COLORS = {
    primary: '#84DCC6',
    secondary: '#4B4E6D',
    textDark: '#4B4E6D',
    white: '#FFFFFF',
  };

const Scan = () => {
  const navigation = useNavigation();

  const clientRef = useRef(null);
  const intervalRef = useRef(null);

  const startPublishing = (command) => {
    intervalRef.current = setInterval(() => {
      publish(command);
    }, 100);
  };

  const stopPublishing = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

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

  const publish = (command)=>{
    //clientRef.current.publish("spider_app", command,0,false);
    console.log(command)
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={()=>publish("arret")} style={[styles.button, styles.buttonSecondary]}>
          <Text style={styles.buttonTextSecondary}>Arrêter</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>{
          publish("arret");
          navigation.navigate("closeScan");
          }} style={[styles.button, styles.buttonPrimary]}>
          <Text style={styles.buttonTextPrimary}>Terminer</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dataContainer}>
        <View style={styles.dataItem}>
          <Text style={styles.dataText}>-9°C</Text>
        </View>

        <View style={styles.dataItem}>
          <Text style={styles.dataText}>80%</Text>
        </View>
      </View>

      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>

      <View style={styles.controlsContainer}>
        <View style={styles.controlIcon}>
         <TouchableOpacity
            onPressIn={() => startPublishing("haut")} 
            onPressOut={stopPublishing} 
          >
            <FontAwesomeIcon size={80} color={COLORS.secondary} icon={faArrowUp} />
          </TouchableOpacity>
        </View>

        <View style={styles.controlRow}>
          <TouchableOpacity
            onPressIn={() => startPublishing("gauche")} 
            onPressOut={stopPublishing} 
          >
            <FontAwesomeIcon size={80} color={COLORS.secondary} icon={faRotateLeft} />
          </TouchableOpacity>

          <TouchableOpacity
            onPressIn={() => startPublishing("arret")}
            onPressOut={stopPublishing}
          >
            <FontAwesomeIcon size={80} color={COLORS.secondary} icon={faSquare} />
          </TouchableOpacity>

          <TouchableOpacity
            onPressIn={() => startPublishing("droit")}
            onPressOut={stopPublishing}
          >
            <FontAwesomeIcon size={80} color={COLORS.secondary} icon={faRotateRight} />
          </TouchableOpacity>
        </View>

        <View style={styles.controlIcon}>
          <TouchableOpacity 
            onPressIn={() => startPublishing("bas")} 
            onPressOut={stopPublishing} >
            <FontAwesomeIcon size={80} color={COLORS.secondary} icon={faArrowDown} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    marginLeft: 15,
  },
  buttonSecondary: {
    backgroundColor: COLORS.secondary,
    marginRight: 15,
  },
  buttonTextPrimary: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  buttonTextSecondary: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
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
    color: COLORS.textDark,
  },
  loaderContainer: {
    marginVertical: 40,
    alignItems: 'center',
  },
  controlsContainer: {
    alignItems: 'center',
  },
  controlIcon: {
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