import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image as ExpoImage } from 'expo-image';

export default function Avatar({ navigation }) {
  const [selectedAccessories, setSelectedAccessories] = useState([]);

  // Accesorios con posiciones ajustadas para que encajen mejor
  const accessories = [
    { 
      id: 1, 
      name: 'Gafas de sol', 
      image: require('../../assets/gafas.png'),
      position: { top: '30%', left: '15%', width: '55%', height: '10%' } 
    },
    { 
      id: 2, 
      name: 'Cuaderno DIA', 
      image: require('../../assets/cuaderno.png'),
      position: { top: '60%', left: '10%', width: '30%', height: '40%' }
    },
    { 
      id: 5, 
      name: 'Gorra azul', 
      image: require('../../assets/gorra.png'),
      position: { top: '15%', left: '10%', width: '70%', height: '20%' }
    },
  ];

  const toggleAccessory = (id) => {
    if (selectedAccessories.includes(id)) {
      setSelectedAccessories(selectedAccessories.filter((acc) => acc !== id));
    } else if (selectedAccessories.length < 1) { // Permitir hasta 2 accesorios
      setSelectedAccessories([...selectedAccessories, id]);
    } else {
      alert('Solo puedes seleccionar 1 accesorio.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Barra de progreso */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: '80%' }]} />
      </View>

      {/* Burbuja de diálogo */}
      <View style={styles.speechBubble}>
        <Text style={styles.speechText}>
          ¿Estoy entre estos...{'\n'}¿cuál me hace ver más pro?
        </Text>
      </View>

      {/* León con accesorios */}
      <View style={styles.lionSection}>
        <View style={styles.lionContainer}>
          <ExpoImage 
            source={require('../../assets/avatar.gif')} 
            style={styles.lionImage}
            contentFit="contain"
          />

          {selectedAccessories.map(id => {
            const accessory = accessories.find(acc => acc.id === id);
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
          })}
        </View>

        {/* Lista de accesorios */}
        <View style={styles.accessoryListVertical}>
          {accessories.map((accessory) => (
            <TouchableOpacity
              key={accessory.id}
              style={[
                styles.accessoryItemVertical,
                selectedAccessories.includes(accessory.id) && styles.selectedItem
              ]}
              onPress={() => toggleAccessory(accessory.id)}
            >
              <ExpoImage 
                source={accessory.image} 
                style={styles.accessoryThumbnail}
                contentFit="contain"
              />
              <Text style={styles.accessoryName}>{accessory.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Botón para continuar */}
      <TouchableOpacity
        style={[
          styles.continueButton,
          selectedAccessories.length === 0 && styles.disabledButton
        ]}
        onPress={() => navigation.navigate('RegistroC')}
        disabled={selectedAccessories.length === 0}
      >
        <Text style={styles.buttonText}>¡EMPECEMOS A RUGIR!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  progressBarContainer: {
    height: 20,
    width: '90%',
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    alignSelf: 'center',
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1A237E',
    borderRadius: 5,
  },
  speechBubble: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 20,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    alignSelf: 'center',
    marginVertical: 15,
    maxWidth: '80%',
  },
  speechText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  lionSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  lionContainer: {
    width: 250,
    height: 300,
    position: 'relative',
  },
  lionImage: {
    width: '120%',
    height: '150%',
  },
  accessoryListVertical: {
    marginLeft: 2,
    height: 300,
    justifyContent: 'space-around',
  },
  accessoryItemVertical: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 50,
    marginVertical: 20,
    alignItems: 'center',
    width: 100,
  },
  selectedItem: {
    borderColor: '#1A237E',
    borderWidth: 3,
    backgroundColor: '#E3F2FD',
  },
  accessoryThumbnail: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  accessoryName: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  continueButton: {
    backgroundColor: '#0056b3',
    paddingVertical: 15,
    borderRadius: 55,
    marginTop: 120,
    alignSelf: 'center',
    paddingHorizontal: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#0056b3',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
});
