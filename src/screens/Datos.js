import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from "expo-image";


export default function Datos({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Barra de progreso */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: '60%' }]} /> {/* 60% progreso */}
      </View>

      {/* Bienvenida */}
      <View style={styles.dialogContainer}>
        <Text style={styles.dialogText}>¡Bienvenido a tu manada, Álvaro Díaz!</Text>
      </View>

      {/* Imagen del león */}
      <Image
        source={require('../../assets/leon.gif')} 
        style={styles.image}
      />

      {/* Información del usuario */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Nombre: José Álvaro Díaz Plascencia</Text>
        <Text style={styles.infoText}>Rol: Bombero</Text>
        <Text style={styles.infoText}>Generación: Generación 17</Text>
        <Text style={styles.infoText}>ID: CUD2025000305</Text>
        <Text style={styles.infoText}>Sede: Guadalajara, Jal.</Text>
      </View>

      {/* Botón CONTINUAR */}
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => navigation.navigate('Avatar')}
      >
        <Text style={styles.continueButtonText}>CONTINUAR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  progressBarContainer: {
    width: '100%',
    height: 30,
    backgroundColor: '#e0e0e0',
    borderRadius: 70,
    marginTop: 75,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#0056b3',
  },
  dialogContainer: {
    marginVertical: 20,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
  },
  dialogText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0056b3',
    textAlign: 'center',
  },
  image: {
    width: 120,
    height: 120,
    marginVertical: 20,
  },
  infoContainer: {
    width: '90%',
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    marginVertical: 15,
    alignItems: 'flex-start', // Alinear texto a la izquierda
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
  },
  continueButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#0056b3',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});