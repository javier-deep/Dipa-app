import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Dimensions,
  Modal,
  Pressable,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

export default function Login({ navigation }) {
  const [showPassword, setShowPassword] = useState(false);
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!matricula || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://10.169.169.134:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ matricula, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      // Usar el AuthContext para manejar el login
      await login(data.user, data.token);

      navigation.navigate('Principal');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Modal de Términos y Condiciones */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={styles.modalScroll}>
              <Text style={styles.modalTitle}>Términos y Políticas de Privacidad</Text>
              <Text style={styles.modalText}>
                Centro Universitario DIPA A.C. reconoce la importancia de la protección de los datos y de la privacidad, y se compromete a proteger la información personal, incluso relacionada con la salud. 
                {"\n\n"}¿Quiénes somos?
                {"\n\n"}Centro Universitario DIPA A.C., con domicilio en Calz. Federalismo Norte 260, Col. Centro, C.P. 44100 Guadalajara, Jal. Maxnic , es el responsabel del uso y protección de sus datos personales con base en la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, su Reglamento y los lineamienos de los avisos de privacidad correspondiente, y al respecto le informamos lo siguiente:
                {"\n\n"}¿Con quién y para qué fines utilizaremos sus datos personales?
                {"\n\n"}Le informamos que sus datos personales son compartidos dentro de los departamentos existentes del Centro Universitario DIPA A.C. Compartiendo información a los niveles directivos, académicos y operativos.
                {"\n\n"}Utilizaremos su información personal para las siguientes finalidades:
                {"\n\n"}{"\u2022"} Informarle sobre las actividades académicas del Centro Universitario DIPA A.C.
                {"\n\n"}{"\u2022"} Proveer los servicios y productos que presta el Centro Universitario DIPA A.C.
                {"\n\n"}Adicionalmente, utilizaremos su información personal con fines mercadotécnicos, publicitarios o comerciales. En caso de que no desee que sus datos personales sean tratados para estos fines, desde este momento usted nos lo puede comunicar a través de nuestro sitio web www.cudipa.mx en el apartado de: Mantente informado.
                {"\n\n"}La negativa para el uso de sus datos personales para estas finalidades no podrá ser un motivo para que le neguemos los servicios y productos que solicita o contrata con nosotros.
                {"\n"}Para llevar a cabod las finalidades descritas en el presente aviso de privacidad, utilizaremos los siguientes datos personales: nombre completo, edad; sexo; domicilio; teléfono y correo electrónico particulares, CURP, fotografías y redes sociales.
                {"\n\n"}¿Cómo puede acceder, rectificar o cancelar sus datos personales, u oponerse al uso que les damos ?
                {"\n\n"}Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (Acceso). Asimismo, es su derecho solicitar la corrección de su información personal en caso de que esté desactualizada, sea inexacta o incompleta (Rectificación); que la eliminemos de nuestros registros o bases de datos cuando considere que la misma no está siendo utilizada conforme a los principios, deberes y obligaciones previstas en la normativa (Cancelación); así como oponerse al uso de sus datos personales para fines específicos (Oposición). Estos derechos se conocen como derechos ARCO.
                {"\n"}Para el ejercicio de cualquiera de los derechos ARCO, usted deberá presentar la solicitud respectiva al correo electrónico centrouniversitariodipa@gmail.com. En donde le atenderemos para hacer valer cualquiera de sus derechos ARCO.
                {"\n"}Con objeto de que usted pueda limitar el uso y divulgación de su información personal, le ofrecemos los siguientes medios:
                {"\n"}Su inscripción en el Registro Público para Evitar Publicidad, que está a cargo de la Procuraduría Federal del Consumidor, con la finalidad de que sus datos personales no sean utilizados para recibir publicidad o promociones de empresas de bienes o servicios.
              </Text>
              <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Ingresa tus datos</Text>

      <View style={styles.inputContainer}>
        {/* Campo de matrícula */}
        <TextInput
          style={styles.input}
          placeholder="Número de matrícula"
          value={matricula}
          onChangeText={setMatricula}
          autoCapitalize="characters"
          textContentType="username"
          autoCorrect={false}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Contraseña"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#999"
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginText}>INGRESAR</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('RecuperarContraseña')}>
        <Text style={styles.link}>Restablecer contraseña</Text>
      </TouchableOpacity>

      <View style={styles.feedbackContainer}>
        <Text style={styles.brand}>Maxnic</Text>
        <Text style={styles.feedbackText}>
          ¿Estás disfrutando de mi compañía en la app?
        </Text>
        <View style={styles.stars}>
          {[1, 2, 3, 4].map((i) => (
            <Ionicons key={i} name="star" size={28} color="#00bfff" />
          ))}
          <Ionicons name="star-outline" size={28} color="#00bfff" />
        </View>
      </View>

      <Text style={styles.footerText}>
        Al registrarte en Maxnic, aceptas nuestros{' '}
        <Text style={styles.termsLink} onPress={() => setModalVisible(true)}>Términos y Políticas de privacidad.</Text>
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#fff' 
  },
  backButton: { 
    marginBottom: 10 
  },
  title: { 
    fontSize: 16, 
    textAlign: 'center', 
    color: '#999', 
    marginBottom: 20 
  },
  inputContainer: { 
    gap: 12,
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    width: '90%',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    borderRadius: 10,
    width: '90%',
  },
  inputPassword: { flex: 1, paddingVertical: 12, fontSize: 16 },
  loginButton: {
    backgroundColor: '#132257',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  loginText: { color: '#fff', fontWeight: 'bold' },
  link: {
    color: '#00bfff',
    textAlign: 'center',
    marginTop: 15,
    textDecorationLine: 'underline',
  },
  feedbackContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  brand: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  feedbackText: {
    color: '#00bfff',
    fontSize: 14,
    marginVertical: 10,
    textAlign: 'center',
  },
  stars: {
    flexDirection: 'row',
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 30,
    color: '#999',
  },
  termsLink: {
    textDecorationLine: 'underline',
    color: '#000',
  },
  // Estilos para el modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: width * 0.05,
    width: '85%',
    maxHeight: '80%',
  },
  modalScroll: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: width * 0.035,
    color: '#333',
    textAlign: 'justify',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#2E3870',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.04,
  },
});


