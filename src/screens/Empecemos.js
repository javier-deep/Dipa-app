import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from "expo-image";

export default function Empecemos({ navigation }) {
  const [displayText, setDisplayText] = useState('');
  const fullText = "¡Hola! Yo soy Maxnic.";

  useEffect(() => {
    // Efecto de escritura
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setDisplayText(fullText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 80); // Velocidad de escritura (ms por caracter)

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <View style={styles.container}>
      {/* GIF de fondo */}
      <Image
        source={require('../../assets/empecemos.gif')}
        style={styles.backgroundImage}
        contentFit="cover"
      />
      
      {/* Capa semitransparente para mejorar legibilidad */}
      <View style={styles.overlay} />
      
      {/* Contenido */}
      <View style={styles.dialogContainer}>
        <Text style={styles.speechBubble}>
          {displayText}
          {displayText === fullText ? '' : ''} {/* Cursor que desaparece al completar */}
        </Text>
      </View>
      
      <View style={styles.buttonContainer}>
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
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: null,
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0)',
    marginHorizontal: 40,
  },
  dialogContainer: {
    marginTop: 140,
    backgroundColor: 'rgb(240, 240, 240)',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    maxWidth: '80%',
    alignSelf: 'flex-end',
    marginRight: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 50,
    elevation: 30,
  },
  speechBubble: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 100,
    width: '135%',
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: '#0056b3',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 1,
  },
});