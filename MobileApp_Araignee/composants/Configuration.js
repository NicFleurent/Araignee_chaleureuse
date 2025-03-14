import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

const COLORS = {
  primary: '#84DCC6',
  danger: '#F13030',
  backgroundLight: 'rgba(132, 220, 198, 0.25)',
  dangerLight: 'rgba(241, 48, 48, 0.3)',
  textDark: '#4B4E6D',
  textLight: '#FFFFFF',
  backgroundDark: '#15202B',
  borderDark: '#2C3A4D',
};

const Configuration = ({ season, temperature, humidity, isActive, onDelete, onEdit }) => {
  const darkMode = useSelector((state) => state.parameters.darkmode);

  const dynamicStyles = {
    container: {
      borderColor: darkMode ? COLORS.borderDark : COLORS.textDark,
      backgroundColor: darkMode ? COLORS.backgroundDark : '#FFFFFF',
    },
    title: {
      color: darkMode ? COLORS.textLight : COLORS.textDark,
    },
    value: {
      color: darkMode ? COLORS.textLight : COLORS.textDark,
    },
    status: {
      backgroundColor: isActive
        ? darkMode
          ? 'rgba(132, 220, 198, 0.25)'
          : COLORS.backgroundLight
        : COLORS.dangerLight,
    },
    statusText: {
      color: darkMode ? COLORS.textLight : COLORS.textDark,
    },
    deleteButton: {
      backgroundColor: darkMode ? 'rgba(241, 48, 48, 0.3)' : COLORS.dangerLight,
    },
    editButton: {
      backgroundColor: darkMode ? 'rgba(132, 220, 198, 0.25)' : COLORS.backgroundLight,
    },
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <View style={styles.header}>
        <Text numberOfLines={1} style={[styles.title, dynamicStyles.title]}>
          {season}
        </Text>
        <View style={styles.valuesContainer}>
          <Text style={[styles.value, dynamicStyles.value]}>{temperature}°C</Text>
          <Text style={[styles.value, styles.marginTop, dynamicStyles.value]}>
            {humidity}%
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View
          style={[
            styles.status,
            dynamicStyles.status,
          ]}
        >
          <Text style={[styles.statusText, dynamicStyles.statusText]}>
            {isActive ? 'Actif' : 'Inactif'}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton, dynamicStyles.deleteButton]}
            onPress={onDelete}
          >
            <FontAwesomeIcon size={24} color={COLORS.danger} icon={faTrash} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.editButton, dynamicStyles.editButton]}
            onPress={onEdit}
          >
            <FontAwesomeIcon size={24} color={COLORS.primary} icon={faPen} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    width: '50%',
  },
  valuesContainer: {
    alignItems: 'flex-end',
  },
  value: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  marginTop: {
    marginTop: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  status: {
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    padding: 10,
  },
  editButton: {
    marginLeft: 10,
  },
});

export default Configuration;