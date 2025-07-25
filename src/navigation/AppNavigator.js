import { createStackNavigator } from '@react-navigation/stack';
import { Animated, Easing } from 'react-native';
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
import Perfil from '../screens/Perfil';

const Stack = createStackNavigator();

const scaleTransition = {
  gestureDirection: 'vertical',
  transitionSpec: {
    open: {
      animation: 'spring',
      config: {
        stiffness: 1000,
        damping: 800,
        mass: 20,
        overshootClamping: true,
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: 900,
        easing: Easing.out(Easing.exp),
      },
    },
  },
  cardStyleInterpolator: ({ current }) => {
    const scale = current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 1],
    });

    const opacity = current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return {
      cardStyle: {
        transform: [{ scale }],
        opacity,
      },
    };
  },
};

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        ...scaleTransition,
      }}
    >
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
      <Stack.Screen name="Perfil" component={Perfil}/>
      <Stack.Screen name="Principal" component={Principal}/>
    </Stack.Navigator>
  );
}