import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

const CloseScan = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Veuillez laisser le spider retourner au lieu indiqué</Text>

      <View style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Température</Text>
            <Text style={styles.statValue}>20°C</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Humidité</Text>
            <Text style={styles.statValue}>80%</Text>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.button, styles.buttonSecondary]}>
            <Text style={styles.buttonTextSecondary}>Retour a l’accueil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.buttonPrimary]}>
            <Text style={styles.buttonTextPrimary}>Refaire le scan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B4E6D',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#84DCC6',
  },
  buttonsContainer: {
    marginBottom: 20,
  },
  button: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonSecondary: {
    backgroundColor: '#4B4E6D',
  },
  buttonPrimary: {
    backgroundColor: '#84DCC6',
  },
  buttonTextSecondary: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buttonTextPrimary: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4B4E6D',
  },
});

export default CloseScan;