import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';

const COLORS = {
  primary: '#84DCC6',
  danger: '#F13030',
  backgroundLight: 'rgba(132, 220, 198, 0.25)',
  dangerLight: 'rgba(241, 48, 48, 0.3)',
  textDark: '#4B4E6D',
};

const Configuration = ({ season, temperature, humidity, isActive, onDelete, onEdit }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text numberOfLines={1} style={styles.title}>{season}</Text>
        <View style={styles.valuesContainer}>
          <Text style={styles.value}>{temperature}°C</Text>
          <Text style={[styles.value, styles.marginTop]}>{humidity}%</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={[styles.status, isActive ? styles.statusActive : styles.statusNotActive]}>
          <Text style={styles.statusText}>{isActive ? 'Actif' : 'Inactif'}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={onDelete}>
            <FontAwesomeIcon size={24} color={COLORS.danger} icon={faTrash} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.editButton]} onPress={onEdit}>
            <FontAwesomeIcon size={24} color={COLORS.primary} icon={faPen} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: COLORS.textDark,
    borderWidth: 2,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:"flex-start"
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.textDark,
    width: '50%',
  },
  valuesContainer: {
    alignItems: 'flex-end',
  },
  value: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.textDark,
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
  statusActive: {
    backgroundColor: COLORS.backgroundLight,
  },
  statusNotActive: {
    backgroundColor: COLORS.dangerLight,
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.textDark,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    padding: 10,
  },
  deleteButton: {
    backgroundColor: COLORS.dangerLight,
  },
  editButton: {
    backgroundColor: COLORS.backgroundLight,
    marginLeft: 10,
  },
});

export default Configuration;