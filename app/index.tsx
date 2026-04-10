import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function IndexScreen() {
    const router = useRouter();

    useEffect(() => {
        // Navigate to onboarding on mount
        const timer = setTimeout(() => {
            router.replace('/onboarding');
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <ActivityIndicator size="large" color="#E8604C" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
});
