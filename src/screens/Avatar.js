import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image as ExpoImage } from 'expo-image';

export default function Avatar({ navigation }) {
  const [selectedAccessories, setSelectedAccessories] = useState([]);

  const accessories = [
    { 
      id: 1, 
      name: 'Gafas de sol', 
      image: require('../../assets/gafas.png'),
      position: { top: 50, left: 60, width: 120, height: 60 } 
    },
    { 
      id: 2, 
      name: 'Cuaderno DIA', 
      image: require('../../assets/cuaderno.png'),
      position: { top: 150, left: 40, width: 80, height: 100 }
    },
    { 
      id: 3, 
      name: 'Estetoscopio', 
      image: require('../../assets/estetoscopio.png'),
      position: { top: 120, left: 80, width: 100, height: 80 }
    },
    { 
      id: 4, 
      name: 'Botiquín', 
      image: require('../../assets/botiquin.png'),
      position: { top: 180, left: 70, width: 90, height: 90 }
    },
    { 
      id: 5, 
      name: 'Gorra azul', 
      image: require('../../assets/gorra.png'),
      position: { top: 30, left: 55, width: 130, height: 70 }
    },
  ];

  const toggleAccessory = (id) => {
    if (selectedAccessories.includes(id)) {
      setSelectedAccessories(selectedAccessories.filter((acc) => acc !== id));
    } else if (selectedAccessories.length < 2) {
      setSelectedAccessories([...selectedAccessories, id]);
    } else {
      alert('Solo puedes seleccionar 2 accesorios.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Título */}

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
            source={require('../../assets/alex.png')} 
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

        {/* Accesorios en lista vertical */}
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
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Botón para continuar */}
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => navigation.navigate('RegistroC')}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A237E',
    textAlign: 'center',
    marginBottom: 10,
  },
  progressBarContainer: {
    height: 30,
    width: '90%',
    backgroundColor: '#ccc',
    borderRadius: 70,
    alignSelf: 'center',
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1A237E',
    borderRadius: 70,
  },
  speechBubble: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 20,
    borderColor: '#aaa',
    borderWidth: 1,
    alignSelf: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  speechText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  lionSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lionContainer: {
    width: 220,
    height: 320,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lionImage: {
    width: 250,
    height: 250,
  },
  accessoryImage: {
    position: 'absolute',
  },
  accessoryListVertical: {
    marginLeft: 10,
    height: 320,
    justifyContent: 'space-around',
  },
  accessoryItemVertical: {
    backgroundColor: '#eee',
    padding: 5,
    borderRadius: 10,
    marginVertical: 5,
  },
  selectedItem: {
    borderColor: '#1A237E',
    borderWidth: 2,
  },
  accessoryThumbnail: {
    width: 60,
    height: 60,
  },
  continueButton: {
    backgroundColor: '#1A237E',
    paddingVertical: 14,
    borderRadius: 20,
    marginTop: 200,
    alignSelf: 'center',
    paddingHorizontal: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    textTransform: 'uppercase',
  },
});
