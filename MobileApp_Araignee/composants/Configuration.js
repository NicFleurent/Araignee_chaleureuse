import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTrash, faPen } from "@fortawesome/free-solid-svg-icons";

const Configuration = ({ season, temperature, humidity, onDelete, onEdit }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{season}</Text>
        <View>
          <Text style={styles.value}>{temperature}°C</Text>
          <Text style={[styles.value, styles.marginTop]}>{humidity}%</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.status}>
          <Text style={styles.statusText}>Actif</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <FontAwesomeIcon size={24} color="#F13030" icon={faTrash} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <FontAwesomeIcon size={24} color="#84DCC6" icon={faPen} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: "black",
    borderWidth: 2,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
  },
  value: {
    fontSize: 36,
    fontWeight: "bold",
  },
  marginTop: {
    marginTop: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 35,
  },
  status: {
    backgroundColor: "rgba(132, 220, 198, 0.25)",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  statusText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  deleteButton: {
    backgroundColor: "rgba(241, 48, 48, 0.3)",
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  editButton: {
    backgroundColor: "rgba(132, 220, 198, 0.25)",
    marginLeft: 20,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
});

export default Configuration;
