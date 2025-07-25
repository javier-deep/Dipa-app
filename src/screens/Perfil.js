import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Linking } from 'react-native';
import QRCode from 'react-native-qrcode-svg'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { useAuth } from '../context/AuthContext';

const getAvatarPNG = (accessory) => {
  switch (accessory) {
    case 'glasses':
      return require('../../assets/avatar/LeonLentes.png');
    case 'hat':
      return require('../../assets/avatar/LeonGorra.png');
    case 'book':
      return require('../../assets/avatar/LeonLibro.png');
    default:
      return require('../../assets/avatar/LeonSimple.png');
  }
};

export default function Perfil() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAccessory, setSelectedAccessory] = useState('default');
  const viewShotRef = useRef();
  const [userData, setUserData] = useState({
    nombres: '',
    primer_apellido: '',
    matricula: '',
    academia: '',
    sede: '',
    avatarConfig: null,
    avatarBase: 'leon'
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (user) {
          // Cargar datos del contexto de autenticación
          setUserData({
            nombres: user.nombres || '',
            primer_apellido: user.primer_apellido || '',
            matricula: user.matricula || '',
            academia: user.academia || '',
            sede: user.sede || '',
            avatarConfig: user.avatarConfig || null,
            avatarBase: user.avatarBase || 'leon'
          });
          
          // También puedes cargar desde AsyncStorage como respaldo
          const storedNombre = await AsyncStorage.getItem('nombres');
          const storedApellido = await AsyncStorage.getItem('primer_apellido');
          const storedMatricula = await AsyncStorage.getItem('matricula');
          
          if (storedNombre && storedApellido && storedMatricula) {
            setUserData(prev => ({
              ...prev,
              nombres: storedNombre,
              primer_apellido: storedApellido,
              matricula: storedMatricula
            }));
          }
        }
      } catch (error) {
        console.log('Error loading user data:', error);
      }
    };

    loadUserData();
  }, [user]);

  const generateQRData = () => {
    const profileData = {
      nombre: `${userData.nombres} ${userData.primer_apellido}`,
      matricula: userData.matricula,
      academia: userData.academia,
      sede: userData.sede,
      centro: "Centro Universitario DIPA",
      username: "Maxnic",
      whatsapp: "3315857228",
      instagram: "dipa_oficial",
      facebook: "CUDipa"
    };
    return JSON.stringify(profileData);
  };

  const saveImageToGallery = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Se necesitan permisos para guardar la imagen');
        return;
      }

      const uri = await viewShotRef.current.capture({
        format: 'png',
        quality: 1.0,
      });

      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('DIPA Cards', asset, false);
      
      Alert.alert('Éxito', 'Imagen guardada en la galería');
    } catch (error) {
      console.error('Error al guardar imagen:', error);
      Alert.alert('Error', 'No se pudo guardar la imagen');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons 
          name="arrow-back-outline" 
          size={24} 
          color="#000" 
          onPress={() => navigation.goBack()} 
        />
        <Ionicons name="settings-outline" size={24} color="#000" />
      </View>

      <View style={styles.speechBubble}>
        <Text style={styles.speechText}>¡Un león disciplinado nunca se detiene!</Text>
      </View>

      {/* Mostrar avatar personalizado o el predeterminado */}
      <View style={styles.avatarContainer}>
        {userData.avatarConfig ? (
          <Image 
            source={{ uri: `data:image/png;base64,${userData.avatarConfig}` }}
            style={styles.avatar}
            resizeMode="contain"
          />
        ) : (
          <Image 
            source={getAvatarPNG(selectedAccessory)} 
            style={styles.avatar} 
            resizeMode="contain"
          />
        )}
      </View>

      <Text style={styles.name}>{userData.nombres} {userData.primer_apellido}</Text>
      <Text style={styles.school}>{userData.academia}</Text>
      <Text style={styles.code}>{userData.matricula}</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Sede</Text>
          <Text style={styles.statValue}>{userData.sede}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Siguiendo</Text>
          <Text style={styles.statValue}>0</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Seguidores</Text>
          <Text style={styles.statValue}>0</Text>
        </View>
      </View>

      <Text style={styles.streakText}>¡No pierdas la racha, rugidor!</Text>
      <Text style={styles.streakSubtext}>¡Junta 10 y reclama un taller totalmente gratis!</Text>

      <View style={styles.streakIcons}>
        {[...Array(5)].map((_, index) => (
          <Ionicons key={index} name="flame-outline" size={24} color="#ff6600" />
        ))}
      </View>

      <TouchableOpacity style={styles.shareButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="share-social-outline" size={20} color="#fff" />
        <Text style={styles.shareText}>COMPARTIR PERFIL</Text>
      </TouchableOpacity>

      <Modal 
        visible={modalVisible}
        animationType="fade"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={customModal.container}>
          <TouchableOpacity style={customModal.backButton} onPress={() => setModalVisible(false)}>
            <Ionicons name="arrow-back-outline" size={28} color="#000" />
          </TouchableOpacity>

          <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1.0 }}>
            <View style={customModal.card}>
              <View style={customModal.cardHeader}>
                {userData.avatarConfig ? (
                  <Image 
                    source={{ uri: `data:image/png;base64,${userData.avatarConfig}` }}
                    style={customModal.cardImage}
                  />
                ) : (
                  <Image 
                    source={getAvatarPNG(selectedAccessory)} 
                    style={customModal.cardImage} 
                  />
                )}
              </View>
              
              <View style={customModal.infoContainer}>
                <View style={customModal.leftInfo}>
                  <Text style={customModal.name}>{userData.nombres} {userData.primer_apellido}</Text>
                  <Text style={customModal.center}>Centro Universitario DIPA</Text>
                  <Text style={customModal.username}>Maxnic</Text>
                </View>
                <View style={customModal.qrContainer}>
                  <QRCode
                    value={generateQRData()}
                    size={80}
                    color="#000000"
                    backgroundColor="#FFFFFF"
                  />
                </View>
              </View>
            </View>
          </ViewShot>

          <Text style={customModal.shareText}>¡SÍGUENOS EN REDES SOCIALES!</Text>

          <View style={customModal.socialIcons}>
            <View style={customModal.iconColumn}>
              <TouchableOpacity 
                style={[customModal.socialIcon, customModal.whatsappIcon]}
                onPress={() => Linking.openURL('https://api.whatsapp.com/send?phone=3315857228')}
              >
                <FontAwesome name="whatsapp" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={customModal.iconLabel}>WhatsApp</Text>
            </View>
            
            <View style={customModal.iconColumn}>
              <TouchableOpacity 
                style={[customModal.socialIcon, customModal.instagramIcon]}
                onPress={() => Linking.openURL('https://www.instagram.com/dipa_oficial?igsh=MXAwOWZ2eHl1Nzl5cw==')}
              >
                <FontAwesome name="instagram" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={customModal.iconLabel}>Instagram</Text>
            </View>
            
            <View style={customModal.iconColumn}>
              <TouchableOpacity 
                style={[customModal.socialIcon, customModal.facebookIcon]}
                onPress={() => Linking.openURL('https://www.facebook.com/share/19rsjhG4zP/?mibextid=wwXIfr')}
              >
                <FontAwesome name="facebook" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={customModal.iconLabel}>Facebook</Text>
            </View>

            <View style={customModal.iconColumn}>
              <TouchableOpacity 
                style={[customModal.socialIcon, customModal.tiktokIcon]} 
                onPress={() => Linking.openURL('https://www.tiktok.com/@dipaoficial?_t=ZS-8xtXJKJhXKU&_r=1')}
              >
                <Image source={require('../../assets/tiktok.png')} style={{ width: 24, height: 24 }} resizeMode="contain" />
              </TouchableOpacity>
              <Text style={customModal.iconLabel}>Tiktok</Text>
            </View>
          </View>

          <View style={customModal.bottomOptions}>
            <TouchableOpacity style={customModal.option} onPress={saveImageToGallery}>
              <Ionicons name="download-outline" size={24} color="#000" />
              <Text style={customModal.optionText}>Guardar imagen</Text>
            </TouchableOpacity>
            <TouchableOpacity style={customModal.option} onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="#000" />
              <Text style={customModal.optionText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#fff' 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  speechBubble: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    alignSelf: 'center',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  speechText: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  avatar: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    borderRadius: 150,
  },
  name: { 
    textAlign: 'center', 
    fontWeight: 'bold', 
    fontSize: 22, 
    marginTop: 8 
  },
  school: { 
    textAlign: 'center', 
    fontSize: 14, 
    color: '#555' 
  },
  code: { 
    textAlign: 'center', 
    fontSize: 13, 
    letterSpacing: 2, 
    color: '#000', 
    marginBottom: 16 
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  statBox: { 
    flex: 1, 
    alignItems: 'center' 
  },
  statLabel: { 
    fontSize: 12, 
    color: '#777' 
  },
  statValue: { 
    fontSize: 14, 
    fontWeight: 'bold' 
  },
  streakText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 10,
    color: '#001F54',
  },
  streakSubtext: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  streakIcons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  shareButton: {
    flexDirection: 'row',
    backgroundColor: '#001F54',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 10,
  },
  shareText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

const customModal = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    alignItems: 'center',
    marginTop: 40,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  card: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 20,
    padding: 30,
    marginTop: 60,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  cardImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 30,
  },
  leftInfo: {
    flex: 1,
    paddingRight: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left',
    marginBottom: 8,
  },
  center: {
    fontSize: 13,
    color: '#666',
    textAlign: 'left',
    marginBottom: 8,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00BFFF',
    textAlign: 'left',
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareText: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#999',
    fontSize: 12,
    marginBottom: 20,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 30,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    marginBottom: 30,
    width: '100%',
  },
  iconColumn: {
    alignItems: 'center',
    flex: 1,
  },
  socialIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  whatsappIcon: {
    backgroundColor: '#25D366',
  },
  tiktokIcon: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000',
  },
  instagramIcon: {
    backgroundColor: '#E4405F',
  },
  facebookIcon: {
    backgroundColor: '#1877F2',
  },
  iconLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  bottomOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 20,
  },
  option: {
    alignItems: 'center',
    flex: 1,
  },
  optionText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
});