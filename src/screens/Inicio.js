import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from "expo-image";

export default function Inicio({ navigation }) { // <-- recibir la prop navigation
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/leon.gif')} style={styles.image} />
      <Text style={styles.title}>Maxnic</Text>
      <Text style={styles.slogan}>Ruge con poder, estés donde estés.</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Empecemos')} // <-- navegar a Empecemos
        >
          <Text style={styles.buttonText}>EMPECEMOS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>YA TENGO UNA CUENTA</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 70,
    fontWeight: 'bold',
    color: '#000000',
  },
  slogan: {
    fontSize: 16,
    color: '#000080',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '80%',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 15,
  },
  button: {
    width: 200,
    height: 50,
    backgroundColor: '#0056b3',
    borderRadius: 25, // redonde los botones 
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
