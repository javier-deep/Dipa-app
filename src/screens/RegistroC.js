import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AvatarDisplay from '../screens/AvatarDisplay'; // Asegúrate de que la ruta sea correcta

const RegistroC = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Barra de progreso con estrella */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar} />
        <Image source={require('../../assets/Estrella.png')} style={styles.starIcon} />
      </View>

      {/* Globo de diálogo */}
      <View style={styles.dialogBox}>
        <Text style={styles.dialogText}>¡Ya eres un rugidor oficial!</Text>
      </View>

      {/* Muestra el avatar personalizado */}
      <View style={styles.avatarContainer}>
        <AvatarDisplay size={250} />
      </View>

      {/* Botón para finalizar */}
      <TouchableOpacity
        style={styles.finishButton}
        onPress={() => navigation.navigate('Inicio')}
      >
        <Text style={styles.finishButtonText}>FINALIZAR</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 40,
  },
  progressBarContainer: {
    width: '90%',
    height: 25,
    backgroundColor: '#E0E0E0',
    borderRadius: 70,
    position: 'relative',
    marginBottom: 25,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  progressBar: {
    height: '100%',
    width: '100%',
    backgroundColor: '#2E4B9C',
    borderRadius: 70,
  },
  starIcon: {
    position: 'absolute',
    right: -9,
    top: -8,
    width: 60,
    height: 35,
    resizeMode: 'contain',
  },
  dialogBox: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  dialogText: {
    fontSize: 16,
    color: '#2E4B9C',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  avatarContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  
  finishButton: {
    backgroundColor: '#2E4B9C',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 55,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  finishButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
});

export default RegistroC;