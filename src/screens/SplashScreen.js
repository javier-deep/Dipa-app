import { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated, Dimensions } from 'react-native';
import { Image } from "expo-image";

const { height, width } = Dimensions.get('window');

export default function Splash({ navigation }) {
    const ripple1 = useRef(new Animated.Value(0)).current;
    const ripple2 = useRef(new Animated.Value(0)).current;
    const ripple3 = useRef(new Animated.Value(0)).current;
    const ripple4 = useRef(new Animated.Value(0)).current;
    const ripple5 = useRef(new Animated.Value(0)).current;
    const rippleOpacity1 = useRef(new Animated.Value(0)).current;
    const rippleOpacity2 = useRef(new Animated.Value(0)).current;
    const rippleOpacity3 = useRef(new Animated.Value(0)).current;
    const rippleOpacity4 = useRef(new Animated.Value(0)).current;
    const rippleOpacity5 = useRef(new Animated.Value(0)).current;
    const contentOpacity = useRef(new Animated.Value(0)).current;
    const contentScale = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        const createRippleAnimation = (rippleScale, rippleOpacity, delay = 0, duration = 2000, maxScale = 8) => {
            return Animated.parallel([
                Animated.timing(rippleScale, {
                    toValue: 1,
                    duration: duration,
                    delay: delay,
                    useNativeDriver: true,
                }),
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(rippleOpacity, {
                        toValue: 0.8,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(rippleOpacity, {
                        toValue: 0,
                        duration: duration - 200,
                        useNativeDriver: true,
                    }),
                ]),
            ]);
        };

        const startRippleAnimation = () => {
            // Reset all values
            [ripple1, ripple2, ripple3, ripple4, ripple5].forEach(anim => anim.setValue(0));
            [rippleOpacity1, rippleOpacity2, rippleOpacity3, rippleOpacity4, rippleOpacity5].forEach(anim => anim.setValue(0));

            // Crear múltiples ondulaciones con diferentes delays y duraciones
            Animated.parallel([
                createRippleAnimation(ripple1, rippleOpacity1, 0, 2500, 6),
                createRippleAnimation(ripple2, rippleOpacity2, 300, 2200, 8),
                createRippleAnimation(ripple3, rippleOpacity3, 600, 2800, 10),
                createRippleAnimation(ripple4, rippleOpacity4, 900, 2400, 12),
                createRippleAnimation(ripple5, rippleOpacity5, 1200, 2600, 14),
            ]).start();
        };

        // Animación del contenido principal
        Animated.parallel([
            Animated.timing(contentOpacity, {
                toValue: 1,
                duration: 1500,
                delay: 800,
                useNativeDriver: true,
            }),
            Animated.spring(contentScale, {
                toValue: 1,
                tension: 40,
                friction: 8,
                delay: 800,
                useNativeDriver: true,
            }),
        ]).start();

        // Iniciar inmediatamente
        startRippleAnimation();

        // Repetir cada 3 segundos para mantener la animación muy activa
        const interval = setInterval(startRippleAnimation, 3000);

        // Navegación después de 9 segundos
        const timer = setTimeout(() => {
            navigation.replace('Inicio');
        }, 9000);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, []);

    return (
        <View style={styles.container}>
            {/* Ondulaciones múltiples y animadas */}
            <Animated.View
                style={[
                    styles.ripple,
                    styles.ripple1,
                    {
                        transform: [
                            {
                                scale: ripple1.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 6],
                                }),
                            },
                        ],
                        opacity: rippleOpacity1,
                    },
                ]}
            />
            <Animated.View
                style={[
                    styles.ripple,
                    styles.ripple2,
                    {
                        transform: [
                            {
                                scale: ripple2.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 8],
                                }),
                            },
                        ],
                        opacity: rippleOpacity2,
                    },
                ]}
            />
            <Animated.View
                style={[
                    styles.ripple,
                    styles.ripple3,
                    {
                        transform: [
                            {
                                scale: ripple3.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 10],
                                }),
                            },
                        ],
                        opacity: rippleOpacity3,
                    },
                ]}
            />
            <Animated.View
                style={[
                    styles.ripple,
                    styles.ripple4,
                    {
                        transform: [
                            {
                                scale: ripple4.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 12],
                                }),
                            },
                        ],
                        opacity: rippleOpacity4,
                    },
                ]}
            />
            <Animated.View
                style={[
                    styles.ripple,
                    styles.ripple5,
                    {
                        transform: [
                            {
                                scale: ripple5.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 14],
                                }),
                            },
                        ],
                        opacity: rippleOpacity5,
                    },
                ]}
            />

            {/* Contenido principal */}
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: contentOpacity,
                        transform: [{ scale: contentScale }],
                    },
                ]}
            >
                <Image
                    source={require('../../assets/leon.gif')}
                    style={styles.image}
                    resizeMode="contain"
                />

                <Text style={styles.title}>Maxnic</Text>
                <Text style={styles.subtitle}>Centro Universitario DIPA A.C.</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#263278',
        overflow: 'hidden',
    },
    content: {
        alignItems: 'center',
        zIndex: 10,
    },
    title: {
        fontSize: 70,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 0.5,
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 6,
    },
    subtitle: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    image: {
        width: 200,
        height: 200,
    },
    ripple: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 3,
        backgroundColor: 'transparent',
    },
    ripple1: {
        top: height * 0.5 - 30,
        left: width * 0.5 - 30,
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    ripple2: {
        top: height * 0.5 - 30,
        left: width * 0.5 - 30,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 2,
    },
    ripple3: {
        top: height * 0.5 - 30,
        left: width * 0.5 - 30,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 2,
    },
    ripple4: {
        top: height * 0.5 - 30,
        left: width * 0.5 - 30,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
    },
    ripple5: {
        top: height * 0.5 - 30,
        left: width * 0.5 - 30,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
    },
});