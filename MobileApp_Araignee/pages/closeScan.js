import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import StandardButton from '../components/StandardButton';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const CloseScan = () => {
  const { t } = useTranslation();
  const darkMode = useSelector((state) => state.parameters.darkmode);
  const navigation = useNavigation();

  const COLORS = {
    primary: darkMode ? '#84DCC6' : '#4B4E6D',
    textDark: darkMode ? '#FFFFFF' : '#4B4E6D',
    white: darkMode ? '#15202B' : '#FFFFFF',
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      backgroundColor: COLORS.white,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 20,
      color: COLORS.textDark,
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
      color: COLORS.textDark,
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: COLORS.primary,
    },
    buttonsContainer: {
      marginBottom: 20,
    },
  });

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

  const handleLaunchScan = useCallback(() => {
    console.log("Lancement du scan");
  }, []);

  const handleReturnHome = useCallback(() => {
    console.log("Retour à l'accueil");
  }, []);

  const StatItem = ({ label, value }) => (
    <View style={styles.statItem}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t('closeScan.title')}</Text>

      <View style={styles.content}>
        <View style={styles.statsContainer}>
          <StatItem label={t('closeScan.temperature')} value="20°C" />
          <StatItem label={t('closeScan.humidity')} value="80%" />
        </View>

        <View style={styles.buttonsContainer}>
          <StandardButton
            label={t('closeScan.return_home')}
            onPress={handleReturnHome}
          />
          <StandardButton
            label={t('closeScan.rescan')}
            color="green"
            onPress={handleLaunchScan}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CloseScan;