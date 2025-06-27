import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

export default function Inicio({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Contenedor del GIF de fondo con márgenes laterales */}
      <View style={styles.backgroundContainer}>
        <Image 
          source={require('../../assets/inicio.gif')} 
          style={styles.backgroundImage}
          contentFit="cover"
        />
      </View>
      
      {/* Capa semitransparente con los mismos márgenes */}
      <View style={styles.overlay} />
      
      {/* Contenido principal */}
      <View style={styles.content}>
        <View style={styles.spacer} />
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Empecemos')}
          >
            <Text style={styles.buttonText}>EMPECEMOS</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>YA TENGO UNA CUENTA</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff', // Color que se verá en los márgenes
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,        // Sin margen superior
    left: 0,      // Margen izquierdo aumentado (antes era 20)
    right: 0,     // Margen derecho aumentado (antes era 20)
    bottom: 0,     // Sin margen inferior
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '85%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 40,      // Mismo margen izquierdo que el contenedor del fondo
    right: 40,     // Mismo margen derecho que el contenedor del fondo
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 40, // Asegura que el contenido respete los mismos márgenes
    paddingBottom: 20,
  },
  // ... (el resto de los estilos se mantienen igual)
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 15,
    marginBottom: 140,
  },
  button: {
    width: '100%',
    maxWidth: 300,
    height: 50,
    backgroundColor: '#0056b3',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});