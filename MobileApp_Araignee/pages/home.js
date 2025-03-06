import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import Configuration from '../composants/Configuration';

const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Accueil</Text>

        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Ajouter une configuration</Text>
        </TouchableOpacity>

        <View style={styles.configurationsContainer}>
          <Configuration
            season="Été"
            temperature={-9}
            humidity={80}
            onDelete={() => console.log("Supprimé")}
            onEdit={() => console.log("Édité")}
          />
          <Configuration
            season="Hiver"
            temperature={-5}
            humidity={70}
            onDelete={() => console.log("Supprimé")}
            onEdit={() => console.log("Édité")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#4B4E6D',
  },
  addButton: {
    backgroundColor: '#84DCC6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginTop: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4B4E6D',
  },
  configurationsContainer: {
    marginTop: 20,
  },
});

export default Home;