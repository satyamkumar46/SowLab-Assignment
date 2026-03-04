import { useSignupContext } from '@/constants/SignupContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface DaySchedule {
    enabled: boolean;
    openTime: string;
    closeTime: string;
}

export default function BusinessHoursScreen() {
    const router = useRouter();
    const { updateSignupData } = useSignupContext();
    const [schedule, setSchedule] = useState<Record<string, DaySchedule>>(
        DAYS.reduce((acc, day) => ({
            ...acc,
            [day]: {
                enabled: day !== 'Sunday',
                openTime: '08:00 AM',
                closeTime: '06:00 PM',
            },
        }), {} as Record<string, DaySchedule>)
    );

    const toggleDay = (day: string) => {
        setSchedule((prev) => ({
            ...prev,
            [day]: { ...prev[day], enabled: !prev[day].enabled },
        }));
    };

    const handleNext = () => {
        // Format business hours as a string for the API
        const hoursStr = DAYS.map((day) => {
            if (schedule[day].enabled) {
                return `${day}: ${schedule[day].openTime} - ${schedule[day].closeTime}`;
            }
            return `${day}: Closed`;
        }).join(', ');

        updateSignupData({ business_hours: hoursStr });
        router.push('/registration-complete');
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
                            <View style={[styles.progressFill, { width: '50%' }]} />
                        </View>
                        <Text style={styles.stepText}>Signup 2 of 4</Text>
                    </View>

                    <Text style={styles.title}>Business Hours</Text>
                    <Text style={styles.subtitle}>
                        Set your farm's operating hours. Customers will see these on your profile.
                    </Text>

                    {/* Schedule */}
                    {DAYS.map((day) => (
                        <View key={day} style={styles.dayRow}>
                            <View style={styles.dayInfo}>
                                <Switch
                                    value={schedule[day].enabled}
                                    onValueChange={() => toggleDay(day)}
                                    trackColor={{ false: '#E0E0E0', true: '#E8604C' }}
                                    thumbColor={schedule[day].enabled ? '#fff' : '#f4f3f4'}
                                    ios_backgroundColor="#E0E0E0"
                                />
                                <Text style={[
                                    styles.dayName,
                                    !schedule[day].enabled && styles.dayNameDisabled,
                                ]}>
                                    {day}
                                </Text>
                            </View>
                            {schedule[day].enabled ? (
                                <View style={styles.timeContainer}>
                                    <View style={styles.timeBadge}>
                                        <Ionicons name="time-outline" size={12} color="#E8604C" />
                                        <Text style={styles.timeText}>{schedule[day].openTime}</Text>
                                    </View>
                                    <Text style={styles.timeSeparator}>–</Text>
                                    <View style={styles.timeBadge}>
                                        <Ionicons name="time-outline" size={12} color="#E8604C" />
                                        <Text style={styles.timeText}>{schedule[day].closeTime}</Text>
                                    </View>
                                </View>
                            ) : (
                                <Text style={styles.closedText}>Closed</Text>
                            )}
                        </View>
                    ))}
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
                    <Text style={styles.nextButtonText}>Next</Text>
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
        marginBottom: 24,
    },
    dayRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    dayInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    dayName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    dayNameDisabled: {
        color: '#BBB',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    timeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#FFF5F3',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FFE0D9',
    },
    timeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#E8604C',
    },
    timeSeparator: {
        fontSize: 14,
        color: '#999',
    },
    closedText: {
        fontSize: 13,
        color: '#BBB',
        fontStyle: 'italic',
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
