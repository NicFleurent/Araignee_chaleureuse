import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import Configuration from '../composants/Configuration';
import { useSelector } from 'react-redux';
import { collection, getDocs   } from 'firebase/firestore';
import { db } from '../api/firebase';
import useBD from '../hooks/useBD'; 

const Home = () => {
  const [tempPrefs, setTempsPrefs] = useState([]);
  const { prefs, getPrefsLocal, ajouterPrefsLocal, supprimerPrefsLocal, supprimerToutPrefsLocal } = useBD(); 

  useEffect(() => {
    const getPrefs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "comfort_preferences"));
        const list = [];
        supprimerToutPrefsLocal();
        querySnapshot.forEach((doc) => {
          const data = { id: doc.id, ...doc.data() };
          list.push(data);
          ajouterPrefsLocal(data.active, data.humidity, data.name, data.temperature);
        });
        setTempsPrefs(list);
      } catch (error) {
        console.log("Erreur lors de la récupération : " + error);
        getPrefsLocal();
        setTempsPrefs(prefs);
      }
    };

    getPrefs();
  }, []);

  const deletePrefs = async (id) => {
    try {
      await deleteDoc(doc(db, "comfort_preferences", id));

      console.log("Document supprimé avec succès");
      supprimerPrefsLocal(id);
      getPrefs(); 
    } catch (error) {
      console.log("Erreur lors de la suppression : " + error);
    }
  };

  const temperatureUnit = useSelector((state) => state.parameters.temperature_humidity_unit);

  const renderItem = ({ item }) => (
    <Configuration
      season={item.name}
      temperature={item.temperature}
      humidity={item.humidity}
      isActive={item.active}
      onDelete={() =>{
        deletePrefs(item.id);
      }}
      onEdit={() => console.log("Editer : ", item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Accueil</Text>

        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Ajouter une configuration</Text>
        </TouchableOpacity>

        <View style={styles.configurationsContainer}>
          <FlatList
            data={tempPrefs}
            renderItem={renderItem}
            keyExtractor={(item) => item.id} 
            ListEmptyComponent={<Text>Aucune configuration trouvée.</Text>}
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
    marginTop: 40,
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