import { forgotPassword } from '@/constants/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const COUNTRY_CODES = [
    { code: '+91', country: '🇮🇳 India', short: 'IN' },
    { code: '+1', country: '🇺🇸 United States', short: 'US' },
    { code: '+44', country: '🇬🇧 United Kingdom', short: 'UK' },
    { code: '+61', country: '🇦🇺 Australia', short: 'AU' },
    { code: '+86', country: '🇨🇳 China', short: 'CN' },
    { code: '+81', country: '🇯🇵 Japan', short: 'JP' },
    { code: '+49', country: '🇩🇪 Germany', short: 'DE' },
    { code: '+33', country: '🇫🇷 France', short: 'FR' },
    { code: '+971', country: '🇦🇪 UAE', short: 'AE' },
    { code: '+966', country: '🇸🇦 Saudi Arabia', short: 'SA' },
    { code: '+65', country: '🇸🇬 Singapore', short: 'SG' },
    { code: '+60', country: '🇲🇾 Malaysia', short: 'MY' },
    { code: '+55', country: '🇧🇷 Brazil', short: 'BR' },
    { code: '+7', country: '🇷🇺 Russia', short: 'RU' },
    { code: '+82', country: '🇰🇷 South Korea', short: 'KR' },
    { code: '+39', country: '🇮🇹 Italy', short: 'IT' },
    { code: '+34', country: '🇪🇸 Spain', short: 'ES' },
    { code: '+52', country: '🇲🇽 Mexico', short: 'MX' },
    { code: '+62', country: '🇮🇩 Indonesia', short: 'ID' },
    { code: '+27', country: '🇿🇦 South Africa', short: 'ZA' },
];

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [countryCode, setCountryCode] = useState('+91');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [showCountryPicker, setShowCountryPicker] = useState(false);

    const handleSubmit = async () => {
        if (!phone) {
            Alert.alert('Error', 'Please enter your mobile number');
            return;
        }
        const fullPhone = `${countryCode}${phone}`;
        setLoading(true);
        try {
            const response = await forgotPassword({ mobile: fullPhone });
            if (response.success) {
                Alert.alert('Success', response.message || 'OTP sent to your mobile number.', [
                    { text: 'OK', onPress: () => router.push({ pathname: '/verify-otp', params: { mobile: fullPhone, flow: 'reset' } }) },
                ]);
            } else {
                Alert.alert('Error', response.message || 'Failed to send OTP. Please try again.');
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
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.content}>
                    {/* Back Button */}
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>

                    {/* Header */}
                    <Text style={styles.label}>FarmFresh</Text>
                    <Text style={styles.title}>Forgot Password?</Text>
                    <Text style={styles.subtitle}>
                        Don't worry! It happens. Please enter the mobile number associated with your account.
                    </Text>

                    {/* Phone Input with Country Code */}
                    <Text style={styles.inputLabel}>Mobile Number</Text>
                    <View style={styles.phoneRow}>
                        {/* Country Code Picker */}
                        <TouchableOpacity
                            style={styles.countryCodeButton}
                            onPress={() => setShowCountryPicker(true)}
                            disabled={loading}
                        >
                            <Text style={styles.countryCodeText}>{countryCode}</Text>
                            <Ionicons name="chevron-down" size={16} color="#666" />
                        </TouchableOpacity>

                        {/* Phone Number Input */}
                        <View style={styles.phoneInputContainer}>
                            <TextInput
                                style={styles.phoneInput}
                                placeholder="Enter your mobile number"
                                placeholderTextColor="#999"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                                editable={!loading}
                            />
                        </View>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.submitButton, loading && styles.buttonDisabled]}
                        onPress={handleSubmit}
                        activeOpacity={0.8}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text style={styles.submitButtonText}>Submit</Text>
                        )}
                    </TouchableOpacity>

                    {/* Remember Password Link */}
                    <View style={styles.rememberContainer}>
                        <Text style={styles.rememberText}>Remember password? </Text>
                        <TouchableOpacity onPress={handleBack}>
                            <Text style={styles.loginLink}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Country Code Picker Modal */}
            <Modal
                visible={showCountryPicker}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowCountryPicker(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Country</Text>
                            <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={COUNTRY_CODES}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.countryItem,
                                        countryCode === item.code && styles.countryItemSelected,
                                    ]}
                                    onPress={() => {
                                        setCountryCode(item.code);
                                        setShowCountryPicker(false);
                                    }}
                                >
                                    <Text style={styles.countryName}>{item.country}</Text>
                                    <Text style={[
                                        styles.countryCode,
                                        countryCode === item.code && styles.countryCodeSelected,
                                    ]}>{item.code}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
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
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F7F8FA',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 28,
        borderWidth: 1,
        borderColor: '#ECECEC',
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#E8604C',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1a1a1a',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
        lineHeight: 22,
        marginBottom: 32,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#555',
        marginBottom: 8,
    },
    phoneRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 24,
    },
    countryCodeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#F7F8FA',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: '#ECECEC',
        minWidth: 85,
        justifyContent: 'center',
    },
    countryCodeText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    phoneInputContainer: {
        flex: 1,
        backgroundColor: '#F7F8FA',
        borderRadius: 14,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#ECECEC',
        justifyContent: 'center',
    },
    phoneInput: {
        fontSize: 15,
        color: '#333',
        paddingVertical: 16,
    },
    submitButton: {
        backgroundColor: '#E8604C',
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        shadowColor: '#E8604C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    rememberContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    rememberText: {
        color: '#888',
        fontSize: 14,
    },
    loginLink: {
        color: '#E8604C',
        fontSize: 14,
        fontWeight: '700',
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '60%',
        paddingBottom: 30,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    countryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    countryItemSelected: {
        backgroundColor: '#FFF5F3',
    },
    countryName: {
        fontSize: 15,
        color: '#333',
    },
    countryCode: {
        fontSize: 15,
        fontWeight: '600',
        color: '#666',
    },
    countryCodeSelected: {
        color: '#E8604C',
    },
});
