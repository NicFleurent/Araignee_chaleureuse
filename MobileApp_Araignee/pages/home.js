import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, FlatList, ScrollView } from 'react-native';
import Configuration from '../composants/Configuration';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../api/firebase';
import StandardButton from '../components/StandardButton';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getLocalUser } from '../api/secureStore';

const Home = () => {
  const [tempPrefs, setTempsPrefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const getPrefs = async () => {
      setLoading(true);
      const user = await getLocalUser();
      console.log(user.data.uid);
      try {
        const querySnapshot = await getDocs(collection(db, "comfort_preferences"));
        const list = [];
        querySnapshot.forEach((doc) =>  {

          console.log(doc.data().uid); 

          if(doc.userid === user.data.uid){
            const data = { id: doc.id, ...doc.data() };
            list.push(data);
          }
        });
        setTempsPrefs(list);
      } catch (error) {
        console.log("Erreur lors de la récupération : " + error);
      } finally {
        setLoading(false);
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
              setTempsPrefs((prev) => prev.filter((item) => item.id !== id));
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
          <ScrollView>
            {loading ? (
              <ActivityIndicator size="large" color="#4B4E6D" />
            ) : tempPrefs.length > 0 ? (
              tempPrefs.map((item) => (
                <Configuration
                  key={item.id}
                  season={item.name}
                  temperature={item.temperature}
                  humidity={item.humidity}
                  isActive={item.active}
                  onDelete={() => deletePrefs(item.id)}
                  onEdit={() => console.log("Editer : ", item.id)}
                />
              ))
            ) : (
              <Text>{t('home.no_configurations_found')}</Text>
            )}
          </ScrollView>
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
  configurationsContainer: {
    flex: 1,
    marginTop: 20,
  },
});

export default Home;