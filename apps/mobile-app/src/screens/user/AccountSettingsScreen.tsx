import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    StatusBar,
    Platform,
    SafeAreaView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

interface AccountSettingsProps {
    navigation?: any;
    onBackPress?: () => void;
}

const AccountSettingsScreen: React.FC<AccountSettingsProps> = ({ navigation, onBackPress }) => {
    // User Profile Form States
    const [fullName, setFullName] = useState('Ahmed Ali');
    const [email, setEmail] = useState('ahmed.ali@example.com');
    const [phone, setPhone] = useState('+92 300 0000000');
    const [emergencyContact, setEmergencyContact] = useState('+92 321 9876543');
    const [address, setAddress] = useState('Gulshan-e-Iqbal, Karachi, Pakistan');

    const [isSaving, setIsSaving] = useState(false);

    // Safe Initials Helper Function
    const getInitials = (name: string) => {
        if (!name || !name.trim()) return 'U';
        const parts = name.trim().split(' ').filter(Boolean);
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[1][0]).toUpperCase();
    };

    const handleSaveProfile = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            Alert.alert('Success', 'Profile updated successfully!');
        }, 1200);
    };

    const handleGoBack = () => {
        if (onBackPress) {
            onBackPress();
        } else if (navigation?.goBack) {
            navigation.goBack();
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#0B0F19' }}>
                <StatusBar
               barStyle="light-content"
               {...({
                   translucent: true,
                   backgroundColor: 'transparent',
               } as any)}
           />

            <LinearGradient colors={['#0B0F19', '#111827', '#1E1B4B']} style={{ flex: 1 }}>
                <SafeAreaView style={styles.safeArea}>

                    {/* Header */}
                    <View style={styles.topHeader}>
                        <TouchableOpacity
                            style={styles.backBtn}
                            onPress={handleGoBack}
                            activeOpacity={0.6}
                            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                            <Icon name="arrow-back-outline" size={24} color="#FFFFFF" />
                        </TouchableOpacity>

                        <Text style={styles.headerTitle}>Account Settings</Text>

                        <View style={{ width: 24 }} />
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                        {/* Profile Avatar Card */}
                        <View style={styles.profileCard}>
                            <View style={styles.avatarContainer}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>{getInitials(fullName)}</Text>
                                </View>
                                <TouchableOpacity style={styles.cameraBadge} activeOpacity={0.8}>
                                    <Icon name="camera-outline" size={16} color="#FFFFFF" />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.profileName}>{fullName ? fullName : 'User Name'}</Text>
                            <Text style={styles.profileSub}>{phone ? phone : ''}</Text>
                        </View>

                        {/* Profile Settings Form */}
                        <View style={styles.card}>
                            <Text style={styles.sectionTitle}>Personal Information</Text>

                            <Text style={styles.label}>FULL NAME</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter full name"
                                placeholderTextColor="#64748B"
                                value={fullName}
                                onChangeText={setFullName}
                            />

                            <Text style={styles.label}>EMAIL ADDRESS</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="name@example.com"
                                placeholderTextColor="#64748B"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />

                            <Text style={styles.label}>PHONE NUMBER</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="+92 300 0000000"
                                placeholderTextColor="#64748B"
                                keyboardType="phone-pad"
                                value={phone}
                                onChangeText={setPhone}
                            />

                            <Text style={styles.label}>EMERGENCY CONTACT</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="+92 300 0000000"
                                placeholderTextColor="#64748B"
                                keyboardType="phone-pad"
                                value={emergencyContact}
                                onChangeText={setEmergencyContact}
                            />

                            <Text style={styles.label}>PRIMARY ADDRESS</Text>
                            <TextInput
                                style={[styles.input, { height: 70 }]}
                                placeholder="Enter your home or work address"
                                placeholderTextColor="#64748B"
                                multiline
                                value={address}
                                onChangeText={setAddress}
                            />

                            <View style={styles.divider} />

                            {/* Save Button */}
                            <TouchableOpacity
                                activeOpacity={0.85}
                                onPress={handleSaveProfile}
                                disabled={isSaving}
                                style={styles.mainBtnWrapper}>
                                <LinearGradient
                                    colors={['#6366F1', '#4F46E5']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.primaryBtn}>
                                    {isSaving ? (
                                        <ActivityIndicator color="#FFF" size="small" />
                                    ) : (
                                        <Text style={styles.primaryBtnText}>Save Changes</Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        {/* Security & Logout Actions */}
                        <View style={[styles.card, { marginTop: 16 }]}>
                            <Text style={styles.sectionTitle}>Security & Account</Text>

                            <TouchableOpacity style={styles.actionRow} activeOpacity={0.7}>
                                <View style={styles.actionIconContainer}>
                                    <Icon name="lock-closed-outline" size={18} color="#C4B5FD" />
                                </View>
                                <Text style={styles.actionText}>Change Password</Text>
                                <Icon name="chevron-forward-outline" size={18} color="#64748B" />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionRow} activeOpacity={0.7}>
                                <View style={styles.actionIconContainer}>
                                    <Icon name="shield-checkmark-outline" size={18} color="#C4B5FD" />
                                </View>
                                <Text style={styles.actionText}>Privacy & Permissions</Text>
                                <Icon name="chevron-forward-outline" size={18} color="#64748B" />
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.actionRow, { borderBottomWidth: 0 }]} activeOpacity={0.7}>
                                <View style={[styles.actionIconContainer, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                                    <Icon name="log-out-outline" size={18} color="#EF4444" />
                                </View>
                                <Text style={[styles.actionText, { color: '#EF4444' }]}>Log Out</Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </SafeAreaView>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    topHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 40 : 10,
        paddingBottom: 15,
    },
    backBtn: {
        padding: 5,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    profileCard: {
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    avatar: {
        width: 84,
        height: 84,
        borderRadius: 42,
        backgroundColor: '#6366F1',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 30,
        fontWeight: 'bold',
    },
    cameraBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#4F46E5',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#0B0F19',
    },
    profileName: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '700',
    },
    profileSub: {
        color: '#9CA3AF',
        fontSize: 13,
        marginTop: 2,
    },
    card: {
        backgroundColor: 'rgba(31, 41, 55, 0.6)',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 16,
    },
    label: {
        color: '#9CA3AF',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 6,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 13,
        color: '#FFFFFF',
        marginBottom: 14,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        marginVertical: 10,
        marginBottom: 16,
    },
    mainBtnWrapper: {
        borderRadius: 14,
        overflow: 'hidden',
    },
    primaryBtn: {
        paddingVertical: 14,
        alignItems: 'center',
    },
    primaryBtnText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    },
    actionIconContainer: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    actionText: {
        flex: 1,
        color: '#E5E7EB',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default AccountSettingsScreen;