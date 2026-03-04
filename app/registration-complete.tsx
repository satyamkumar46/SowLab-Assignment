import { useSignupContext } from '@/constants/SignupContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function RegistrationCompleteScreen() {
    const router = useRouter();
    const { resetSignupData } = useSignupContext();
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const checkScale = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;
    const buttonOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            // Circle appears with bounce
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 5,
                    tension: 40,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]),
            // Checkmark bounces in
            Animated.spring(checkScale, {
                toValue: 1,
                friction: 4,
                tension: 50,
                useNativeDriver: true,
            }),
            // Text fades in
            Animated.timing(textOpacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            // Button fades in
            Animated.timing(buttonOpacity, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleGetStarted = () => {
        resetSignupData();
        router.replace('/login');
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Header */}
                <Text style={styles.headerTitle}>FarmFresh</Text>

                {/* Progress Bar - Full */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: '100%' }]} />
                    </View>
                    <Text style={styles.stepText}>Signup 4 of 4</Text>
                </View>

                {/* Success Animation */}
                <View style={styles.successContainer}>
                    <Animated.View
                        style={[
                            styles.circleOuter,
                            {
                                opacity: opacityAnim,
                                transform: [{ scale: scaleAnim }],
                            },
                        ]}
                    >
                        <View style={styles.circleInner}>
                            <Animated.View
                                style={{
                                    transform: [{ scale: checkScale }],
                                }}
                            >
                                <Ionicons name="checkmark" size={60} color="#4CAF50" />
                            </Animated.View>
                        </View>
                    </Animated.View>

                    <Animated.View style={{ opacity: textOpacity }}>
                        <Text style={styles.title}>You're all done!</Text>
                        <Text style={styles.subtitle}>
                            Your farm profile has been created successfully. You can now start managing your farm and connecting with customers.
                        </Text>
                    </Animated.View>

                    {/* Features */}
                    <Animated.View style={[styles.featuresContainer, { opacity: textOpacity }]}>
                        <View style={styles.featureRow}>
                            <View style={styles.featureIcon}>
                                <Ionicons name="leaf" size={18} color="#4CAF50" />
                            </View>
                            <Text style={styles.featureText}>Manage your farm profile</Text>
                        </View>
                        <View style={styles.featureRow}>
                            <View style={styles.featureIcon}>
                                <Ionicons name="people" size={18} color="#4CAF50" />
                            </View>
                            <Text style={styles.featureText}>Connect with customers</Text>
                        </View>
                        <View style={styles.featureRow}>
                            <View style={styles.featureIcon}>
                                <Ionicons name="cart" size={18} color="#4CAF50" />
                            </View>
                            <Text style={styles.featureText}>Sell fresh products</Text>
                        </View>
                    </Animated.View>
                </View>
            </View>

            {/* Bottom Button */}
            <Animated.View style={[styles.bottomNav, { opacity: buttonOpacity }]}>
                <TouchableOpacity
                    style={styles.getStartedButton}
                    onPress={handleGetStarted}
                    activeOpacity={0.8}
                >
                    <Text style={styles.getStartedText}>Get Started</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        paddingHorizontal: 28,
        paddingTop: 60,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#E8604C',
        letterSpacing: 0.5,
        textAlign: 'center',
        marginBottom: 24,
    },
    progressContainer: {
        marginBottom: 40,
    },
    progressBar: {
        height: 6,
        backgroundColor: '#F0F0F0',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 3,
    },
    stepText: {
        fontSize: 12,
        color: '#4CAF50',
        textAlign: 'right',
        fontWeight: '600',
    },
    successContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 80,
    },
    circleOuter: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#E8F5E9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    circleInner: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: '#C8E6C9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1a1a1a',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 16,
        marginBottom: 32,
    },
    featuresContainer: {
        width: '100%',
        gap: 16,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: '#F9FFF9',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E8F5E9',
    },
    featureIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#E8F5E9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    bottomNav: {
        paddingHorizontal: 28,
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        backgroundColor: '#fff',
    },
    getStartedButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#E8604C',
        paddingVertical: 16,
        borderRadius: 14,
        shadowColor: '#E8604C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    getStartedText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});
