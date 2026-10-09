import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    StatusBar,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native'; // 1. Hook Import Karein

const LoginScreen = ({ navigation }: any) => {
    // const navigation = useNavigation<any>(); // 2. Navigation Object Get Karein

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

   const handleLogin = () => {

    // console.log("hey login butn ")
    // Abhi ke liye direct UserHomeScreen par navigate kar rahe hain
    navigation.navigate('UserHomeScreen');
};
    return (
        <LinearGradient
            colors={['#0F172A', '#1E1B4B', '#311042']}
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
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to continue using Towing service.</Text>
                    </View>

                    {/* Form Inputs */}
                    <View style={styles.form}>
                        <Text style={styles.label}>EMAIL ADDRESS</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. user@example.com"
                            placeholderTextColor="#94A3B8"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />

                        <Text style={styles.label}>PASSWORD</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#94A3B8"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />

                        {/* Submit Button */}
                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={handleLogin}
                            style={styles.buttonWrapper}>
                            <LinearGradient
                                colors={['#8B5CF6', '#6366F1']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.submitButton}>
                                <Text style={styles.submitButtonText}>Log In</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Navigation Link */}
                        <View style={styles.footerContainer}>
                            <Text style={styles.footerText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                <Text style={styles.signupText}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>

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
        color: '#FFFFFF',
        marginBottom: 8,
        letterSpacing: 1,
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
    buttonWrapper: {
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 10,
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
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    footerText: {
        color: '#CBD5E1',
        fontSize: 14,
    },
    signupText: {
        color: '#A78BFA',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default LoginScreen;