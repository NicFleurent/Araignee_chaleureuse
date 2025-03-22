import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, ScrollView, Alert, FlatList } from 'react-native';
import Configuration from '../components/Configuration';
import { useDispatch, useSelector } from 'react-redux';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../api/firebase';
import StandardButton from '../components/StandardButton';
import { useTranslation } from 'react-i18next';
import { getLocalUser } from '../api/secureStore';
import { useNavigation } from '@react-navigation/native';
import { setRefreshHome } from '../stores/sliceRefresh';
import Toast from 'react-native-toast-message';

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
        if(refreshHome){
          dispatch(setRefreshHome(false));
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: 'Erreur lors de la récupération.'
        });
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
              Toast.show({
                type: 'success',
                text1: 'Succès',
                text2: 'Configuration supprimé avec succès.'
              });
              console.log("Document supprimé avec succès");
              setTempsPrefs((prev) => prev.filter((item) => item.id !== id));
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Erreur',
                text2: 'Erreur lors de la suppression.'
              });
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
      key={item.id}
      season={item.name}
      temperature={item.temperature}
      humidity={item.humidity}
      isActive={item.active}
      onDelete={() => deletePrefs(item.id)}
      onEdit={() => navigation.navigate("addUpdateTempPrefs", { item: item })}/>
  );

  return (
    <SafeAreaView style={[styles.container, darkMode && styles.containerDarkmode]}>
      <View style={styles.content}>
        <View style={{ marginTop: 30 }}>
          <StandardButton
            label={t('home.add_configuration')}
            color="green"
            onPress={() => navigation.navigate("addUpdateTempPrefs")}
            darkMode={darkMode} 
          />
        </View>

        <View style={styles.configurationsContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#4B4E6D" />
          ) : (
            <FlatList
              data={tempPrefs}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={<Text>{t('home.no_configurations_found')}</Text>}
            />
          )}
        </View>
        <Toast position='top'/>
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