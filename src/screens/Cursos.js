import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Animated,
  Easing,
  Modal,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera';
//\\import { Camera } from 'expo-camera';
import * as Linking from 'expo-linking';
const { width } = Dimensions.get('window');
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function App({ navigation }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [completedCourses, setCompletedCourses] = useState(1); // Inicialmente 1 (como en el estado original)
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  // Solicitar permisos de cámara cuando se necesite
  const requestCameraPermission = async () => {
  try {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        "Permiso requerido",
        "Necesitamos acceso a la cámara para escanear códigos QR",
        [
          {
            text: "Abrir Configuración",
            onPress: () => Linking.openSettings()
          },
          {
            text: "Cancelar",
            style: "cancel"
          }
        ]
      );
      return false;
    }
    setHasPermission(true);
    setShowScanner(true);
    return true;
  } catch (err) {
    console.error("Error al solicitar permisos:", err);
    Alert.alert("Error", "No se pudo acceder a la cámara");
    return false;
  }
};


  // Datos completos de los cursos
  const courses = [
    {
      id: 1,
      title: "Animales Peligrosos",
      icon: "🕷️",
      color: "#1a397c",
      qrCode: "curso-animales-peligrosos-2025",
      completed: true, // Este ya está completado (valor inicial de completedCourses es 1)
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
      qrCode: "curso-supervivencia-naturaleza-2025",
      completed: false,
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
      qrCode: "curso-primeros-auxilios-avanzados-2025",
      completed: false,
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
      qrCode: "curso-manejo-crisis-2025",
      completed: false,
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
      qrCode: "curso-rastreo-seguimiento-2025",
      completed: false,
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
      qrCode: "curso-defensa-personal-2025",
      completed: false,
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

  // Estado mutable de los cursos
  const [coursesList, setCoursesList] = useState(courses);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    
    // Buscar el curso correspondiente al código QR escaneado
    const courseIndex = coursesList.findIndex(course => course.qrCode === data);
    
    if (courseIndex !== -1) {
      const updatedCourses = [...coursesList];
      
      // Verificar si el curso ya estaba completado
      if (!updatedCourses[courseIndex].completed) {
        updatedCourses[courseIndex].completed = true;
        setCoursesList(updatedCourses);
        setCompletedCourses(prev => prev + 1);
        
        Alert.alert(
          "¡Curso Completado!", 
          `¡Felicidades! Has completado el curso "${updatedCourses[courseIndex].title}".`,
          [{ text: "OK", onPress: () => setShowScanner(false) }]
        );
      } else {
        Alert.alert(
          "Curso ya completado", 
          `El curso "${updatedCourses[courseIndex].title}" ya ha sido marcado como completado anteriormente.`,
          [{ text: "OK", onPress: () => setShowScanner(false) }]
        );
      }
    } else {
      // Código QR no válido o no reconocido
      Alert.alert(
        "Código QR inválido", 
        "Este código QR no corresponde a ningún curso registrado.",
        [{ text: "Intentar de nuevo", onPress: () => setScanned(false) }]
      );
    }
  };

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
        style={[
          styles.card, 
          course.id === 1 && styles.highlightedCard,
          course.completed && styles.completedCard
        ]}
      >
        <Animated.View style={[
          styles.flipCard,
          { transform: [{ rotateY: frontInterpolate }] },
          { backgroundColor: course.color }
        ]}>
          <View style={styles.cardContent}>
            <Text style={styles.cardIcon}>{course.icon}</Text>
            <Text style={styles.cardTitle}>{course.title}</Text>
            {course.completed && (
              <View style={styles.completedBadge}>
                <Ionicons name="checkmark-circle" size={24} color="white" />
              </View>
            )}
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
            
            {course.completed && (
              <View style={styles.completedTextContainer}>
                <Ionicons name="checkmark-circle" size={16} color="green" />
                <Text style={styles.completedText}>Curso completado</Text>
              </View>
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const CourseDetailsModal = ({ course, onClose }) => {
    if (!course) return null;
    
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
              <Text style={styles.modalSubtitle}>Intervenciones oportunas</Text>
              
              {course.completed && (
                <View style={styles.modalCompletedBadge}>
                  <Ionicons name="checkmark-circle" size={20} color="white" />
                  <Text style={styles.modalCompletedText}>Completado</Text>
                </View>
              )}
            </View>
            
            <ScrollView style={styles.modalBody}>
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
              
              {!course.completed && (
                <TouchableOpacity 
                  style={[styles.scanQrButton, { backgroundColor: course.color }]}
                  onPress={() => {
                    requestCameraPermission();
                    setShowScanner(true);
                  }}
                >
                  <Ionicons name="qr-code-outline" size={20} color="white" />
                  <Text style={styles.scanQrButtonText}>Escanear código QR para completar</Text>
                </TouchableOpacity>
              )}
              
              {course.completed && (
                <View style={styles.completedCourseInfo}>
                  <Ionicons name="checkmark-circle" size={30} color="green" />
                  <Text style={styles.completedCourseText}>
                    Este curso ha sido completado exitosamente
                  </Text>
                </View>
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

  const QRScannerModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showScanner}
        onRequestClose={() => {
          setShowScanner(false);
          setScanned(false);
        }}
      >
        <View style={styles.qrScannerContainer}>
          <View style={styles.qrScannerContent}>
            <View style={styles.qrScannerHeader}>
              <Text style={styles.qrScannerTitle}>Escanea el código QR del curso</Text>
            </View>
            
            <View style={styles.scannerContainer}>
              {hasPermission === null ? (
                <Text style={styles.permissionText}>Solicitando permiso de cámara...</Text>
              ) : hasPermission === false ? (
                  <Text style={styles.permissionText}>Sin acceso a la cámara</Text>
                ) : (
                  <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={styles.scanner}
                  />

              )}
              
              <View style={styles.scannerOverlay}>
                <View style={styles.scannerMarker} />
              </View>
              
              {scanned && (
                <TouchableOpacity 
                  style={styles.scanAgainButton}
                  onPress={() => setScanned(false)}
                >
                  <Text style={styles.scanAgainButtonText}>Escanear de nuevo</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <TouchableOpacity 
              style={styles.cancelScanButton}
              onPress={() => {
                setShowScanner(false);
                setScanned(false);
              }}
            >
              <Text style={styles.cancelScanButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
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
            <Text style={styles.statValue}>{completedCourses}</Text>
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
          {coursesList.map((course) => (
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
      
      <QRScannerModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  highlightedCard: {
    borderColor: '#1a397c',
    borderWidth: 2,
  },
  completedCard: {
    borderColor: 'green',
    borderWidth: 2,
  },
  completedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'green',
    borderRadius: 12,
    padding: 2,
  },
  completedTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  completedText: {
    color: 'green',
    fontSize: 12,
    marginLeft: 4,
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
  modalCompletedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    marginTop: 10,
  },
  modalCompletedText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
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

    scanQrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  scanQrButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  completedCourseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 200, 0, 0.1)',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  completedCourseText: {
    color: 'green',
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },
  qrScannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  qrScannerContent: {
    width: '90%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  qrScannerHeader: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#1a397c',
  },
  qrScannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  scannerContainer: {
    flex: 1,
    position: 'relative',
  },
  scanner: {
    flex: 1,
  },
  scannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerMarker: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
  scanAgainButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#1a397c',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  scanAgainButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelScanButton: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#ff6348',
  },
  cancelScanButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  permissionText: {
    textAlign: 'center',
    padding: 20,
    color: '#555',
  },

  permissionContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#fff',
},
scannerOverlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'transparent',
},
scannerMarker: {
  width: 250,
  height: 250,
  borderWidth: 2,
  borderColor: 'white',
  backgroundColor: 'transparent',
},
closeButton: {
  position: 'absolute',
  top: 40,
  right: 20,
  backgroundColor: 'rgba(0,0,0,0.5)',
  borderRadius: 20,
  padding: 10,
},
});

