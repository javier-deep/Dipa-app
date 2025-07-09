import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AvatarDisplay({ size = 100, style = {} }) {
  const [avatarConfig, setAvatarConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configuración de accesorios ajustada para que se vean bien
  const accessories = [
    { 
      id: 1, 
      name: 'Gafas de sol', 
      image: require('../../assets/gafas.png'),
      position: { top: '25%', left: '20%', width: '50%', height: '15%' } // Posición para los ojos
    },
    { 
      id: 2, 
      name: 'Cuaderno DIA', 
      image: require('../../assets/cuaderno.png'),
      position: { top: '50%', left: '65%', width: '25%', height: '30%' } // En la mano derecha
    },
    { 
      id: 5, 
      name: 'Gorra azul', 
      image: require('../../assets/gorra.png'),
      position: { top: '5%', left: '20%', width: '50%', height: '25%' } // En la cabeza
    },
  ];

  useEffect(() => {
    loadAvatarConfig();
  }, []);

  const loadAvatarConfig = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      const userData = userDataString ? JSON.parse(userDataString) : null;
      
      if (userData && userData.avatarConfig) {
        setAvatarConfig(userData.avatarConfig);
      }
    } catch (error) {
      console.error('Error loading avatar config:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { width: size, height: size }, style]}>
        <ExpoImage 
          source={require('../../assets/avatar.gif')} 
          style={styles.lionImage}
          contentFit="contain"
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      {/* Avatar base */}
      <ExpoImage 
        source={require('../../assets/avatar.gif')} 
        style={styles.lionImage}
        contentFit="contain"
      />

      {/* Accesorios */}
      {avatarConfig && avatarConfig.selectedAccessories && 
        avatarConfig.selectedAccessories.map(id => {
          const accessory = accessories.find(acc => acc.id === id);
          if (!accessory) return null;
          
          return (
            <ExpoImage
              key={id}
              source={accessory.image}
              style={[
                styles.accessoryImage,
                {
                  position: 'absolute',
                  top: accessory.position.top,
                  left: accessory.position.left,
                  width: accessory.position.width,
                  height: accessory.position.height
                }
              ]}
              contentFit="contain"
            />
          );
        })
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  lionImage: {
    width: '100%', 
    height: '100%', 
  },
  accessoryImage: {
    position: 'absolute',
  },
});