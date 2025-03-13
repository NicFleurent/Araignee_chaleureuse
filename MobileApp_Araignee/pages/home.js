import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, FlatList } from 'react-native';
import Configuration from '../composants/Configuration';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../api/firebase';
import useBD from '../hooks/useBD'; 
import StandardButton from '../components/StandardButton';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next'; 

const Home = () => {
  const [tempPrefs, setTempsPrefs] = useState([]);
  const [loading, setLoading] = useState(true);
  //const { prefs, getPrefsLocal, ajouterPrefsLocal, supprimerPrefsLocal, supprimerToutPrefsLocal } = useBD(); 
  const { t } = useTranslation(); 

  useEffect(() => {
    const getPrefs = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "comfort_preferences"));
        const list = [];
        //supprimerToutPrefsLocal();
        querySnapshot.forEach((doc) => {
          const data = { id: doc.id, ...doc.data() };
          list.push(data);
          //ajouterPrefsLocal(data.active, data.humidity, data.name, data.temperature);
          console.log("test3");
        });
        console.log("test4");
        setTempsPrefs(list);
        console.log("test5");
      } catch (error) {
        console.log("Erreur lors de la récupération : " + error);
        getPrefsLocal();
        setTempsPrefs(prefs);
        console.log("test6");
      } finally {
        setLoading(false); 
        console.log("test7");
      }
    };

    getPrefs();
  }, []);

  const deletePrefs = async (id) => {
    Alert.alert(
      t('home.confirm_delete_title'), 
      t('home.confirm_delete_message'), 
      [
        {
          text: t('no'), 
          style: "cancel", 
        },
        {
          text: t('yes'), 
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "comfort_preferences", id)); 
              console.log("Document supprimé avec succès");
              supprimerPrefsLocal(id); 
              getPrefs(); 
            } catch (error) {
              console.log("Erreur lors de la suppression : " + error);
            }
          },
          style: "destructive", 
        },
      ],
      { cancelable: true } 
    );
  };

  const renderItem = ({ item }) => (
    <Configuration
      season={item.name}
      temperature={item.temperature}
      humidity={item.humidity}
      isActive={item.active}
      onDelete={() => deletePrefs(item.id)}
      onEdit={() => console.log("Editer : ", item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        <View style={{ marginTop: 30 }}>
          <StandardButton
              label={t('home.add_configuration')} 
              color="green" 
          />
        </View>
        
        <View style={styles.configurationsContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#4B4E6D" />
          ) : (
            <FlatList
              data={tempPrefs === null || []}
              renderItem={renderItem}
              keyExtractor={(item) => item.id} 
              ListEmptyComponent={<Text>{t('home.no_configurations_found')}</Text>} 
            />
          )}
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
  configurationsContainer: {
    flex: 1,
    marginTop: 20,
  },
});

export default Home;