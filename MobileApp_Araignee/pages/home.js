import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Configuration from '../composants/Configuration';

const home = () => {
  return (
    <View style={styles.container}>
      <Text style={{fontSize:36,fontWeight:"bold"}}>Accueil</Text>

      <View style={{backgroundColor:"#84DCC6", alignItems:"center", marginTop: 80}}>
        <Text style={{paddingVertical: 13, fontWeight:"bold", fontSize:20}}>Ajouter une configuration</Text>
      </View>

      <View style={{marginTop: 20}}>
        <Configuration 
        season="Été" 
        temperature={-9} 
        humidity={80} 
        onDelete={() => console.log("Supprimé")} 
        onEdit={() => console.log("Édité")}
      />
      </View>

      <View style={{marginTop: 20}}>
        <Configuration 
        season="Été" 
        temperature={-9} 
        humidity={80} 
        onDelete={() => console.log("Supprimé")} 
        onEdit={() => console.log("Édité")}
      />
      </View>
      
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    backgroundColor: "white",
    flex: 1,
    paddingHorizontal: 20,
  }
});

export default home