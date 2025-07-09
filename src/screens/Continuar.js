import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Image } from "expo-image";

export default function Continuar({ navigation }) {
  const [progress, setProgress] = useState(0.20);
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!matricula || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://192.168.100.38:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ matricula, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar');
      }

      setProgress(progress + 0.20);
      navigation.navigate('Datos', { matricula });
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>

      <View style={styles.dialogContainer}>
        <Text style={styles.dialogText}>Antes de rugir juntos, necesito conocerte mejor.</Text>
      </View>

      <Image
        source={require('../../assets/continuar.gif')}
        style={styles.image}
      />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Matrícula</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu matrícula"
          value={matricula}
          onChangeText={setMatricula}
          autoCapitalize="characters"
          textContentType="username"
          autoCorrect={false}
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

      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.continueButtonText}>CONTINUAR</Text>
        )}
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
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 70,
    marginTop: 65,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#0056b3',
  },
  dialogContainer: {
    marginVertical: 30,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    width: '90%',
  },
  dialogText: {
    fontSize: 18,
    color: '#0056b3',
    textAlign: 'center',
  },
  image: {
    width: 250,
    height: 250,
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
