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
  Alert,
  TextInput,
  Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get('window');
import FlamaGif from '../../assets/flama.gif';
//import { useAuth } from '../../context/AuthContext'; // Asegúrate de tener este contexto
import { useAuth } from '../context/AuthContext';
// Función para hashear códigos
const hashCode = (code) => {
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    const char = code.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; 
  }
  return Math.abs(hash).toString();
};

// Validar formato de código
const validateCodeFormat = (code) => {
  const codeRegex = /^[A-Z0-9]{6,12}$/;
  return codeRegex.test(code);
};

// Generar código seguro aleatorio
const generateSecureCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export default function App({ navigation }) {
  const { user } = useAuth(); // Obtener usuario autenticado
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [completedCourses, setCompletedCourses] = useState(0);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [showCompletionCode, setShowCompletionCode] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeLeft, setBlockTimeLeft] = useState(0);
  const [selectedSede, setSelectedSede] = useState('all');
  const [sedes, setSedes] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [completedCoursesList, setCompletedCoursesList] = useState([]);

  const textInputRef = useRef(null);
  const blockTimerRef = useRef(null);

  // Cargar cursos y sedes
  useEffect(() => {
    fetchCourses();
    fetchSedes();
    if (user?.id) {
      loadCompletedCourses();
    }
  }, [selectedSede, user?.id]);

  const fetchCourses = () => {
    fetch(`http://192.168.100.38:3000/api/cursos${selectedSede !== 'all' ? `?sede=${selectedSede}` : ''}`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(curso => ({
          id: curso.id,
          title: curso.titulo,
          icon: "📘",
          color: "#1a397c",
          codeHash: curso.hash_codigo,
          completed: completedCoursesList.some(c => c.id === curso.id),
          details: {
            description: curso.descripcion,
            modality: curso.modalidad,
            duration: curso.duracion,
            location: curso.sede_nombre || `Sede ${curso.sede}`,
            callToAction: "Información del curso",
            schedule: `${curso.hora_inicio} - ${curso.hora_fin}`,
            requirements: curso.requisitos
          }
        }));
        setCoursesList(formatted);
        setCompletedCourses(completedCoursesList.length);
      })
      .catch(err => {
        console.error('Error cargando cursos:', err);
      });
  };

  const fetchSedes = () => {
    fetch('http://192.168.100.38:3000/api/cursos/sedes')
      .then(res => res.json())
      .then(data => {
        setSedes([
          { id: 'all', name: 'Todas las sedes' },
          ...data.map(sede => ({ id: sede.id, name: sede.nombre }))
        ]);
      })
      .catch(err => {
        console.error('Error cargando sedes:', err);
      });
  };

  const loadCompletedCourses = async () => {
    try {
      const response = await fetch(`http://192.168.100.38:3000/api/cursos/completados/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setCompletedCoursesList(data);
        setCompletedCourses(data.length);
        
        // Actualizar estado de completados en la lista principal
        setCoursesList(prevCourses => 
          prevCourses.map(course => ({
            ...course,
            completed: data.some(completed => completed.id === course.id)
          }))
        );
      }
    } catch (error) {
      console.error('Error al cargar cursos completados:', error);
    }
  };

  // Timer para el bloqueo temporal
  useEffect(() => {
    if (isBlocked && blockTimeLeft > 0) {
      blockTimerRef.current = setTimeout(() => {
        setBlockTimeLeft(blockTimeLeft - 1);
      }, 1000);
    } else if (blockTimeLeft === 0 && isBlocked) {
      setIsBlocked(false);
      setAttemptCount(0);
    }

    return () => {
      if (blockTimerRef.current) {
        clearTimeout(blockTimerRef.current);
      }
    };
  }, [isBlocked, blockTimeLeft]);

  const showCodeInputModal = () => {
    setShowCodeInput(true);
    setSelectedCourse(null);
  };

  const verifyManualCode = async () => {
    if (!user?.id) {
      Alert.alert("Error", "Debes iniciar sesión para validar cursos");
      return;
    }

    if (isBlocked) {
      Alert.alert("Acceso Bloqueado", `Esperá ${blockTimeLeft} segundos antes de intentar nuevamente.`);
      return;
    }

    if (!manualCode.trim()) {
      Alert.alert("Error", "Por favor ingresa el código de finalización");
      return;
    }

    if (!validateCodeFormat(manualCode.trim())) {
      Alert.alert("Formato Incorrecto", "El código debe tener entre 6-12 caracteres alfanuméricos");
      return;
    }

    setIsValidating(true);

    try {
      const res = await fetch("http://192.168.100.38:3000/api/cursos/validar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          codigo: manualCode.trim(),
          alumnoId: user.id
        })
      });

      const data = await res.json();

      if (res.ok && data.valid) {
        // Recargar cursos completados
        await loadCompletedCourses();
        
        setAttemptCount(0);
        setShowCompletionCode({
          type: 'image',
          image: FlamaGif,
          title: `🔥 ¡Felicidades! Has completado el curso "${data.curso.titulo}" 🔥`
        });
      } else {
        throw new Error(data.message || "Código inválido");
      }
    } catch (err) {
      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);

      if (newAttemptCount >= 3) {
        setIsBlocked(true);
        setBlockTimeLeft(30);
        Alert.alert("Demasiados Intentos", "Has superado el número máximo de intentos. Bloqueado por 30 segundos.");
      } else {
        Alert.alert("Código incorrecto", `${err.message}. Intentos restantes: ${3 - newAttemptCount}`);
      }
    } finally {
      setManualCode('');
      setShowCodeInput(false);
      setIsValidating(false);
    }
  };

  const SedeSelector = () => (
    <View style={styles.sedeSelectorContainer}>
      <Text style={styles.sedeSelectorLabel}>Filtrar por sede:</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sedeSelector}
      >
        {sedes.map(sede => (
          <TouchableOpacity
            key={sede.id}
            style={[
              styles.sedeOption,
              selectedSede === sede.id && styles.sedeOptionSelected
            ]}
            onPress={() => setSelectedSede(sede.id)}
          >
            <Text style={[
              styles.sedeOptionText,
              selectedSede === sede.id && styles.sedeOptionTextSelected
            ]}>
              {sede.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
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
      if (flipped) {
        Animated.spring(animatedValue, {
          toValue: 0,
          friction: 8,
          tension: 10,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.spring(animatedValue, {
          toValue: 180,
          friction: 8,
          tension: 10,
          useNativeDriver: true,
        }).start();
      }
      setFlipped(!flipped);
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
                <View>
                  <TouchableOpacity 
                    style={[
                      styles.scanQrButton, 
                      { backgroundColor: isBlocked ? '#cccccc' : course.color }
                    ]}
                    onPress={showCodeInputModal}
                    disabled={isBlocked}
                  >
                    <Ionicons name="pencil-outline" size={20} color="white" />
                    <Text style={styles.scanQrButtonText}>
                      {isBlocked ? `Bloqueado (${blockTimeLeft}s)` : 'Ingresar código de finalización'}
                    </Text>
                  </TouchableOpacity>
                  
                  <Text style={styles.codeHintText}>
                    El instructor te proporcionará un código al finalizar el curso
                  </Text>
                  
                  {attemptCount > 0 && (
                    <Text style={styles.warningText}>
                      Intentos restantes: {3 - attemptCount}
                    </Text>
                  )}
                </View>
              )}
              
              {course.completed && (
                <View style={styles.completedCourseInfo}>
                  <Ionicons name="checkmark-circle" size={30} color="green" />
                  <Text style={styles.completedCourseText}>
                    Este curso ha sido completado exitosamente
                  </Text>
                  <TouchableOpacity 
                    style={styles.showCodeButton}
                    onPress={() => setShowCompletionCode({
                      type: 'code',
                      code: course.completionCode || 'COMPLETED'
                    })}
                  >
                    <Text style={styles.showCodeButtonText}>Ver código de completado</Text>
                  </TouchableOpacity>
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

  const CodeInputModal = () => {
    const [localCode, setLocalCode] = useState(manualCode);
    
    useEffect(() => {
      if (showCodeInput) {
        const timer = setTimeout(() => {
          textInputRef.current?.focus();
        }, 100);
        return () => clearTimeout(timer);
      }
    }, [showCodeInput]);

    const handleCodeChange = (text) => {
      const cleanText = text.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 12);
      setLocalCode(cleanText);
    };

    const handleSubmit = () => {
      setManualCode(localCode);
      verifyManualCode();
    };

    if (!showCodeInput) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCodeInput}
        onRequestClose={() => {
          setShowCodeInput(false);
          setManualCode('');
        }}
      >
        <TouchableOpacity 
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={Keyboard.dismiss}
        >
          <View style={styles.modalContent}>
            <View style={[styles.modalHeader, { backgroundColor: '#1a397c' }]}>
              <Text style={styles.modalTitle}>Código de Finalización</Text>
              <Text style={styles.modalSubtitle}>
                Ingresa el código proporcionado por tu instructor
              </Text>
              {isBlocked && (
                <Text style={styles.blockWarning}>
                  Acceso bloqueado por {blockTimeLeft} segundos
                </Text>
              )}
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalDescription}>
                Al finalizar el curso, el instructor te dará un código de 6-12 caracteres para validar tu asistencia.
              </Text>

              <View style={styles.codeInputContainer}>
                <TextInput
                  ref={textInputRef}
                  style={[
                    styles.codeInput,
                    isBlocked && styles.codeInputDisabled
                  ]}
                  placeholder="Ej: 20AS7Q"
                  value={localCode}
                  onChangeText={handleCodeChange}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  placeholderTextColor="#999"
                  keyboardType="default"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                  editable={!isBlocked && !isValidating}
                  maxLength={12}
                  selectTextOnFocus={true}
                />
                <Text style={styles.characterCount}>
                  {localCode.length}/12 caracteres
                </Text>
              </View>

              {attemptCount > 0 && !isBlocked && (
                <Text style={styles.warningText}>
                  ⚠️ Intentos restantes: {3 - attemptCount}
                </Text>
              )}

              <View style={styles.codeInputButtons}>
                <TouchableOpacity 
                  style={[styles.codeInputButton, { backgroundColor: '#cccccc' }]}
                  onPress={() => {
                    setLocalCode('');
                    setShowCodeInput(false);
                    Keyboard.dismiss();
                  }}
                  disabled={isValidating}
                >
                  <Text style={[styles.codeInputButtonText, { color: '#666' }]}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[
                    styles.codeInputButton, 
                    { 
                      backgroundColor: isBlocked || isValidating || !localCode.trim() 
                        ? '#cccccc' 
                        : '#1a397c' 
                    }
                  ]}
                  onPress={handleSubmit}
                  disabled={isBlocked || isValidating || !localCode.trim()}
                >
                  <Text style={[
                    styles.codeInputButtonText, 
                    { color: isBlocked || isValidating || !localCode.trim() ? '#666' : 'white' }
                  ]}>
                    {isValidating ? 'Validando...' : 'Validar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const CompletionCodeModal = () => {
    if (!showCompletionCode) return null;

    return (
      <Modal
  animationType="fade"
  transparent={true}
  visible={!!showCompletionCode}
  onRequestClose={() => setShowCompletionCode(null)}
>
  <View style={styles.codeDisplayContainer}>
    <View style={styles.codeDisplayContent}>
      {showCompletionCode.type === 'image' ? (
        <>
          <Image 
            source={showCompletionCode.image} 
            style={styles.completionImage}
            resizeMode="contain"
          />
          <Text style={styles.codeDisplayTitle}>
            {showCompletionCode.title}
          </Text>
          <Text style={styles.codeDisplayText}>
            Sigue así y no pierdas tu racha
          </Text>
        </>
      ) : (
              <>
                <Ionicons name="shield-checkmark" size={50} color="#2ecc71" />
                <Text style={styles.codeDisplayTitle}>Código de Completado</Text>
                <View style={styles.codeDisplayCodeContainer}>
                  <Text style={styles.codeDisplayCode}>{showCompletionCode.code}</Text>
                </View>
                <Text style={styles.codeDisplayText}>
                  Este código confirma que has completado el curso exitosamente.
                  Guárdalo como comprobante de finalización.
                </Text>
              </>
            )}
            <TouchableOpacity 
              style={styles.codeDisplayButton}
              onPress={() => setShowCompletionCode(null)}
            >
              <Text style={styles.codeDisplayButtonText}>Cerrar</Text>
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
            <Text style={styles.statValue}>0</Text>
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
        <SedeSelector />
      </View>
      
      <View style={styles.mascotContainer}>
        <Image 
          source={{ uri: 'https://vignette.wikia.nocookie.net/doblaje/images/f/f2/Alexleon.png/revision/latest?cb=20141225032252&path-prefix=es' }} 
          style={styles.mascotImage}
          resizeMode="contain"
        />
        <View style={styles.speechBubble}>
          <Text style={styles.speechBubbleText}>
            "¡Ruge con conocimiento! {"\n"}
            Un león bien capacitado siempre {"\n"}
            está un paso adelante."
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
      
      <CodeInputModal />
      <CompletionCodeModal />
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
    paddingHorizontal: 20,
    marginBottom: 15,
    alignItems: 'flex-start',
    marginTop: 10,
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
    padding: 15,
    marginLeft: 10,
    marginTop: 10,
  },
  speechBubbleText: {
    color: '#1a397c',
    fontSize: 14,
    fontWeight: '500',
  },
  cardsContainer: {
    flex: 1,
    paddingHorizontal: 5,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
    paddingBottom: 20,
  },
  card: {
    width: (width - 40) / 1,
    height: (width - 40) * 0.65,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
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
    fontSize: 20,
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
    maxHeight: '85%',
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
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 200, 0, 0.1)',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  completedCourseText: {
    color: 'green',
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  codeHintText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  warningText: {
    fontSize: 12,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 10,
  },
  blockWarning: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
    fontWeight: 'bold',
  },
  codeInputContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  codeInput: {
    borderWidth: 2,
    borderColor: '#1a397c',
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#1a397c',
    backgroundColor: '#f8f9fa',
  },
  codeInputDisabled: {
    backgroundColor: '#eee',
    color: '#999',
  },
  codeInputButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  codeInputButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  codeInputButtonText: {
    fontWeight: 'bold',
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  showCodeButton: {
    marginTop: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#1a397c',
    borderRadius: 8,
  },
  showCodeButtonText: {
    color: '#1a397c',
    fontWeight: 'bold',
  },
  codeDisplayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  codeDisplayContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    width: '80%',
    alignItems: 'center',
  },
  
  codeDisplayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1a397c',
  },
  codeDisplayCode: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2ecc71',
  },
  codeDisplayText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  codeDisplayButton: {
    padding: 12,
    backgroundColor: '#1a397c',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  codeDisplayButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  completionImage: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },

  sedeSelectorContainer: {
    marginTop: 10,
    marginBottom: 15,
    width: '100%',
  },
  sedeSelectorLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    marginLeft: 15,
  },
  sedeSelector: {
    paddingHorizontal: 10,
  },
  sedeOption: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1a397c',
    marginRight: 10,
    backgroundColor: 'white',
  },
  sedeOptionSelected: {
    backgroundColor: '#1a397c',
  },
  sedeOptionText: {
    color: '#1a397c',
    fontSize: 14,
  },
  sedeOptionTextSelected: {
    color: 'white',
  },

});