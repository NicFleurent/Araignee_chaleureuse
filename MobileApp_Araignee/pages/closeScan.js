import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import StandardButton from '../components/StandardButton';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const CloseScan = ({route}) => {
  const { t } = useTranslation();
  const darkMode = useSelector((state) => state.parameters.darkmode);
  const navigation = useNavigation();

  const {temperature, humidity} = route.params; 

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
    navigation.reset({
      index:0,
      routes:[
        {
          name:'Menu',
          params:{screen:'scanStack'}
        }
      ]
    })
  }, []);
  

  const handleReturnHome = useCallback(() => {
    navigation.reset({
      index:0,
      routes:[
        {
          name:'Menu',
          params:{screen:'Home'}
        }
      ]
    })
  }, []);

  const celsiusToFahrenheit = (celsius) => {
    return ((celsius * 9 / 5) + 32).toFixed(1);
  };

  const unit = useSelector((state) => state.parameters.temperature_humidity_unit);

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
          {unit == "farenheit" && <StatItem label={t('closeScan.temperature')} value= {celsiusToFahrenheit(temperature) + "°F"} /> || <StatItem label={t('closeScan.temperature')} value= {temperature + "°C"} />}
          
          <StatItem label={t('closeScan.humidity')} value={humidity+"%"} />
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