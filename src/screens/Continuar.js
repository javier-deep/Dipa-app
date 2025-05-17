import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from "expo-image";

export default function Continuar({ navigation }) {
  // Estado para controlar el progreso
  const [progress, setProgress] = useState(0.20); // Progreso inicial
  const [matricula, setMatricula] = useState(""); // Estado para matrícula
  const [password, setPassword] = useState(""); // Estado para contraseña

  const avanzarPantalla = () => {
    if (progress < 1) {
      setProgress(progress + 0.20); 
      navigation.navigate('Datos'); // pantalla siguiente
    }
  };

  return (
    <View style={styles.container}>
      {/* Barra de progreso */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>
      {/* Cuadro de diálogo */}
      <View style={styles.dialogContainer}>
        <Text style={styles.dialogText}>Antes de rugir juntos, necesito conocerte mejor.</Text>
      </View>
      {/* Imagen */}
      <Image source={require('../../assets/leon.gif')} style={styles.image} />
      {/* Espacios de texto */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Matrícula</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu matrícula"
          value={matricula}
          onChangeText={setMatricula}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Crea tu Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      {/* Botón "CONTINUAR" */}
      <TouchableOpacity
        style={styles.continueButton}
        onPress={avanzarPantalla}
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
    marginVertical: 50,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
  },
  dialogText: {
    fontSize: 18,
    color: '#0056b3',
    textAlign: 'center',
  },
  image: {
    width: 150,
    height: 150,
    marginVertical: 5,
  },
  inputContainer: {
    width: '90%',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0056b3',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#e8e8e8',
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000',
  },
  continueButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#0056b3',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  continueButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});