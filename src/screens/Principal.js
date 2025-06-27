import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator, Alert, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const screenWidth = Dimensions.get('window').width;

const Principal = () => {
  const navigation = useNavigation();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [achievements, setAchievements] = useState({
    dipaLover: false, // Ahora inicia bloqueado
    instagramFollower: false,
    socialInfluencer: false
  });
  const scrollViewRef = useRef(null);

  // Ajusta esta 2URL según tu entorno de desarrollo
  const API_URL = 'http://192.168.1.75:3000/api/banners';
  const INSTAGRAM_URL = 'https://www.instagram.com/dipa_oficial/'; // Cambia por tu cuenta real

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(API_URL);
        setBanners(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los banners');
        setLoading(false);
        console.error('Error fetching banners:', err);
      }
    };

    fetchBanners();
    // Cargar logros guardados
    loadAchievements();
  }, []);

  // Función para cargar logros desde AsyncStorage o API
  const loadAchievements = async () => {
    try {
      // Aquí puedes implementar la carga desde AsyncStorage o tu API
      // const savedAchievements = await AsyncStorage.getItem('achievements');
      // if (savedAchievements) {
      //   setAchievements(JSON.parse(savedAchievements));
      // }
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  // Función para guardar logros
  const saveAchievements = async (newAchievements) => {
    try {
      // Aquí puedes implementar el guardado en AsyncStorage o tu API
      // await AsyncStorage.setItem('achievements', JSON.stringify(newAchievements));
      setAchievements(newAchievements);
    } catch (error) {
      console.error('Error saving achievements:', error);
    }
  };

  // Función para manejar el logro de DIPA LOVER
  const handleDipaLoverAchievement = () => {
    Alert.alert(
      "🐾 ¡Desbloquea DIPA LOVER!",
      "Sigue nuestra cuenta de Instagram para desbloquear este logro y demostrar que eres un verdadero DIPA LOVER",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Seguir en Instagram",
          onPress: () => openInstagram()
        }
      ]
    );
  };

  // Función para abrir Instagram
  const openInstagram = async () => {
    try {
      // Intenta abrir la app de Instagram primero
      const instagramApp = `instagram://user?username=dipa_oficial`;
      const canOpen = await Linking.canOpenURL(instagramApp);
      
      if (canOpen) {
        await Linking.openURL(instagramApp);
      } else {
        // Si no puede abrir la app, abre en el navegador
        await Linking.openURL(INSTAGRAM_URL);
      }
      
      // Mostrar diálogo de confirmación después de un pequeño delay
      setTimeout(() => {
        showFollowConfirmation();
      }, 3000);
      
    } catch (error) {
      console.error('Error opening Instagram:', error);
      Alert.alert('Error', 'No se pudo abrir Instagram');
    }
  };

  // Función para confirmar que siguió la cuenta
  const showFollowConfirmation = () => {
    Alert.alert(
      "¿Ya nos sigues?",
      "¿Has seguido nuestra cuenta de Instagram @dipa_oficial?",
      [
        {
          text: "No, ir de nuevo",
          onPress: () => openInstagram()
        },
        {
          text: "¡Sí, ya los sigo!",
          onPress: () => unlockDipaLoverAchievement()
        }
      ]
    );
  };

  // Función para desbloquear el logro DIPA LOVER
  const unlockDipaLoverAchievement = () => {
    const newAchievements = {
      ...achievements,
      dipaLover: true
    };
    
    saveAchievements(newAchievements);
    
    // Mostrar animación de logro desbloqueado
    Alert.alert(
      " ¡Logro Desbloqueado!",
      "¡Felicidades! Ahora eres oficialmente un DIPA LOVER 🐾\n¡Gracias por seguirnos en Instagram!",
      [
        {
          text: "¡Genial!",
          style: "default"
        }
      ]
    );
  };

  // Auto-scroll del carrusel
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % banners.length;
          scrollViewRef.current?.scrollTo({
            x: nextIndex * (screenWidth - 40),
            animated: true,
          });
          return nextIndex;
        });
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const handleBannerScroll = (event) => {
    const slideSize = screenWidth - 40;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentBannerIndex(index);
  };

  const goToBanner = (index) => {
    setCurrentBannerIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * (screenWidth - 40),
      animated: true,
    });
  };

  // Componente de carga
  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#1e3a8a" />
        <Text style={styles.loadingText}>Cargando contenido...</Text>
      </View>
    );
  }

  // Componente de error
  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Icon name="exclamation-triangle" size={40} color="#ff4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setError(null);
            useEffect(() => fetchBanners(), []);
          }}
        >
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderBannerCarousel = () => {
    if (banners.length === 0) {
      return (
        <View style={[styles.bannerContainer, styles.placeholderBanner]}>
          <Text style={styles.placeholderText}>No hay banners disponibles</Text>
        </View>
      );
    }

    return (
      <View style={styles.carouselContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleBannerScroll}
          style={styles.carouselScrollView}
        >
          {banners.map((banner, index) => (
            <View key={index} style={styles.bannerSlide}>
              <Image
                source={{ uri: `data:image/jpeg;base64,${banner.imagen}` }}
                style={styles.banner}
                resizeMode="cover"
              />
              <View style={styles.bannerOverlay}>
                <Text style={styles.bannerText}>
                  {banner.titulo || ''}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
        
        {banners.length > 1 && (
          <View style={styles.pageIndicator}>
            {banners.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dot,
                  index === currentBannerIndex ? styles.activeDot : styles.inactiveDot
                ]}
                onPress={() => goToBanner(index)}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Encabezado superior */}
      <View style={styles.topBar}>
        <TouchableOpacity>
          <Icon name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="cog" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Stats container */}
      <View style={styles.statsContainer}>
        <Animatable.View animation="bounceIn" delay={200} style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: '#6ab04c' }]}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>!</Text>
          </View>
          <Text style={styles.statValue}>0</Text>
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
          <Text style={styles.statValue}>
            {Object.values(achievements).filter(Boolean).length}
          </Text>
        </Animatable.View>
      </View>

      {/* Información del perfil */}
      <View style={styles.profileSection}>
        <Image source={require('../../assets/maxx.png')} style={styles.avatar} />
        <View style={styles.profileInfo}>
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
          {/* Logro DIPA LOVER - Se desbloquea con Instagram */}
          <TouchableOpacity 
            style={[
              styles.achievementCard,
              achievements.dipaLover && styles.achievementUnlocked
            ]}
            onPress={!achievements.dipaLover ? handleDipaLoverAchievement : null}
          >
            <Text style={styles.nuevoLabel}>NUEVO</Text>
            <Icon name="paw" size={24} color={achievements.dipaLover ? "#8A2BE2" : "#ccc"} />
            <Text style={[
              styles.achievementText,
              { color: achievements.dipaLover ? "#8A2BE2" : "#ccc" }
            ]}>
              DIPA{'\n'}LOVER
            </Text>
            {!achievements.dipaLover && (
              <View style={styles.lockOverlay}>
                <Icon name="lock" size={12} color="#666" />
              </View>
            )}
          </TouchableOpacity>

          {/* Logro vacío 1 */}
          <View style={styles.achievementCardEmpty}>
            <Text style={styles.nuevoLabelEmpty}>NUEVO</Text>
            <Icon name="question" size={24} color="#ccc" />
            <Text style={[styles.achievementText, { color: '#ccc' }]}>
              MISTERIO{'\n'}???
            </Text>
          </View>

          {/* Logro vacío 2 */}
          <View style={styles.achievementCardEmpty}>
            <Text style={styles.nuevoLabelEmpty}>NUEVO</Text>
            <Icon name="question" size={24} color="#ccc" />
            <Text style={[styles.achievementText, { color: '#ccc' }]}>
              MISTERIO{'\n'}???
            </Text>
          </View>
        </View>
      </View>

      {/* Carrusel de banners */}
      {renderBannerCarousel()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#1e3a8a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#f8f9fa',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
    paddingHorizontal: 40,
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  profileSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 130,
    borderRadius: 25,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  university: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  badgeGreen: {
    backgroundColor: '#2ecc71',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    fontSize: 10,
    fontWeight: 'bold',
  },
  badgeBlack: {
    backgroundColor: '#333',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    fontSize: 10,
    fontWeight: 'bold',
  },
  card: {
    marginHorizontal: 20,
    backgroundColor: '#1e3a8a',
    borderRadius: 10,
    paddingVertical: 50,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    elevation: 0,
  },
  cardTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 15,
    color: '#333',
  },
  achievements: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: (screenWidth - 60) / 3,
    height: 80,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#fff',
  },
  achievementCardEmpty: {
    width: (screenWidth - 60) / 3,
    height: 80,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementUnlocked: {
    borderColor: '#4CAF50',
    borderWidth: 2,
    backgroundColor: '#f8fff8',
  },
  lockOverlay: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 2,
  },
  nuevoLabel: {
    position: 'absolute',
    top: 5,
    right: 5,
    fontSize: 8,
    backgroundColor: '#ff4444',
    color: '#fff',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    fontWeight: 'bold',
  },
  nuevoLabelEmpty: {
    position: 'absolute',
    top: 5,
    right: 5,
    fontSize: 8,
    backgroundColor: '#ff4444',
    color: '#fff',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    fontWeight: 'bold',
  },
  achievementText: {
    fontSize: 10,
    marginTop: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  // Estilos del carrusel
  carouselContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  carouselScrollView: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 60,
  },
  bannerSlide: {
    width: screenWidth - 40,
    height: 150,
    position: 'relative',
  },
  banner: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 10,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  bannerText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  pageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 40,
    marginHorizontal: 10,
  },
  activeDot: {
    backgroundColor: '#1e3a8a',
  },
  inactiveDot: {
    backgroundColor: '#ddd',
  },
  // Estilos del banner original para el placeholder
  bannerContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    height: 100,
  },
  placeholderBanner: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    fontSize: 14,
  },
});

export default Principal;