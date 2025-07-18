import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { Image } from "expo-image";

export default function Datos({ navigation, route }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { matricula } = route.params;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://192.168.100.38:3000/api/auth/user/${matricula}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Error al obtener datos');
        }

        setUserData(data);
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [matricula]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#0056b3" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <Text>No se encontraron datos del usuario</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: '60%' }]} />
      </View>

      <View style={styles.dialogContainer}>
        <Text style={styles.dialogText}>
          ¡Bienvenido a tu manada, {userData.nombres} {userData.primer_apellido}!
        </Text>
      </View>

      <Image
        source={require('../../assets/Datos.gif')} 
        style={styles.image}
      />

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Nombre: {userData.nombres} {userData.primer_apellido} {userData.segundo_apellido}
        </Text>
        <Text style={styles.infoText}>Estado: {userData.estado}</Text>
        <Text style={styles.infoText}>Matricula: {userData.matricula}</Text>
        <Text style={styles.infoText}>Ciudad: {userData.ciudad}</Text>
      </View>

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
    height: 20,
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
    width: 220,
    height: 220,
    marginVertical: 20,
  },
  infoContainer: {
    width: '90%',
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    marginVertical: 15,
    alignItems: 'flex-start',
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