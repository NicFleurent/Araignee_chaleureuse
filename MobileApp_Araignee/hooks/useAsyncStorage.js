import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

const useAsyncStorage = () => {
  const {t} = useTranslation();

  const saveLocalData = async (key, object) => {
    try {
      const jsonObject = JSON.stringify(object);
      await AsyncStorage.setItem(key, jsonObject);
    } catch (e) {
      console.error("Erreur lors de la sauvegarde", e);
      throw new Error(t('asyncStorage.save_error'));
    }
  };

  const getLocalData = async (key) => {
    try {
      const jsonObject = await AsyncStorage.getItem(key);
      const object = JSON.parse(jsonObject);
      return object;
    } catch (e) {
      console.error("Erreur lors de la récupération", e);
      throw new Error(t('asyncStorage.get_error'));
    }
  };


  return {
    saveLocalData,
    getLocalData
  };
}

export default useAsyncStorage;