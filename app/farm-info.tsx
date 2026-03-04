import { useSignupContext } from '@/constants/SignupContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function FarmInfoScreen() {
    const router = useRouter();
    const { signupData, updateSignupData } = useSignupContext();
    const [farmName, setFarmName] = useState(signupData.business_name);
    const [farmAddress, setFarmAddress] = useState(signupData.address);
    const [farmCity, setFarmCity] = useState(signupData.city);
    const [farmState, setFarmState] = useState(signupData.state);
    const [farmZip, setFarmZip] = useState(signupData.zip_code);

    const handleNext = () => {
        if (!farmName || !farmAddress) {
            Alert.alert('Error', 'Please fill in required fields');
            return;
        }
        updateSignupData({
            business_name: farmName,
            address: farmAddress,
            city: farmCity,
            state: farmState,
            zip_code: farmZip,
        });
        router.push('/verification');
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
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#333" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>FarmFresh</Text>
                        <View style={styles.backButton} />
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: '25%' }]} />
                        </View>
                        <Text style={styles.stepText}>Signup 1 of 4</Text>
                    </View>

                    <Text style={styles.title}>Farm Info</Text>
                    <Text style={styles.subtitle}>
                        Tell us about your farm. This information will be displayed to customers.
                    </Text>

                    {/* Farm Name */}
                    <Text style={styles.inputLabel}>Farm Name *</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="leaf-outline" size={20} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter farm name"
                            placeholderTextColor="#999"
                            value={farmName}
                            onChangeText={setFarmName}
                        />
                    </View>

                    {/* Farm Address */}
                    <Text style={styles.inputLabel}>Farm Address *</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="location-outline" size={20} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Street address"
                            placeholderTextColor="#999"
                            value={farmAddress}
                            onChangeText={setFarmAddress}
                        />
                    </View>

                    {/* City & State Row */}
                    <View style={styles.rowInputs}>
                        <View style={styles.halfInput}>
                            <Text style={styles.inputLabel}>City</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="City"
                                    placeholderTextColor="#999"
                                    value={farmCity}
                                    onChangeText={setFarmCity}
                                />
                            </View>
                        </View>
                        <View style={styles.halfInput}>
                            <Text style={styles.inputLabel}>State</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="State"
                                    placeholderTextColor="#999"
                                    value={farmState}
                                    onChangeText={setFarmState}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Zip Code */}
                    <Text style={styles.inputLabel}>Zip Code</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Zip / Postal code"
                            placeholderTextColor="#999"
                            value={farmZip}
                            onChangeText={setFarmZip}
                            keyboardType="number-pad"
                        />
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity onPress={handleBack} style={styles.prevButton}>
                    <Ionicons name="arrow-back" size={20} color="#E8604C" />
                    <Text style={styles.prevButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleNext}
                    activeOpacity={0.8}
                >
                    <Text style={styles.nextButtonText}>Continue</Text>
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
        color: '#E8604C',
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
        textAlign: 'right',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
        lineHeight: 22,
        marginBottom: 28,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#555',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F8FA',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 5,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ECECEC',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#333',
        paddingVertical: 14,
    },
    rowInputs: {
        flexDirection: 'row',
        gap: 12,
    },
    halfInput: {
        flex: 1,
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
    nextButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
