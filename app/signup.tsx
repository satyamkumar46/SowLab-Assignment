import { useSignupContext } from '@/constants/SignupContext';
import { registerUser } from '@/constants/api';
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
    { code: '+91', country: '🇮🇳 India' },
    { code: '+1', country: '🇺🇸 United States' },
    { code: '+44', country: '🇬🇧 United Kingdom' },
    { code: '+61', country: '🇦🇺 Australia' },
    { code: '+86', country: '🇨🇳 China' },
    { code: '+81', country: '🇯🇵 Japan' },
    { code: '+49', country: '🇩🇪 Germany' },
    { code: '+33', country: '🇫🇷 France' },
    { code: '+971', country: '🇦🇪 UAE' },
    { code: '+966', country: '🇸🇦 Saudi Arabia' },
    { code: '+65', country: '🇸🇬 Singapore' },
    { code: '+60', country: '🇲🇾 Malaysia' },
    { code: '+55', country: '🇧🇷 Brazil' },
    { code: '+82', country: '🇰🇷 South Korea' },
    { code: '+39', country: '🇮🇹 Italy' },
];

export default function SignupScreen() {
    const router = useRouter();
    const { updateSignupData } = useSignupContext();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [countryCode, setCountryCode] = useState('+91');
    const [phone, setPhone] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showCountryPicker, setShowCountryPicker] = useState(false);

    const handleSignUp = () => {
        if (!fullName || !email || !password || !phone) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        // Save data to context with country code
        const fullPhone = `${countryCode}${phone}`;
        updateSignupData({
            full_name: fullName,
            email,
            password,
            phone: fullPhone,
        });
        router.push('/farm-info');
    };

    const handleSocialSignup = async (type: 'google' | 'apple' | 'facebook') => {
        setLoading(true);
        try {
            const socialId = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const socialEmail = `${type}_user_${Date.now()}@${type}.com`;
            const response = await registerUser({
                full_name: `${type.charAt(0).toUpperCase() + type.slice(1)} User`,
                email: socialEmail,
                password: 'Social@123',
                phone: '',
                socialId,
                type,
            });
            if (response.success) {
                Alert.alert('Success', response.message || 'Account created successfully!', [
                    { text: 'OK', onPress: () => router.replace('/login') },
                ]);
            } else {
                Alert.alert('Info', response.message || `${type.charAt(0).toUpperCase() + type.slice(1)} sign up is not available right now.`);
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = () => {
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
                    <Text style={styles.title}>Welcome!</Text>
                    <Text style={styles.subtitle}>Create your account</Text>

                    {/* Social Login */}
                    <View style={styles.socialContainer}>
                        <TouchableOpacity
                            style={styles.socialButton}
                            onPress={() => handleSocialSignup('google')}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#DB4437" />
                            ) : (
                                <Ionicons name="logo-google" size={22} color="#DB4437" />
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.socialButton}
                            onPress={() => handleSocialSignup('apple')}
                            disabled={loading}
                        >
                            <Ionicons name="logo-apple" size={22} color="#000" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.socialButton}
                            onPress={() => handleSocialSignup('facebook')}
                            disabled={loading}
                        >
                            <Ionicons name="logo-facebook" size={22} color="#4267B2" />
                        </TouchableOpacity>
                    </View>

                    {/* Divider */}
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>or sign up with</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Full Name */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            placeholderTextColor="#999"
                            value={fullName}
                            onChangeText={setFullName}
                            autoCapitalize="words"
                            editable={!loading}
                        />
                    </View>

                    {/* Email */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!loading}
                        />
                    </View>

                    {/* Password */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#999"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            editable={!loading}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons
                                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                size={20}
                                color="#999"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Phone Number with Country Code */}
                    <View style={styles.phoneRow}>
                        <TouchableOpacity
                            style={styles.countryCodeButton}
                            onPress={() => setShowCountryPicker(true)}
                            disabled={loading}
                        >
                            <Text style={styles.countryCodeText}>{countryCode}</Text>
                            <Ionicons name="chevron-down" size={14} color="#666" />
                        </TouchableOpacity>
                        <View style={styles.phoneInputContainer}>
                            <TextInput
                                style={styles.phoneInput}
                                placeholder="Phone Number"
                                placeholderTextColor="#999"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                                editable={!loading}
                            />
                        </View>
                    </View>

                    {/* Sign Up Button */}
                    <TouchableOpacity
                        style={[styles.signupButton, loading && styles.buttonDisabled]}
                        onPress={handleSignUp}
                        activeOpacity={0.8}
                        disabled={loading}
                    >
                        <Text style={styles.signupButtonText}>Sign Up</Text>
                    </TouchableOpacity>

                    {/* Login Link */}
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity onPress={handleLogin}>
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
                                        styles.countryCodeLabel,
                                        countryCode === item.code && styles.countryCodeSelectedLabel,
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
        paddingTop: 70,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: '#888',
        marginBottom: 28,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 24,
    },
    socialButton: {
        width: 52,
        height: 52,
        borderRadius: 14,
        backgroundColor: '#F7F8FA',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ECECEC',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E8E8E8',
    },
    dividerText: {
        color: '#999',
        fontSize: 13,
        marginHorizontal: 12,
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
    signupButton: {
        backgroundColor: '#E8604C',
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#E8604C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    signupButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
        paddingBottom: 30,
    },
    loginText: {
        color: '#888',
        fontSize: 14,
    },
    loginLink: {
        color: '#E8604C',
        fontSize: 14,
        fontWeight: '700',
    },
    phoneRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 16,
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
    countryCodeLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#666',
    },
    countryCodeSelectedLabel: {
        color: '#E8604C',
    },
});
