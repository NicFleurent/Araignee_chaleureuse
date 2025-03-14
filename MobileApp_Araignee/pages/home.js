import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, ScrollView, Alert } from 'react-native';
import Configuration from '../composants/Configuration';
import { useDispatch, useSelector } from 'react-redux';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../api/firebase';
import StandardButton from '../components/StandardButton';
import { useTranslation } from 'react-i18next';
import { getLocalUser } from '../api/secureStore';
import { useNavigation } from '@react-navigation/native';
import { setRefreshHome } from '../stores/sliceRefresh';

const Home = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const refreshHome = useSelector((state) => state.refresh.refreshHome);
  const darkMode = useSelector((state) => state.parameters.darkmode); 
  const [tempPrefs, setTempsPrefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    if (darkMode) {
      navigation.setOptions({
        headerStyle: {
          backgroundColor: '#15202B',
        },
        headerTintColor: '#fff',
      });
    } else {
      navigation.setOptions({
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#000',
      });
    }
  }, [navigation, darkMode]);

  useEffect(() => {
    const getPrefs = async () => {
      setLoading(true);
      const user = await getLocalUser();
      console.log(user.data.uid);
      try {
        const querySnapshot = await getDocs(collection(db, "comfort_preferences"));
        const list = [];
        querySnapshot.forEach((doc) => {
          if (doc.data().userId === user.data.uid) {
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
  }, [refreshHome]);

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

  return (
    <SafeAreaView style={[styles.container, darkMode && styles.containerDarkmode]}>
      <View style={styles.content}>
        <View style={{ marginTop: 30 }}>
          <StandardButton
            label={t('home.add_configuration')}
            color="green"
            onPress={() => navigation.navigate("addUpdateTempPrefs", { updating: false })}
            darkMode={darkMode} 
          />
        </View>

        <View style={styles.configurationsContainer}>
          <ScrollView>
            {loading ? (
              <ActivityIndicator size="large" color={darkMode ? '#84DCC6' : '#4B4E6D'} />
            ) : tempPrefs.length > 0 ? (
              tempPrefs.map((item) => (
                <Configuration
                  key={item.id}
                  season={item.name}
                  temperature={item.temperature}
                  humidity={item.humidity}
                  isActive={item.active}
                  onDelete={() => deletePrefs(item.id)}
                  onEdit={() => navigation.navigate("addUpdateTempPrefs", { updating: true, id: item.id })}
                  //darkMode={true} 
                />
              ))
            ) : (
              <Text style={[styles.noConfigurationsText, darkMode && styles.noConfigurationsTextDarkmode]}>
                {t('home.no_configurations_found')}
              </Text>
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
  containerDarkmode: {
    backgroundColor: '#15202B', 
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  configurationsContainer: {
    flex: 1,
    marginTop: 20,
  },
  noConfigurationsText: {
    color: '#000', 
    textAlign: 'center',
    marginTop: 20,
  },
  noConfigurationsTextDarkmode: {
    color: '#fff', 
  },
});

export default Home;