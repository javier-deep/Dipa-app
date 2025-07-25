import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Dimensions,
  Image,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ViewShot from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

const screenWidth = Dimensions.get('window').width;
const API_URL = 'http://10.169.169.134:3000/api'; // Ajusta tu URL

// Componente Avatar Simple
const SimpleAvatar = ({ selectedAccessory, style }) => {
  const getAvatarImage = () => {
    switch (selectedAccessory) {
      case 'glasses': return require('../../assets/avatar/LeonLentes.png');
      case 'hat': return require('../../assets/avatar/LeonGorra.png');
      case 'book': return require('../../assets/avatar/LeonLibro.png');
      default: return require('../../assets/avatar/LeonSimple.png');
    }
  };

  return (
    <Image 
      source={getAvatarImage()} 
      style={style}
      resizeMode="contain"
    />
  );
};

export default function AvatarScreen({ navigation, route }) {
  const [selectedAccessory, setSelectedAccessory] = useState('default');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);
  const [userMatricula, setUserMatricula] = useState('');
  const [avatarData, setAvatarData] = useState(null);
  const avatarRef = useRef();

  // Métodos para obtener la imagen en base64
  const captureAvatarWithViewShot = async () => {
    try {
      if (!avatarRef.current) {
        throw new Error('Referencia del avatar no disponible');
      }
      const base64Data = await avatarRef.current.capture({
        format: 'png',
        quality: 0.9,
        result: 'base64'
      });
      return base64Data;
    } catch (error) {
      console.log('Error en ViewShot:', error.message);
      return null;
    }
  };

  const convertAssetToBase64 = async (accessory) => {
    try {
      let assetModule;
      switch (accessory) {
        case 'glasses': assetModule = require('../../assets/avatar/LeonLentes.png'); break;
        case 'hat': assetModule = require('../../assets/avatar/LeonGorra.png'); break;
        case 'book': assetModule = require('../../assets/avatar/LeonLibro.png'); break;
        default: assetModule = require('../../assets/avatar/LeonSimple.png'); break;
      }

      const asset = Asset.fromModule(assetModule);
      await asset.downloadAsync();
      
      if (!asset.localUri) {
        throw new Error('No se pudo obtener la URI local del asset');
      }

      const base64 = await FileSystem.readAsStringAsync(asset.localUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.log('Error en conversión de asset:', error.message);
      return null;
    }
  };

  const getAvatarBase64 = async (accessory) => {
    // Intentar método 1: ViewShot
    let base64Data = await captureAvatarWithViewShot();
    if (base64Data) return base64Data;
    
    // Intentar método 2: Asset conversion
    base64Data = await convertAssetToBase64(accessory);
    if (base64Data) return base64Data;
    
    // Método 3: Placeholder (fallback)
    return 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77zgAAAABJRU5ErkJggg==';
  };

  const getNombreImagen = (accessory) => {
    switch (accessory) {
      case 'glasses': return 'LeonLentes.png';
      case 'hat': return 'LeonGorra.png';
      case 'book': return 'LeonLibro.png';
      default: return 'LeonSimple.png';
    }
  };

  // Guardar avatar en el servidor
  const saveAvatarToServer = async (matricula, accessory) => {
    try {
      setIsLoading(true);
      
      const imagen_base64 = await getAvatarBase64(accessory);
      const nombre_imagen = getNombreImagen(accessory);

      if (!imagen_base64) {
        throw new Error('No se pudo generar la imagen del avatar');
      }

      // Verificar matrícula
      if (!matricula) {
        throw new Error('No se encontró la matrícula del usuario');
      }

      console.log('Enviando datos:', {
        matricula: matricula.trim().toUpperCase(),
        imagen_png: imagen_base64,
        nombre_imagen,
        accessory
      });

      const response = await fetch(`${API_URL}/avatar/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: matricula.trim().toUpperCase(), // Cambiado a userId para coincidir con el backend
          avatarConfig: { accessory },
          imagen_png: imagen_base64,
          nombre_imagen
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar el avatar');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error al guardar avatar:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar avatar existente
  const loadAvatarFromServer = async (matricula) => {
    try {
      const response = await fetch(`${API_URL}/avatar/auth/user/${matricula}`);
      if (!response.ok) return null;
      
      const result = await response.json();
      
      if (result.success && result.user?.hasAvatar) {
        return {
          success: true,
          data: result.user.avatarData,
          avatarConfig: { accessory: result.user.avatarData?.accessory || 'default' }
        };
      }
      return null;
    } catch (error) {
      console.error('Error al cargar avatar:', error);
      return null;
    }
  };

  // Verificar estado de registro
  const checkRegistrationStatus = async () => {
    try {
      const matricula = await AsyncStorage.getItem('userMatricula');
      if (!matricula) return false;

      setUserMatricula(matricula);
      
      const serverAvatar = await loadAvatarFromServer(matricula);
      
      if (serverAvatar?.success) {
        setAvatarData(serverAvatar.data);
        setSelectedAccessory(serverAvatar.avatarConfig?.accessory || 'default');
        setIsRegistrationComplete(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error verificando registro:', error);
      return false;
    }
  };

  useEffect(() => {
    // Cargar matrícula desde parámetros de navegación si existe
    if (route.params?.matricula) {
      setUserMatricula(route.params.matricula);
      AsyncStorage.setItem('userMatricula', route.params.matricula);
    }
    
    checkRegistrationStatus();
  }, [route.params]);

  const handleAccessorySelect = (accessoryId) => {
    if (isRegistrationComplete) {
      Alert.alert(
        'Avatar ya creado',
        'Tu avatar ya fue creado durante el registro y no se puede modificar.'
      );
      return;
    }
    setSelectedAccessory(accessoryId);
  };

  const completeRegistration = async () => {
    try {
      if (!userMatricula) {
        throw new Error('No se encontró la matrícula del usuario');
      }

      const result = await saveAvatarToServer(userMatricula, selectedAccessory);

      if (result.success) {
        await AsyncStorage.multiSet([
          ['selectedAccessory', selectedAccessory],
          ['registrationComplete', 'true'],
          ['avatarCreated', 'true']
        ]);

        setIsRegistrationComplete(true);
        setAvatarData(result.data);

        Alert.alert(
          '¡Registro completado!',
          'Tu avatar ha sido creado exitosamente',
          [{ 
            text: 'Continuar', 
            onPress: () => navigation.navigate('Inicio') 
          }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error al guardar',
        error.message,
        [
          { text: 'Reintentar', onPress: completeRegistration },
          { text: 'Cancelar', style: 'cancel' }
        ]
      );
    }
  };

  const renderCompletedMessage = () => (
    <View style={styles.completedMessageContainer}>
      <Text style={styles.completedMessageText}>
        ✅ Tu registro está completo y tu avatar ya fue creado
      </Text>
      <Text style={styles.completedMessageSubtext}>
        Matrícula: {userMatricula}
      </Text>
      {avatarData?.accessory && (
        <Text style={styles.completedMessageSubtext}>
          Accesorio: {avatarData.accessory}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[
            styles.progressFill, 
            { width: isRegistrationComplete ? '100%' : '80%' }
          ]} />
        </View>
      </View>

      {isRegistrationComplete && renderCompletedMessage()}

      {!isRegistrationComplete ? (
        <View style={styles.questionContainer}>
          <View style={styles.speechBubble}>
            <Text style={styles.questionText}>¡Ya casi terminamos!</Text>
            <Text style={styles.questionText}>¿Cuál accesorio me queda mejor?</Text>
            <Text style={styles.questionSubtext}>Matrícula: {userMatricula}</Text>
            <Text style={styles.questionSubtext}>🖼️ Tu imagen se guardará en el servidor</Text>
          </View>
        </View>
      ) : (
        <View style={styles.welcomeContainer}>
          <View style={styles.welcomeBubble}>
            <Text style={styles.welcomeText}>¡Hola de nuevo!</Text>
            <Text style={styles.welcomeText}>Este es tu avatar personalizado</Text>
          </View>
        </View>
      )}

      <View style={styles.mainContent}>
        <ViewShot 
          ref={avatarRef} 
          options={{ 
            format: "png", 
            quality: 0.9,
            backgroundColor: 'transparent'
          }}
          style={styles.avatarContainer}
        >
          <SimpleAvatar 
            selectedAccessory={selectedAccessory}
            style={styles.avatarImage}
          />
        </ViewShot>

        {!isRegistrationComplete && (
          <View style={styles.accessoriesContainer}>
            <TouchableOpacity 
              style={[
                styles.accessoryItem, 
                styles.accessoryTopRight,
                selectedAccessory === 'glasses' && styles.accessorySelected
              ]}
              onPress={() => handleAccessorySelect('glasses')}
              disabled={isLoading}
            >
              <Image 
                source={require('../../assets/gafas.png')}
                style={styles.accessoryIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.accessoryItem, 
                styles.accessoryMiddleRight,
                selectedAccessory === 'book' && styles.accessorySelected
              ]}
              onPress={() => handleAccessorySelect('book')}
              disabled={isLoading}
            >
              <Image 
                source={require('../../assets/cuaderno.png')}
                style={styles.accessoryIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.accessoryItem, 
                styles.accessoryBottomRight,
                selectedAccessory === 'hat' && styles.accessorySelected
              ]}
              onPress={() => handleAccessorySelect('hat')}
              disabled={isLoading}
            >
              <Image 
                source={require('../../assets/gorra.png')}
                style={styles.accessoryIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.accessoryItem, 
                styles.accessoryBottomLeft,
                selectedAccessory === 'default' && styles.accessorySelected
              ]}
              onPress={() => handleAccessorySelect('default')}
              disabled={isLoading}
            >
              <Ionicons name="person" size={25} color="#666" />
              <Text style={styles.accessoryText}>Sin accesorio</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.startButton, isLoading && styles.buttonDisabled]}
          onPress={isRegistrationComplete ? () => navigation.navigate('Inicio') : completeRegistration}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.startButtonText}>
              {isRegistrationComplete ? '¡IR A LA APP!' : '¡EMPECEMOS A RUGIR!'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1a237e',
    borderRadius: 4,
  },
  completedMessageContainer: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  completedMessageText: {
    color: '#2e7d32',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  completedMessageSubtext: {
    color: '#2e7d32',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '400',
  },
  questionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  welcomeContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  speechBubble: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  welcomeBubble: {
    backgroundColor: '#e3f2fd',
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#1976d2',
  },
  questionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
  },
  questionSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  welcomeText: {
    fontSize: 16,
    color: '#1565c0',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 400,
    height: 637,
  },
  accessoriesContainer: {
    position: 'absolute',
    width: 350,
    height: 340,
    right: 0,
  },
  accessoryItem: {
    position: 'absolute',
    width: 70,
    height: 70,
    backgroundColor: '#fff',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  accessorySelected: {
    backgroundColor: '#e3f2fd',
    borderWidth: 2,
    borderColor: '#1976d2',
  },
  accessoryTopRight: {
    top: 20,
    right: 20,
  },
  accessoryMiddleRight: {
    top: 120,
    right: 20,
  },
  accessoryBottomRight: {
    bottom: 50,
    right: 20,
  },
  accessoryBottomLeft: {
    bottom: 50,
    left: 20,
  },
  accessoryIcon: {
    width: 35,
    height: 35,
  },
  accessoryText: {
    fontSize: 8,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  startButton: {
    backgroundColor: '#1a237e',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    elevation: 3,
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});