import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
  StatusBar,
  Animated,
  Easing
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { Camera } from 'expo-camera';

const { width } = Dimensions.get('window');

export default function CursosApp() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [showScanner, setShowScanner] = useState(false);
  const [streakCount, setStreakCount] = useState(1);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  // Datos completos de los cursos
  const courses = [
    {
      id: 1,
      title: "Animales Peligrosos",
      icon: "🕷️",
      color: "#1a397c",
      details: {
        description: "Aprende a identificar, prevenir y actuar ante encuentros con animales venenosos o agresivos. Incluye técnicas de primeros auxilios y protocolos de seguridad.",
        modality: "PRESENCIAL",
        duration: "4 HORAS",
        location: "SEDE: GUADALAJARA",
        callToAction: "Información del curso",
        schedule: "Sábados 9:00 - 13:00",
        requirements: "Ropa cómoda y cuaderno de notas"
      }
    },
    {
      id: 2,
      title: "Supervivencia en Naturaleza",
      icon: "🦊",
      color: "#1a397c",
      details: {
        description: "Técnicas esenciales de supervivencia en entornos naturales. Aprenderás a conseguir agua, hacer fuego, construir refugios y orientarte sin equipamiento.",
        modality: "HÍBRIDO",
        duration: "6 HORAS",
        location: "SEDE: CDMX / ONLINE",
        callToAction: "Información del curso",
        schedule: "Viernes 16:00 - 20:00",
        requirements: "Ninguno"
      }
    },
    {
      id: 3,
      title: "Primeros Auxilios Avanzados",
      icon: "🦁",
      color: "#1a397c",
      details: {
        description: "Curso avanzado de primeros auxilios para situaciones críticas. Incluye RCP, manejo de hemorragias y atención a traumatismos.",
        modality: "PRESENCIAL",
        duration: "8 HORAS",
        location: "SEDE: MONTERREY",
        callToAction: "Información del curso",
        schedule: "Domingos 10:00 - 18:00",
        requirements: "Certificado básico de primeros auxilios"
      }
    },
    {
      id: 4,
      title: "Manejo de Crisis",
      icon: "🐊",
      color: "#1a397c",
      details: {
        description: "Desarrolla habilidades para manejar situaciones de crisis y emergencias. Trabajo en equipo, toma de decisiones bajo presión y comunicación efectiva.",
        modality: "VIRTUAL",
        duration: "3 HORAS",
        location: "PLATAFORMA: ZOOM",
        callToAction: "Información del curso",
        schedule: "Miércoles 18:00 - 21:00",
        requirements: "Conexión a internet estable"
      }
    },
    {
      id: 5,
      title: "Rastreo y Seguimiento",
      icon: "🐘",
      color: "#1a397c",
      details: {
        description: "Aprende técnicas profesionales de rastreo y seguimiento en diferentes terrenos. Ideal para rescatistas y equipos de búsqueda.",
        modality: "PRESENCIAL",
        duration: "5 HORAS",
        location: "SEDE: GUADALAJARA",
        callToAction: "Información del curso",
        schedule: "Jueves 14:00 - 19:00",
        requirements: "Botas para campo"
      }
    },
    {
      id: 6,
      title: "Defensa Personal",
      icon: "🦅",
      color: "#1a397c",
      details: {
        description: "Técnicas básicas y avanzadas de defensa personal adaptadas a diferentes contextos y situaciones de peligro.",
        modality: "PRESENCIAL",
        duration: "4 HORAS",
        location: "SEDE: CDMX",
        callToAction: "Información del curso",
        schedule: "Martes y Jueves 17:00 - 19:00",
        requirements: "Ropa deportiva"
      }
    },
  ];

   // Solicitar permisos al cargar el componente
  
   useEffect(() => {
    const requestPermission = async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setCameraPermission(status === 'granted');
      } catch (error) {
        console.error("Error al solicitar permisos:", error);
        Alert.alert("Error", "No se pudo solicitar permiso para la cámara");
      } finally {
        setIsLoading(false);
      }
    };
    requestPermission();
  }, []);

  const handleQRScanned = ({ data }) => {
    setShowScanner(false);
    if (data.includes('VALID_COURSE_QR')) {
      if (selectedCourse && !completedCourses.includes(selectedCourse.id)) {
        setCompletedCourses([...completedCourses, selectedCourse.id]);
        setStreakCount(streakCount + 1);
        setShowCongratulations(true);
      }
    } else {
      Alert.alert('Código inválido', 'Este código QR no es válido para completar el curso');
    }
  };

  const handleScanPress = async () => {
    if (!cameraPermission) {
      try {
        setIsLoading(true);
        const { status } = await Camera.requestCameraPermissionsAsync();
        setCameraPermission(status === 'granted');
        if (status === 'granted') {
          setShowScanner(true);
        }
      } catch (error) {
        console.error("Error al solicitar permisos:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setShowScanner(true);
    }
  };
  // Componente para la pantalla de felicitaciones
  const CongratulationsModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showCongratulations}
      onRequestClose={() => setShowCongratulations(false)}
    >
      <View style={styles.congratsContainer}>
        <View style={styles.congratsContent}>
          <Text style={styles.congratsNumber}>{streakCount}</Text>
          <Text style={styles.congratsTitle}>¡Felicidades!</Text>
          <Text style={styles.congratsSubtitle}>Sigue así y no pierdas tu racha</Text>
          <TouchableOpacity 
            style={styles.congratsButton}
            onPress={() => setShowCongratulations(false)}
          >
            <Text style={styles.congratsButtonText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const FlipCard = ({ course }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [flipped, setFlipped] = useState(false);
    
    const frontInterpolate = animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['0deg', '180deg']
    });
    
    const backInterpolate = animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['180deg', '360deg']
    });
  
    const flipCard = () => {
      Animated.timing(animatedValue, {
        toValue: flipped ? 0 : 180,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true
      }).start(() => setFlipped(!flipped));
    };

    const showCourseDetails = () => {
      setSelectedCourse(course);
    };

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={flipCard}
        style={[styles.card, completedCourses.includes(course.id) && styles.completedCard]}
      >
        <Animated.View style={[
          styles.flipCard,
          { transform: [{ rotateY: frontInterpolate }] },
          { backgroundColor: course.color }
        ]}>
          <View style={styles.cardContent}>
            <Text style={styles.cardIcon}>{course.icon}</Text>
            <Text style={styles.cardTitle}>{course.title}</Text>
            <Text style={styles.cardHint}>Toca para voltear</Text>
          </View>
        </Animated.View>
        
        <Animated.View style={[
          styles.flipCard,
          styles.flipCardBack,
          { transform: [{ rotateY: backInterpolate }] }
        ]}>
          <View style={styles.cardBackContent}>
            <Text style={[styles.detailCardTitle, { color: course.color }]}>
              {course.title}
            </Text>
            <Text style={styles.detailCardDescription}>
              {course.details.description.substring(0, 60)}...
            </Text>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: course.color }]}
              onPress={showCourseDetails}
            >
              <Text style={styles.actionButtonText}>
                {course.details.callToAction}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const CourseDetailsModal = ({ course, onClose }) => {
    if (!course) return null;
    
    const isCompleted = completedCourses.includes(course.id);
    
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!course}
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={[styles.modalHeader, { backgroundColor: course.color }]}>
              <Text style={styles.modalTitle}>{course.title}</Text>
              <Text style={styles.modalSubtitle}>
                {isCompleted ? '¡Curso completado!' : 'Escanea el QR para completar'}
              </Text>
            </View>
            
            <ScrollView style={styles.modalBody}>
              {isCompleted ? (
                <View style={styles.qrContainer}>
                  <Text style={styles.qrTitle}>Certificado de finalización</Text>
                  <View style={styles.qrCode}>
                    <QRCode
                      value={`CERTIFICADO_${course.id}_USER_123_${streakCount}`}
                      size={200}
                      color="black"
                      backgroundColor="white"
                    />
                  </View>
                  <Text style={styles.qrHint}>
                    Este código verifica que completaste el curso
                  </Text>
                </View>
              ) : (
                <>
                  <Text style={styles.modalDescription}>
                    {course.details.description}
                  </Text>
                  
                  <View style={styles.modalFeatures}>
                    <View style={[styles.modalFeatureBox, { backgroundColor: course.color }]}>
                      <Text style={styles.modalFeatureText}>{course.details.modality}</Text>
                    </View>
                    <View style={[styles.modalFeatureBox, { backgroundColor: course.color }]}>
                      <Text style={styles.modalFeatureText}>{course.details.duration}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.modalInfoItem}>
                    <Ionicons name="location-outline" size={20} color="#555" />
                    <Text style={styles.modalInfoText}>{course.details.location}</Text>
                  </View>
                  
                  <View style={styles.modalInfoItem}>
                    <Ionicons name="time-outline" size={20} color="#555" />
                    <Text style={styles.modalInfoText}>{course.details.schedule}</Text>
                  </View>
                  
                  <View style={styles.modalInfoItem}>
                    <Ionicons name="alert-circle-outline" size={20} color="#555" />
                    <Text style={styles.modalInfoText}>Requisitos: {course.details.requirements}</Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={[styles.scanButton, { backgroundColor: course.color }]}
                    onPress={handleScanPress}
                  >
                    <Ionicons name="qr-code-outline" size={24} color="white" />
                    <Text style={styles.scanButtonText}>Escanear QR de finalización</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
            
            <TouchableOpacity 
              style={[styles.modalCloseButton, { backgroundColor: course.color }]}
              onPress={onClose}
            >
              <Text style={styles.modalCloseText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  // Pantalla de carga mientras se verifican permisos
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a397c" />
        <Text style={styles.loadingText}>Solicitando permisos...</Text>
      </View>
    );
  }

  // Pantalla si no hay permisos
  if (cameraPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-off" size={60} color="#1a397c" />
        <Text style={styles.permissionTitle}>Permiso de cámara requerido</Text>
        <Text style={styles.permissionText}>
          Para escanear códigos QR y completar cursos, necesitamos acceso a tu cámara.
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={async () => {
            setIsLoading(true);
            const { status } = await Camera.requestCameraPermissionsAsync();
            setCameraPermission(status === 'granted');
            setIsLoading(false);
          }}
        >
          <Text style={styles.permissionButtonText}>Conceder permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Interfaz principal
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#6ab04c' }]}>
              <Text>!</Text>
            </View>
            <Text style={styles.statValue}>1</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#3498db' }]}>
              <Ionicons name="person" size={16} color="white" />
            </View>
            <Text style={styles.statValue}>0</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#e17055' }]}>
              <Ionicons name="flame" size={16} color="white" />
            </View>
            <Text style={styles.statValue}>{streakCount}</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#6c5ce7' }]}>
              <Ionicons name="paw" size={16} color="white" />
            </View>
            <Text style={styles.statValue}>5</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Cursos y Talleres</Text>
      </View>
      
      <View style={styles.mascotContainer}>
        <Image 
          source={{ uri: 'https://vignette.wikia.nocookie.net/doblaje/images/f/f2/Alexleon.png/revision/latest?cb=20141225032252&path-prefix=es' }} 
          style={styles.mascotImage} 
          contentFit="contain"
        />
        <View style={styles.speechBubble}>
          <Text style={styles.speechBubbleText}>
            "¡Ruge con conocimiento! {"\n"}
            Un león bien capacitado siempre {"\n"}
            está un paso adelante.
          </Text>
        </View>
      </View>
      
      <View style={styles.cardsContainer}>
        <ScrollView contentContainerStyle={styles.cardsGrid}>
          {courses.map((course) => (
            <FlipCard 
              key={course.id} 
              course={course}
            />
          ))}
        </ScrollView>
      </View>
      
      <CourseDetailsModal 
        course={selectedCourse} 
        onClose={() => setSelectedCourse(null)} 
      />
      
      {/* Modal del escáner QR */}
      <Modal visible={showScanner} transparent={true} animationType="slide">
        <View style={styles.scannerContainer}>
          <Camera
            onBarCodeScanned={showScanner ? handleQRScanned : undefined}
            barCodeScannerSettings={{
              barCodeTypes: [Camera.Constants.BarCodeType.qr],
            }}
            style={StyleSheet.absoluteFillObject}
          />
          <TouchableOpacity style={styles.closeScanner} onPress={() => setShowScanner(false)}>
            <Text style={{ color: 'white', fontSize: 20 }}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      
      <CongratulationsModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#1a397c',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#1a397c',
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 30,
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 20,
  },
  permissionButton: {
    backgroundColor: '#1a397c',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
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
  titleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  mascotContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  mascotImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  speechBubble: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    padding: 10,
    marginLeft: 10,
  },
  speechBubbleText: {
    color: '#1a397c',
    fontSize: 14,
    fontWeight: '500',
  },
  cardsContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  card: {
    width: (width - 30) / 2,
    height: (width - 30) / 2,
    borderRadius: 20,
    marginBottom: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  completedCard: {
    borderColor: '#6ab04c',
    borderWidth: 2,
  },
  flipCard: {
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  flipCardBack: {
    backgroundColor: 'white',
    backfaceVisibility: 'hidden',
  },
  cardContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  cardHint: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 10,
    textAlign: 'center',
  },
  cardBackContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  detailCardDescription: {
    fontSize: 10,
    lineHeight: 16,
    color: '#333',
    marginBottom: 15,
  },
  actionButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    maxWidth: '90%',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
  },
  modalHeader: {
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  modalSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  modalBody: {
    padding: 20,
  },
  modalDescription: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
    marginBottom: 20,
  },
  modalFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  modalFeatureBox: {
    padding: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  modalFeatureText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  modalInfoText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
  },
  modalCloseButton: {
    padding: 15,
    alignItems: 'center',
  },
  modalCloseText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  qrContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  qrCode: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  qrHint: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  scanButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  scannerOverlay: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  scannerText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    borderRadius: 10,
  },
  scannerCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 10,
  },
  congratsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  congratsContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '80%',
  },
  congratsNumber: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#1a397c',
  },
  congratsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  congratsSubtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  congratsButton: {
    backgroundColor: '#1a397c',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  congratsButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});