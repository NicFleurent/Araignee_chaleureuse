import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import StandardButton from '../components/StandardButton';
import { useTranslation } from 'react-i18next'; 

const COLORS = {
  primary: '#84DCC6',
  textDark: '#4B4E6D',
};

const LaunchScan = () => {
  const navigation = useNavigation();
  const { t } = useTranslation(); 
  const handleLaunchScan = () => {
    // Toast.show({
    //   type: 'error',
    //   text1: t('launchScan.toast_title'), 
    //   text2: t('launchScan.toast_message'), 
    // });

    navigation.navigate('scan');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <StandardButton
          label={t('launchScan.start_scan')} 
          color="green"
          onPress={handleLaunchScan}
        />
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