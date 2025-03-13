import React, { useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import StandardButton from '../components/StandardButton';
import { useTranslation } from 'react-i18next'; 

const COLORS = {
  primary: '#84DCC6',
  secondary: '#4B4E6D',
  textDark: '#4B4E6D',
  white: '#FFFFFF',
};

const CloseScan = () => {
  const { t } = useTranslation(); 

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

export default CloseScan;