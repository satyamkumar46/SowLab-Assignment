import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
    onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
    // Animation values
    const logoScale = useRef(new Animated.Value(0)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const titleOpacity = useRef(new Animated.Value(0)).current;
    const titleTranslateY = useRef(new Animated.Value(30)).current;
    const subtitleOpacity = useRef(new Animated.Value(0)).current;
    const subtitleTranslateY = useRef(new Animated.Value(20)).current;
    const bottomTextOpacity = useRef(new Animated.Value(0)).current;
    const glowOpacity = useRef(new Animated.Value(0)).current;
    const particle1 = useRef(new Animated.Value(0)).current;
    const particle2 = useRef(new Animated.Value(0)).current;
    const particle3 = useRef(new Animated.Value(0)).current;
    const fadeOut = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Glow pulse animation (continuous)
        const glowPulse = Animated.loop(
            Animated.sequence([
                Animated.timing(glowOpacity, {
                    toValue: 0.6,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(glowOpacity, {
                    toValue: 0.2,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        );

        // Floating particles
        const floatParticle = (particle: Animated.Value) =>
            Animated.loop(
                Animated.sequence([
                    Animated.timing(particle, {
                        toValue: 1,
                        duration: 3000 + Math.random() * 2000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(particle, {
                        toValue: 0,
                        duration: 3000 + Math.random() * 2000,
                        useNativeDriver: true,
                    }),
                ])
            );

        // Main entrance sequence
        Animated.sequence([
            // Logo appears with bounce
            Animated.parallel([
                Animated.spring(logoScale, {
                    toValue: 1,
                    friction: 4,
                    tension: 50,
                    useNativeDriver: true,
                }),
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]),
            // Title slides up
            Animated.parallel([
                Animated.timing(titleOpacity, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.spring(titleTranslateY, {
                    toValue: 0,
                    friction: 6,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]),
            // Subtitle slides up
            Animated.parallel([
                Animated.timing(subtitleOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.spring(subtitleTranslateY, {
                    toValue: 0,
                    friction: 6,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]),
            // Bottom text fades in
            Animated.timing(bottomTextOpacity, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            // Wait a moment
            Animated.delay(1200),
            // Fade out entire screen
            Animated.timing(fadeOut, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onFinish();
        });

        glowPulse.start();
        floatParticle(particle1).start();
        floatParticle(particle2).start();
        floatParticle(particle3).start();

        return () => {
            glowPulse.stop();
        };
    }, []);

    const particleStyle = (particle: Animated.Value, left: number, top: number, size: number) => ({
        position: 'absolute' as const,
        left,
        top,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        transform: [
            {
                translateY: particle.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -40],
                }),
            },
        ],
        opacity: particle.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0.8, 0],
        }),
    });

    return (
        <Animated.View style={[styles.container, { opacity: fadeOut }]}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* Background gradient */}
            <View style={styles.gradientContainer}>
                <View style={styles.gradientTop} />
                <View style={styles.gradientBottom} />
            </View>

            {/* Decorative circles */}
            <View style={styles.circle1} />
            <View style={styles.circle2} />
            <View style={styles.circle3} />

            {/* Floating particles */}
            <Animated.View style={particleStyle(particle1, width * 0.2, height * 0.3, 8)} />
            <Animated.View style={particleStyle(particle2, width * 0.7, height * 0.25, 6)} />
            <Animated.View style={particleStyle(particle3, width * 0.5, height * 0.6, 10)} />

            {/* Glow behind logo */}
            <Animated.View style={[styles.glow, { opacity: glowOpacity }]} />

            {/* Logo */}
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        opacity: logoOpacity,
                        transform: [{ scale: logoScale }],
                    },
                ]}
            >
                <View style={styles.logoWrapper}>
                    <Image
                        source={require('../assets/images/farm-splash-logo.png')}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                </View>
            </Animated.View>

            {/* App Title */}
            <Animated.View
                style={[
                    styles.titleContainer,
                    {
                        opacity: titleOpacity,
                        transform: [{ translateY: titleTranslateY }],
                    },
                ]}
            >
                <Text style={styles.titleText}>FarmFresh</Text>
                <View style={styles.titleUnderline} />
            </Animated.View>

            {/* Subtitle */}
            <Animated.View
                style={[
                    styles.subtitleContainer,
                    {
                        opacity: subtitleOpacity,
                        transform: [{ translateY: subtitleTranslateY }],
                    },
                ]}
            >
                <Text style={styles.subtitleText}>From Farm to Your Table</Text>
            </Animated.View>

            {/* Bottom section */}
            <Animated.View style={[styles.bottomSection, { opacity: bottomTextOpacity }]}>
                {/* Loading dots */}
                <View style={styles.loadingDots}>
                    <View style={[styles.dot, styles.dot1]} />
                    <View style={[styles.dot, styles.dot2]} />
                    <View style={[styles.dot, styles.dot3]} />
                </View>
                <Text style={styles.bottomText}>🌱 Growing freshness for you</Text>
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a472a',
    },
    gradientContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    gradientTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: height * 0.5,
        backgroundColor: '#1a472a',
    },
    gradientBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: height * 0.5,
        backgroundColor: '#0d2818',
    },
    circle1: {
        position: 'absolute',
        width: width * 0.8,
        height: width * 0.8,
        borderRadius: width * 0.4,
        backgroundColor: 'rgba(46, 125, 50, 0.15)',
        top: -width * 0.2,
        right: -width * 0.2,
    },
    circle2: {
        position: 'absolute',
        width: width * 0.6,
        height: width * 0.6,
        borderRadius: width * 0.3,
        backgroundColor: 'rgba(255, 193, 7, 0.08)',
        bottom: -width * 0.1,
        left: -width * 0.15,
    },
    circle3: {
        position: 'absolute',
        width: width * 0.4,
        height: width * 0.4,
        borderRadius: width * 0.2,
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        top: height * 0.4,
        right: -width * 0.1,
    },
    glow: {
        position: 'absolute',
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: 'rgba(76, 175, 80, 0.3)',
        top: height * 0.5 - 170,
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    logoWrapper: {
        width: 160,
        height: 160,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    logoImage: {
        width: 140,
        height: 140,
        borderRadius: 30,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 12,
    },
    titleText: {
        fontSize: 42,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    titleUnderline: {
        width: 60,
        height: 3,
        backgroundColor: '#FFC107',
        borderRadius: 2,
        marginTop: 8,
    },
    subtitleContainer: {
        alignItems: 'center',
        marginBottom: 8,
    },
    subtitleText: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)',
        letterSpacing: 3,
        textTransform: 'uppercase',
        fontWeight: '300',
    },
    bottomSection: {
        position: 'absolute',
        bottom: 80,
        alignItems: 'center',
    },
    loadingDots: {
        flexDirection: 'row',
        marginBottom: 16,
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 193, 7, 0.6)',
    },
    dot1: {
        opacity: 0.4,
    },
    dot2: {
        opacity: 0.7,
    },
    dot3: {
        opacity: 1,
    },
    bottomText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.5)',
        letterSpacing: 1,
    },
});
