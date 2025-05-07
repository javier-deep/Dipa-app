import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const RegistroC = () => {
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

      {/* Imagen del león */}
      <Image source={require('../../assets/alex.png')} style={styles.lionImage} />
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
    height: 30,
    backgroundColor: '#E0E0E0',
    borderRadius: 70,
    position: 'relative',
    marginBottom: 10,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  progressBar: {
    height: '100%',
    width: '100%',
    backgroundColor: '#2E4B9C', // azul oscuro
    borderRadius: 70,
  },
  starIcon: {
    position: 'absolute',
    right: -10,
    top: -8,
    width: 60,
    height: 45,
    resizeMode: 'contain',
  },
  dialogBox: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
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
  lionImage: {
    width: 500,
    height: 350,
    resizeMode: 'contain',
  },
});

export default RegistroC;
