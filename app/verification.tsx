import { useSignupContext } from '@/constants/SignupContext';
import { registerUser } from '@/constants/api';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function VerificationScreen() {
    const router = useRouter();
    const { signupData } = useSignupContext();
    const [proofImage, setProofImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAttachProof = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                // Fallback to media library
                const libStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (libStatus.status !== 'granted') {
                    Alert.alert('Permission needed', 'Please allow access to camera or photo library.');
                    return;
                }
            }

            Alert.alert(
                'Attach Proof',
                'Choose an option',
                [
                    {
                        text: 'Camera',
                        onPress: async () => {
                            const result = await ImagePicker.launchCameraAsync({
                                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                allowsEditing: true,
                                quality: 0.8,
                            });
                            if (!result.canceled && result.assets[0]) {
                                setProofImage(result.assets[0].uri);
                            }
                        },
                    },
                    {
                        text: 'Photo Library',
                        onPress: async () => {
                            const result = await ImagePicker.launchImageLibraryAsync({
                                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                allowsEditing: true,
                                quality: 0.8,
                            });
                            if (!result.canceled && result.assets[0]) {
                                setProofImage(result.assets[0].uri);
                            }
                        },
                    },
                    { text: 'Cancel', style: 'cancel' },
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to open camera/library.');
        }
    };

    const handleContinue = async () => {
        setLoading(true);
        try {
            // Register user with all collected data from signup context
            const response = await registerUser({
                full_name: signupData.full_name,
                email: signupData.email,
                password: signupData.password,
                phone: signupData.phone,
                business_name: signupData.business_name,
                address: signupData.address,
                city: signupData.city,
                state: signupData.state,
                zip_code: signupData.zip_code,
                business_hours: signupData.business_hours,
            });
            if (response.success) {
                router.push('/business-hours');
            } else {
                Alert.alert('Error', response.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#333" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>FarmFresh</Text>
                        <View style={styles.placeholder} />
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: '75%' }]} />
                        </View>
                        <Text style={styles.stepText}>Signup 2 of 4</Text>
                    </View>

                    <Text style={styles.title}>Verification</Text>
                    <Text style={styles.subtitle}>
                        Attached proof of Department of Agriculture registrations i.e. Florida Fresh, USDA Approved, USDA Organic
                    </Text>

                    {/* Attach Proof Section */}
                    <View style={styles.attachSection}>
                        <Text style={styles.attachLabel}>Attach proof of registration</Text>
                        <TouchableOpacity
                            style={styles.cameraButton}
                            onPress={handleAttachProof}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="camera" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Image Preview */}
                    {proofImage && (
                        <View style={styles.previewContainer}>
                            <Image source={{ uri: proofImage }} style={styles.previewImage} />
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => setProofImage(null)}
                            >
                                <Ionicons name="close-circle" size={28} color="#E8604C" />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity onPress={handleBack} style={styles.prevButton}>
                    <Ionicons name="arrow-back" size={20} color="#E8604C" />
                    <Text style={styles.prevButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.nextButton, loading && styles.buttonDisabled]}
                    onPress={handleContinue}
                    activeOpacity={0.8}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <Text style={styles.nextButtonText}>Continue</Text>

                    )}
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 28,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a1a1a',
        letterSpacing: 0.5,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F7F8FA',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ECECEC',
    },
    placeholder: {
        width: 40,
    },
    progressContainer: {
        marginBottom: 24,
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
        backgroundColor: '#E8604C',
        borderRadius: 3,
    },
    stepText: {
        fontSize: 12,
        color: '#999',
        textAlign: 'left',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1a1a1a',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
        lineHeight: 22,
        marginBottom: 36,
    },
    attachSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    attachLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: '#555',
        flex: 1,
    },
    cameraButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#D4826A',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#D4826A',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    previewContainer: {
        position: 'relative',
        borderRadius: 14,
        overflow: 'hidden',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ECECEC',
    },
    previewImage: {
        width: '100%',
        height: 200,
        borderRadius: 14,
    },
    removeButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#fff',
        borderRadius: 14,
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 28,
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        backgroundColor: '#fff',
    },
    prevButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    prevButtonText: {
        color: '#E8604C',
        fontSize: 15,
        fontWeight: '600',
    },
    nextButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#E8604C',
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 14,
        shadowColor: '#E8604C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
