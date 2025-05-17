import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const Principal = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      
      {/* Encabezado superior: botón atrás y configuración */}
      <View style={styles.statsContainer}>
  <Animatable.View animation="bounceIn" delay={200} style={styles.statItem}>
    <View style={[styles.statIcon, { backgroundColor: '#6ab04c' }]}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>!</Text>
    </View>
    <Text style={styles.statValue}>1</Text>
  </Animatable.View>

  <Animatable.View animation="bounceIn" delay={400} style={styles.statItem}>
    <View style={[styles.statIcon, { backgroundColor: '#3498db' }]}>
      <Icon name="podcast" size={16} color="white" />
    </View>
    <Text style={styles.statValue}>0</Text>
  </Animatable.View>

  <Animatable.View animation="bounceIn" delay={600} style={styles.statItem}>
    <View style={[styles.statIcon, { backgroundColor: '#e17055' }]}>
      <Icon name="fire" size={16} color="white" />
    </View>
    <Text style={styles.statValue}>1</Text>
  </Animatable.View>

  <Animatable.View animation="bounceIn" delay={800} style={styles.statItem}>
    <View style={[styles.statIcon, { backgroundColor: '#6c5ce7' }]}>
      <Icon name="paw" size={16} color="white" />
    </View>
    <Text style={styles.statValue}>5</Text>
  </Animatable.View>
</View>

      {/* Información del perfil */}
      <View style={styles.profileSection}>
        <Image source={require('../../assets/alex.png')} style={styles.avatar} />
        <View>
          <Text style={styles.name}>Álvaro Díaz</Text>
          <Text style={styles.university}>Centro Universitario DIPA</Text>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeGreen}>DIPA ESTUDIO</Text>
            <Text style={styles.badgeBlack}>Ver cap.</Text>
          </View>
        </View>
      </View>

      {/* Tarjeta para Cursos y Talleres */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Cursos')}
      >
        <Text style={styles.cardTitle}>Cursos y Talleres</Text>
      </TouchableOpacity>

      {/* Sección de logros */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Logros</Text>
        <View style={styles.achievements}>
          <View style={styles.achievementCard}>
            <Text style={styles.nuevoLabel}>NUEVO</Text>
            <Icon name="paw" size={30} color="#8A2BE2" />
            <Text style={styles.achievementText}>DIPA LOVER</Text>
          </View>
          <View style={styles.achievementCardEmpty} />
          <View style={styles.achievementCardEmpty} />
        </View>
      </View>

      {/* Banner inferior para información */}
      <Image
        source={require('../../assets/alex.png')}
        style={styles.banner}
        resizeMode="cover"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // Estilo del contenedor principal
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // Encabezado con icono de regreso y ajustes
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },

  // Encabezado con los iconos animados
  iconHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    paddingTop: 10,
  },

  // Círculo alrededor del ícono
  iconCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 30,
    width: 60,
    height: 60,
  },

  // Número debajo del ícono
  iconNumber: {
    fontWeight: 'bold',
    marginTop: 2,
  },

  // Sección del perfil
  profileSection: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    gap: 15,
  },

  // Avatar de usuario
  avatar: {
    width: 60,
    height: 60,
  },

  // Nombre del usuario
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Universidad del usuario
  university: {
    fontSize: 14,
    color: '#666',
  },

  // Contenedor de insignias
  badgeContainer: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },

  // Estilo de la insignia verde
  badgeGreen: {
    backgroundColor: '#2ecc71',
    color: 'white',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    fontSize: 12,
  },

  // Estilo de la insignia negra
  badgeBlack: {
    backgroundColor: '#000',
    color: 'white',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    fontSize: 12,
  },

  // Tarjeta de Cursos y Talleres
  card: {
    marginHorizontal: 20,
    backgroundColor: '#001F54',
    borderRadius: 12,
    paddingVertical: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  // Texto dentro de la tarjeta
  cardTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Sección de logros
  section: {
    paddingHorizontal: 20,
    marginTop: 10,
  },

  // Título de la sección
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },

  // Contenedor de los logros
  achievements: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  // Tarjeta individual de logro
  achievementCard: {
    width: (screenWidth - 60) / 3,
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  // Tarjetas vacías para logros aún no desbloqueados
  achievementCardEmpty: {
    width: (screenWidth - 60) / 3,
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },

  // Etiqueta de "NUEVO" en logros
  nuevoLabel: {
    position: 'absolute',
    top: 5,
    left: 5,
    fontSize: 10,
    backgroundColor: 'red',
    color: '#fff',
    paddingHorizontal: 4,
    borderRadius: 4,
  },

  // Texto del logro
  achievementText: {
    fontSize: 12,
    marginTop: 5,
  },

  // Banner informativo inferior
  banner: {
    width: '100%',
    height: 100,
    marginTop: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  
  statItem: {
    alignItems: 'center',
  },
  
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  
});

export default Principal;
