import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from "expo-image";

export default function Empecemos({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.dialogContainer}>
        <Text style={styles.speechBubble}>¡Hola! Yo soy Maxnic.</Text>
      </View>
      <View style={styles.imageAndButtonContainer}>
        <Image
          source={require('../../assets/leon.gif')} // Asegúrate de que el archivo esté en la ruta correcta
          style={styles.image}
        />
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate('Continuar')}
        >
          <Text style={styles.continueButtonText}>CONTINUAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Fondo blanco
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 20,
  },
  dialogContainer: {
    marginTop: 250, // Espacio superior
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    maxWidth: '80%',
  },
  speechBubble: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  imageAndButtonContainer: {
    flexDirection: 'row', // Imagen y botón en fila
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginTop: 50,
  },
  image: {
    width: 200, // Tamaño del león
    height: 200,
  },
  continueButton: {
    backgroundColor: '#0056b3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 5,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});