import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import Empecemos from '../screens/Empecemos';
import Continuar from '../screens/Continuar';
import Inicio from '../screens/Inicio';
import Datos from '../screens/Datos';
import Avatar from '../screens/Avatar';
import RegistroC from '../screens/RegistroC';
import Login from '../screens/Login';
import Cursos from '../screens/Cursos';
import Principal from '../screens/Principal';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Inicio" component={Inicio} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Empecemos" component={Empecemos} />
      <Stack.Screen name="Continuar" component={Continuar} />
      <Stack.Screen name="Datos" component={Datos} />
      <Stack.Screen name="Avatar" component={Avatar}/>
      <Stack.Screen name="RegistroC" component={RegistroC}/>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Cursos" component={Cursos}/>
      <Stack.Screen name="Principal" component={Principal}/>
    </Stack.Navigator>
  );
}
