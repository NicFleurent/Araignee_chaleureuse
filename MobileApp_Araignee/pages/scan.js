import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash, faArrowUp, faArrowDown, faRotateLeft, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';

const COLORS = {
  primary: '#84DCC6',
  secondary: '#4B4E6D',
  textDark: '#4B4E6D',
  white: '#FFFFFF',
};

const Scan = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.buttonSecondary]}>
          <Text style={styles.buttonTextSecondary}>Arrêter</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>{navigation.navigate("closeScan")}} style={[styles.button, styles.buttonPrimary]}>
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
          <FontAwesomeIcon size={80} color={COLORS.secondary} icon={faArrowUp} />
        </View>

        <View style={styles.controlRow}>
          <FontAwesomeIcon size={80} color={COLORS.secondary} icon={faRotateLeft} />
          <FontAwesomeIcon size={80} color={COLORS.secondary} icon={faRotateRight} />
        </View>

        <View style={styles.controlIcon}>
          <FontAwesomeIcon size={80} color={COLORS.secondary} icon={faArrowDown} />
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