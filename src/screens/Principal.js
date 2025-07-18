import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator, Alert, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const screenWidth = Dimensions.get('window').width;

const Principal = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null); // Nuevo estado para datos del usuario
  
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [achievements, setAchievements] = useState({
    dipaLover: false,
    instagramFollower: false,
    socialInfluencer: false
  });
  const [completedCourses, setCompletedCourses] = useState(0);
  const scrollViewRef = useRef(null);

  const API_URL = 'http://192.168.100.38:3000/api/banners';
  const USER_API_URL = 'http://192.168.100.38:3000/api/auth/user'; // URL para obtener datos del usuario
  const INSTAGRAM_URL = 'https://www.instagram.com/dipa_oficial/';

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

    const fetchUserData = async () => {
      if (user?.matricula) {
        try {
          const response = await axios.get(`${USER_API_URL}/${user.matricula}`);
          setUserData(response.data);
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      }
    };

    const loadCompletedCourses = async () => {
      if (user?.id) {
        try {
          const response = await fetch(`http://192.168.100.38:3000/api/cursos/completados/${user.id}`);
          if (response.ok) {
            const data = await response.json();
            setCompletedCourses(data.length);
          }
        } catch (error) {
          console.error('Error al cargar cursos completados:', error);
        }
      }
    };

    fetchBanners();
    fetchUserData(); // Llamar a la función para obtener datos del usuario
    loadAchievements();
    loadCompletedCourses();
  }, [user?.id, user?.matricula]);

  const loadAchievements = async () => {
    try {
      // Implementación para cargar logros desde AsyncStorage o API
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  const saveAchievements = async (newAchievements) => {
    try {
      // Implementación para guardar logros
      setAchievements(newAchievements);
    } catch (error) {
      console.error('Error saving achievements:', error);
    }
  };

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

  const openInstagram = async () => {
    try {
      const instagramApp = `instagram://user?username=dipa_oficial`;
      const canOpen = await Linking.canOpenURL(instagramApp);
      
      if (canOpen) {
        await Linking.openURL(instagramApp);
      } else {
        await Linking.openURL(INSTAGRAM_URL);
      }
      
      setTimeout(() => {
        showFollowConfirmation();
      }, 3000);
      
    } catch (error) {
      console.error('Error opening Instagram:', error);
      Alert.alert('Error', 'No se pudo abrir Instagram');
    }
  };

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

  const unlockDipaLoverAchievement = () => {
    const newAchievements = {
      ...achievements,
      dipaLover: true
    };
    
    saveAchievements(newAchievements);
    
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

  // Función para formatear el nombre completo
  const getFullName = () => {
    if (!userData) return 'Usuario';
    
    const nombres = userData.nombres || '';
    const primerApellido = userData.primer_apellido || '';
    const segundoApellido = userData.segundo_apellido || '';
    
    return `${nombres} ${primerApellido} ${segundoApellido}`.trim();
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#1e3a8a" />
        <Text style={styles.loadingText}>Cargando contenido...</Text>
      </View>
    );
  }

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
      {/* Nueva barra de iconos */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#666" />
        </TouchableOpacity>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#6ab04c' }]}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>!</Text>
            </View>
            <Text style={styles.statValue}>0</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#3498db' }]}>
              <Icon name="podcast" size={16} color="white" />
            </View>
            <Text style={styles.statValue}>0</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#e17055' }]}>
              <Icon name="fire" size={16} color="white" />
            </View>
            <Text style={styles.statValue}>{completedCourses}</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#6c5ce7' }]}>
              <Icon name="paw" size={16} color="white" />
            </View>
            <Text style={styles.statValue}>
              {Object.values(achievements).filter(Boolean).length}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.settingsButton}>
          <Icon name="cog" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Información del perfil */}
      <View style={styles.profileSection}>
        <Image source={require('../../assets/maxx.png')} style={styles.avatar} />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{getFullName()}</Text>
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

          <View style={styles.achievementCardEmpty}>
            <Text style={styles.nuevoLabelEmpty}>NUEVO</Text>
            <Icon name="question" size={24} color="#ccc" />
            <Text style={[styles.achievementText, { color: '#ccc' }]}>
              MISTERIO{'\n'}???
            </Text>
          </View>

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 15,
    backgroundColor: '#f8f9fa',
  },
  backButton: {
    padding: 8,
  },
  settingsButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    marginLeft: 3,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
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