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
    StatusBar,
    ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';

export const RegisterScreen = ({ navigation }: any) => {
    // 1. All hooks at top level
    const [role, setRole] = useState<'USER' | 'DRIVER'>('USER');

    // Common Fields
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');

    // Driver Specific Fields
    const [vehicleType, setVehicleType] = useState('Flatbed Tow Truck');
    const [vehicleNo, setVehicleNo] = useState('');
    const [cnicImg, setCnicImg] = useState<string | null>(null);
    const [licenseImg, setLicenseImg] = useState<string | null>(null);
    const [vehiclePapersImg, setVehiclePapersImg] = useState<string | null>(null);
    const [profilePic, setProfilePic] = useState<string | null>(null);

    // Dropdown toggle state
    const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
    const vehicleOptions = ['Flatbed Tow Truck', 'Hook and Chain', 'Wheel Lift Tow Truck', 'Integrated Tow Truck'];

    const handleImagePick = (type: 'cnic' | 'license' | 'papers' | 'profile') => {
        Toast.show({
            type: 'info',
            text1: 'Upload Image',
            text2: `Pick image for ${type.toUpperCase()}`,
        });
    };

    const handleRegister = () => {
        if (!fullName.trim() || !email.trim() || !phoneNumber.trim() || !password.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Required Fields',
                text2: 'Please fill in all mandatory fields (*)',
            });
            return;
        }

        if (role === 'DRIVER' && !vehicleNo.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Required Fields',
                text2: 'Please enter Vehicle Number',
            });
            return;
        }

        const registrationData = {
            role,
            fullName,
            email,
            phoneNumber: `+92${phoneNumber}`,
            password,
            ...(role === 'DRIVER' && {
                vehicleType,
                vehicleNo,
                cnicImg,
                licenseImg,
                vehiclePapersImg,
                profilePic,
            }),
        };

        console.log('Registering User Data:', registrationData);

        Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Account registered successfully!',
        });
    };

    return (
        <LinearGradient colors={['#0F172A', '#1E1B4B', '#311042']} style={styles.gradientBackground}>
     <StatusBar
    barStyle="light-content"
    {...({
        translucent: true,
        backgroundColor: 'transparent',
    } as any)}
/>

            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.inner}>
                    <ScrollView 
                        showsVerticalScrollIndicator={false} 
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled">

                        {/* Header */}
                        <View style={styles.headerContainer}>
                            <Text style={styles.title}>Create Account</Text>
                            <Text style={styles.subtitle}>Registration On Towing service platform.</Text>
                        </View>

                        {/* Role Selection */}
                        <Text style={styles.label}>REGISTER AS</Text>
                        <View style={styles.roleContainer}>
                            <TouchableOpacity
                                style={[styles.roleCard, role === 'USER' && styles.selectedRoleCard]}
                                activeOpacity={0.85}
                                onPress={() => setRole('USER')}>
                                <View style={[styles.radioButton, role === 'USER' && styles.radioSelected]}>
                                    {role === 'USER' && <View style={styles.radioInnerCircle} />}
                                </View>
                                <Text style={[styles.roleText, role === 'USER' && styles.selectedRoleText]}>User</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.roleCard, role === 'DRIVER' && styles.selectedRoleCard]}
                                activeOpacity={0.85}
                                onPress={() => setRole('DRIVER')}>
                                <View style={[styles.radioButton, role === 'DRIVER' && styles.radioSelected]}>
                                    {role === 'DRIVER' && <View style={styles.radioInnerCircle} />}
                                </View>
                                <Text style={[styles.roleText, role === 'DRIVER' && styles.selectedRoleText]}>Driver</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Form Inputs */}
                        <View style={styles.form}>
                            <Text style={styles.label}>*FULL NAME</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Ali Ahmed"
                                placeholderTextColor="#64748B"
                                value={fullName}
                                onChangeText={setFullName}
                            />

                            <Text style={styles.label}>*EMAIL</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. ali@example.com"
                                placeholderTextColor="#64748B"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />

                            <Text style={styles.label}>*PHONE NUMBER</Text>
                            <View style={styles.phoneInputContainer}>
                                <Text style={styles.countryCode}>+92</Text>
                                <TextInput
                                    style={styles.phoneInput}
                                    placeholder="300 1234567"
                                    placeholderTextColor="#64748B"
                                    keyboardType="phone-pad"
                                    maxLength={10}
                                    value={phoneNumber}
                                    onChangeText={setPhoneNumber}
                                />
                            </View>

                            <Text style={styles.label}>*PASSWORD</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor="#64748B"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />

                            {/* Additional Fields for DRIVER */}
                            {role === 'DRIVER' && (
                                <View style={styles.driverSection}>
                                    <Text style={styles.sectionHeader}>Driver Details</Text>
                                    
                                    <Text style={styles.label}>*VEHICLE TYPE</Text>
                                    <TouchableOpacity
                                        style={styles.dropdownButton}
                                        onPress={() => setShowVehicleDropdown(!showVehicleDropdown)}>
                                        <Text style={styles.dropdownText}>{vehicleType}</Text>
                                        <Text style={styles.dropdownArrow}>{showVehicleDropdown ? '▲' : '▼'}</Text>
                                    </TouchableOpacity>

                                    {showVehicleDropdown && (
                                        <View style={styles.dropdownMenu}>
                                            {vehicleOptions.map((item, index) => (
                                                <TouchableOpacity
                                                    key={index}
                                                    style={styles.dropdownItem}
                                                    onPress={() => {
                                                        setVehicleType(item);
                                                        setShowVehicleDropdown(false);
                                                    }}>
                                                    <Text style={styles.dropdownItemText}>{item}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}

                                    <Text style={styles.label}>*VEHICLE NO.</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="e.g. LEB-1234"
                                        placeholderTextColor="#64748B"
                                        autoCapitalize="characters"
                                        value={vehicleNo}
                                        onChangeText={setVehicleNo}
                                    />

                                    {/* Image Attachments */}
                                    <Text style={styles.label}>CNIC PHOTO</Text>
                                    <TouchableOpacity
                                        style={styles.uploadButton}
                                        onPress={() => handleImagePick('cnic')}>
                                        <Text style={styles.uploadButtonText}>
                                            {cnicImg ? '✓ CNIC Uploaded' : '📷 Upload CNIC Image'}
                                        </Text>
                                    </TouchableOpacity>

                                    <Text style={styles.label}>DRIVING LICENSE</Text>
                                    <TouchableOpacity
                                        style={styles.uploadButton}
                                        onPress={() => handleImagePick('license')}>
                                        <Text style={styles.uploadButtonText}>
                                            {licenseImg ? '✓ License Uploaded' : '📷 Upload License Image'}
                                        </Text>
                                    </TouchableOpacity>

                                    <Text style={styles.label}>VEHICLE PAPERS</Text>
                                    <TouchableOpacity
                                        style={styles.uploadButton}
                                        onPress={() => handleImagePick('papers')}>
                                        <Text style={styles.uploadButtonText}>
                                            {vehiclePapersImg ? '✓ Papers Uploaded' : '📷 Upload Vehicle Papers'}
                                        </Text>
                                    </TouchableOpacity>

                                    <Text style={styles.label}>PROFILE PICTURE</Text>
                                    <TouchableOpacity
                                        style={styles.uploadButton}
                                        onPress={() => handleImagePick('profile')}>
                                        <Text style={styles.uploadButtonText}>
                                            {profilePic ? '✓ Profile Pic Uploaded' : '👤 Upload Profile Picture'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {/* Submit Button */}
                            <TouchableOpacity activeOpacity={0.85} onPress={handleRegister} style={styles.buttonWrapper}>
                                <LinearGradient
                                    colors={['#8B5CF6', '#6366F1']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.submitButton}>
                                    <Text style={styles.submitButtonText}>Continue</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* Footer Link */}
                            <View style={styles.footerContainer}>
                                <Text style={styles.footerText}>Already have an account? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                    <Text style={styles.loginText}>Sign In</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradientBackground: { flex: 1 },
    container: { flex: 1 },
    inner: { flex: 1 },
    scrollContent: { 
        paddingHorizontal: 20, 
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 16 : 16, 
        paddingBottom: 40 
    },
    headerContainer: { marginBottom: 24, marginTop: 8 },
    title: { fontSize: 28, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.5 },
    subtitle: { fontSize: 13, color: '#94A3B8', marginTop: 4 },
    label: { fontSize: 11, fontWeight: '700', color: '#ffffff', marginBottom: 6, letterSpacing: 0.8 },
    roleContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    roleCard: {
        flex: 0.48,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    selectedRoleCard: { borderColor: '#8B5CF6', backgroundColor: 'rgba(139, 92, 246, 0.18)' },
    radioButton: {
        height: 18,
        width: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: '#64748B',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    radioSelected: { borderColor: '#A78BFA' },
    radioInnerCircle: { height: 8, width: 8, borderRadius: 4, backgroundColor: '#A78BFA' },
    roleText: { fontSize: 14, fontWeight: '600', color: '#94A3B8' },
    selectedRoleText: { color: '#FFFFFF' },
    form: { width: '100%' },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 14,
        color: '#FFFFFF',
        marginBottom: 16,
    },
    phoneInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
        borderRadius: 10,
        paddingHorizontal: 14,
        marginBottom: 16,
        height: 48,
    },
    countryCode: { fontSize: 14, fontWeight: '600', color: '#A78BFA', marginRight: 10 },
    phoneInput: { flex: 1, fontSize: 14, color: '#FFFFFF', height: '100%' },
    driverSection: {
        marginTop: 8,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    sectionHeader: { fontSize: 14, fontWeight: 'bold', color: '#F1F5F9', marginBottom: 16 },
    dropdownButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    dropdownText: { fontSize: 14, color: '#FFFFFF' },
    dropdownArrow: { color: '#A78BFA', fontSize: 11 },
    dropdownMenu: {
        backgroundColor: '#1E1B4B',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#8B5CF6',
        marginTop: -8,
        marginBottom: 16,
        overflow: 'hidden',
    },
    dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' },
    dropdownItemText: { color: '#CBD5E1', fontSize: 13 },
    uploadButton: {
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.3)',
        borderStyle: 'dashed',
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 16,
    },
    uploadButtonText: { color: '#A78BFA', fontSize: 13, fontWeight: '600' },
    buttonWrapper: { borderRadius: 10, overflow: 'hidden', marginTop: 12 },
    submitButton: { paddingVertical: 14, alignItems: 'center', borderRadius: 10 },
    submitButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold', letterSpacing: 0.5 },
    footerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 18 },
    footerText: { color: '#94A3B8', fontSize: 13 },
    loginText: { color: '#A78BFA', fontSize: 13, fontWeight: 'bold' },
});