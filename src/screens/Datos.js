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

const API_URL = 'http://10.169.169.134:3000/api/auth';

export default function Datos({ navigation, route }) {
  const [userData, setUserData] = useState({
    nombres: '',
    primer_apellido: '',
    segundo_apellido: '',
    estado: '',
    matricula: '',
    ciudad: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { matricula } = route.params;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/user/${matricula}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Error al obtener datos del usuario');
        }

        if (!data.user) {
          throw new Error('No se encontraron datos del usuario');
        }

        setUserData({
          nombres: data.user.nombre || 'No disponible',
          primer_apellido: data.user.app || '',
          segundo_apellido: data.user.apm || '',
          estado: data.user.estado || 'No disponible',
          matricula: data.user.matricula || matricula,
          ciudad: data.user.ciudad || 'No disponible'
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.message);
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

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setError(null);
            fetchUserData();
          }}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
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
        <Text style={styles.infoText}>Matrícula: {userData.matricula}</Text>
        <Text style={styles.infoText}>Ciudad: {userData.ciudad}</Text>
      </View>

      <TouchableOpacity
  style={styles.continueButton}
  onPress={() => navigation.navigate('Avatar', { matricula: userData.matricula })}
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
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#0056b3',
    padding: 15,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});