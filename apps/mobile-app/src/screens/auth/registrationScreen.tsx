import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';

export const RegisterScreen = ({ navigation }: any) => {
    const [role, setRole] = useState<'USER' | 'DRIVER'>('USER');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

 const handleRegister = () => {
        if (!fullName.trim() || !phoneNumber.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Required Fields',
                text2: 'Please fill in all required fields to continue',
                position: 'top',
                visibilityTime: 3000,
            });
            return; // Empty hone par yahan se wapas chala jayega
        }

        const registrationData = {
            fullName,
            phoneNumber: `+92${phoneNumber}`,
            role,
        };

        console.log('Registering User:', registrationData);

        Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Account registered successfully!',
            position: 'top',
        });
    };

    return (
        <LinearGradient
            colors={['#0F172A', '#1E1B4B', '#311042']} // Deep Navy to Midnight Purple Gradient
            style={styles.gradientBackground}>
            <StatusBar
                barStyle="light-content"
                {...(Platform.OS === 'android' ? { backgroundColor: '#0F172A' } : {})}
            />

            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.inner}>

                    {/* Header */}
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Registration On Towing service platform.</Text>
                    </View>

                    {/* Role Selection */}
                    <Text style={styles.label}>REGISTER AS</Text>
                    <View style={styles.roleContainer}>

                        {/* User Option */}
                        <TouchableOpacity
                            style={[
                                styles.roleCard,
                                role === 'USER' && styles.selectedRoleCard,
                            ]}
                            activeOpacity={0.85}
                            onPress={() => setRole('USER')}>
                            <View style={[styles.radioButton, role === 'USER' && styles.radioSelected]}>
                                {role === 'USER' && <View style={styles.radioInnerCircle} />}
                            </View>
                            <Text style={[styles.roleText, role === 'USER' && styles.selectedRoleText]}>
                                User
                            </Text>
                        </TouchableOpacity>

                        {/* Towing Driver Option */}
                        <TouchableOpacity
                            style={[
                                styles.roleCard,
                                role === 'DRIVER' && styles.selectedRoleCard,
                            ]}
                            activeOpacity={0.85}
                            onPress={() => setRole('DRIVER')}>
                            <View style={[styles.radioButton, role === 'DRIVER' && styles.radioSelected]}>
                                {role === 'DRIVER' && <View style={styles.radioInnerCircle} />}
                            </View>
                            <Text style={[styles.roleText, role === 'DRIVER' && styles.selectedRoleText]}>
                                Towing Driver
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form Inputs */}
                    <View style={styles.form}>
                        <Text style={styles.label}>FULL NAME</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Ali Ahmed"
                            placeholderTextColor="#94A3B8"
                            value={fullName}
                            onChangeText={setFullName}
                        />

                        <Text style={styles.label}>PHONE NUMBER</Text>
                        <View style={styles.phoneInputContainer}>
                            <Text style={styles.countryCode}>+92</Text>
                            <TextInput
                                style={styles.phoneInput}
                                placeholder="300 1234567"
                                placeholderTextColor="#94A3B8"
                                keyboardType="phone-pad"
                                maxLength={10}
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                            />
                        </View>

                        {/* Submit Button with Purple Gradient */}
                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={handleRegister}
                            style={styles.buttonWrapper}>
                            <LinearGradient
                                colors={['#8B5CF6', '#6366F1']} // Electric Violet to Indigo Gradient
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.submitButton}>
                                <Text style={styles.submitButtonText}>Continue</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradientBackground: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    inner: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    headerContainer: {
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 14,
        color: '#CBD5E1',
        marginTop: 6,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: '#A78BFA',
        marginBottom: 8,
        letterSpacing: 1,
    },
    roleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    roleCard: {
        flex: 0.48,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    selectedRoleCard: {
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.18)',
    },
    radioButton: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#64748B',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    radioSelected: {
        borderColor: '#A78BFA',
    },
    radioInnerCircle: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: '#A78BFA',
    },
    roleText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#94A3B8',
    },
    selectedRoleText: {
        color: '#FFFFFF',
    },
    form: {
        width: '100%',
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.07)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#FFFFFF',
        marginBottom: 20,
    },
    phoneInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.07)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 28,
        minHeight: 52, // Explicit minimum height
    },
    countryCode: {
        fontSize: 16,
        fontWeight: '600',
        color: '#A78BFA',
        marginRight: 10,
    },
    phoneInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        color: '#FFFFFF',
        height: '100%', // Full height touch area
    },
    buttonWrapper: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    submitButton: {
        paddingVertical: 16,
        alignItems: 'center',
        borderRadius: 12,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});