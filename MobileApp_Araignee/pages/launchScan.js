import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

// Constantes pour les couleurs et les styles récurrents
const COLORS = {
  primary: '#84DCC6',
  textDark: '#4B4E6D',
};

const LaunchScan = () => {
  const navigation = useNavigation();

  const handleLaunchScan = () => {
    // Toast.show({
    //   type: 'error',
    //   text1: 'Attention',
    //   text2: 'Le robot doit être au sol',
    // });

    navigation.navigate('scan');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Scan de la pièce</Text>

      <View style={styles.content}>
        <TouchableOpacity onPress={handleLaunchScan} style={styles.button}>
          <Text style={styles.buttonText}>Lancer le scan</Text>
        </TouchableOpacity>
      </View>

      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.textDark,
    paddingLeft: 20,
    marginTop: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
});

export default LaunchScan;