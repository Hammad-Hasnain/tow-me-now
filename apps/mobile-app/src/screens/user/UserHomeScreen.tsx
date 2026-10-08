import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Platform,
    Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function UserHomeScreen({ navigation }: any) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Form States
    const [vehicle, setVehicle] = useState('');
    const [model, setModel] = useState('');
    const [problem, setProblem] = useState('');
    const [currentLoc, setCurrentLoc] = useState('');
    const [dropoffLoc, setDropoffLoc] = useState('');
    const [vehicleNo, setVehicleNo] = useState('');

    const handleLLMChat = () => {
        Alert.alert('AI Assistant', 'Analyzing your vehicle description for fast support...');
    };

    const handleGetTow = () => {
        if (!currentLoc.trim() || !dropoffLoc.trim()) {
            Alert.alert('Required', 'Please enter Pick-up and Drop-off locations.');
            return;
        }
        // Next screen pr navigate karein
        navigation.navigate('AvailableDrivers', {
            requestDetails: { vehicle, model, problem, currentLoc, dropoffLoc, vehicleNo },
        });
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
                    {/* Top Header */}
                    <View style={styles.topHeader}>
                        <TouchableOpacity
                            style={styles.menuBtn}
                            onPress={() => setIsDrawerOpen(true)}
                            activeOpacity={0.6}
                            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                            <Text style={styles.menuIcon}>☰</Text>
                        </TouchableOpacity>

                        <Text style={styles.headerTitle}>Tow Assistance</Text>

                        <View style={styles.profileBadge}>
                            <Text style={styles.profileBadgeText}>AH</Text>
                        </View>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                        {/* Hero Banner */}
                        <LinearGradient
                            colors={['#6366F1', '#4F46E5', '#3730A3']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.heroBanner}>
                            <View style={styles.bannerBadge}>
                                <Text style={styles.bannerBadgeText}>⚡ 24/7 Emergency Service</Text>
                            </View>
                            <Text style={styles.bannerTitle}>Need Emergency Towing?</Text>
                            <Text style={styles.bannerSub}>Get fast roadside assistance and nearest tow truck in minutes.</Text>
                        </LinearGradient>

                        {/* Form Card */}
                        <View style={styles.card}>
                            <Text style={styles.sectionTitle}>Vehicle Details</Text>

                            <View style={styles.rowInputs}>
                                <View style={{ flex: 1, marginRight: 8 }}>
                                    <Text style={styles.label}>MAKE</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="e.g. Honda"
                                        placeholderTextColor="#64748B"
                                        value={vehicle}
                                        onChangeText={setVehicle}
                                    />
                                </View>

                                <View style={{ flex: 1, marginLeft: 8 }}>
                                    <Text style={styles.label}>MODEL & YEAR</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="e.g. Civic 2021"
                                        placeholderTextColor="#64748B"
                                        value={model}
                                        onChangeText={setModel}
                                    />
                                </View>
                            </View>

                            <Text style={styles.label}>VEHICLE REGISTRATION NO.</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. ABC-1234"
                                placeholderTextColor="#64748B"
                                value={vehicleNo}
                                onChangeText={setVehicleNo}
                            />

                            <Text style={styles.label}>ISSUE / PROBLEM</Text>
                            <TextInput
                                style={[styles.input, { height: 70 }]}
                                placeholder="Describe your issue (e.g. Engine heat up, Flat Tire)"
                                placeholderTextColor="#64748B"
                                multiline
                                value={problem}
                                onChangeText={setProblem}
                            />

                            <TouchableOpacity style={styles.llmBtn} onPress={handleLLMChat} activeOpacity={0.8}>
                                <LinearGradient
                                    colors={['rgba(139, 92, 246, 0.25)', 'rgba(99, 102, 241, 0.25)']}
                                    style={styles.llmBtnGradient}>
                                    <Text style={styles.llmBtnText}>🤖 Diagnose Issue with AI Assist</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <View style={styles.divider} />

                            <Text style={styles.sectionTitle}>Location Setup</Text>

                            <Text style={styles.label}>PICKUP LOCATION</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Current Location / GPS"
                                placeholderTextColor="#64748B"
                                value={currentLoc}
                                onChangeText={setCurrentLoc}
                            />

                            <Text style={styles.label}>DESTINATION WORKSHOP</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Dropoff Address / Mechanic Shop"
                                placeholderTextColor="#64748B"
                                value={dropoffLoc}
                                onChangeText={setDropoffLoc}
                            />

                            <TouchableOpacity activeOpacity={0.85} onPress={handleGetTow} style={styles.mainBtnWrapper}>
                                <LinearGradient
                                    colors={['#6366F1', '#4F46E5']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.primaryBtn}>
                                    <Text style={styles.primaryBtnText}>Find Available Towing Service ➔</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </LinearGradient>

            {/* Custom Drawer Overlay */}
            {isDrawerOpen && (
                <View style={styles.customDrawerWrapper}>
                    <TouchableOpacity
                        style={styles.drawerBackdrop}
                        activeOpacity={1}
                        onPress={() => setIsDrawerOpen(false)}
                    />
                    <View style={styles.drawerPanel}>
                        <View style={styles.drawerHeader}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>U</Text>
                            </View>
                            <Text style={styles.userName}>Ahmed Ali</Text>
                            <Text style={styles.userSub}>+92 300 0000000</Text>
                        </View>

                        <View style={styles.drawerMenu}>
                            <TouchableOpacity style={styles.drawerItem} onPress={() => setIsDrawerOpen(false)}>
                                <Text style={styles.drawerItemText}>🚨 Request Towing</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.drawerItem} onPress={() => setIsDrawerOpen(false)}>
                                <Text style={styles.drawerItemText}>📜 My Rides History</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.drawerItem} onPress={() => setIsDrawerOpen(false)}>
                                <Text style={styles.drawerItemText}>💳 Saved Payment Options</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.drawerItem} onPress={() => setIsDrawerOpen(false)}>
                                <Text style={styles.drawerItemText}>⚙️ Account Settings</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    topHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 15,
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 12,
    },
    menuBtn: { padding: 8, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
    menuIcon: { fontSize: 26, color: '#FFFFFF' },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
    profileBadge: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#3730A3',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#6366F1',
    },
    profileBadgeText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
    scrollContainer: { paddingHorizontal: 16, paddingBottom: 40 },
    heroBanner: { borderRadius: 18, padding: 20, marginTop: 6, marginBottom: 16 },
    bannerBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    bannerBadgeText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
    bannerTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', marginBottom: 6 },
    bannerSub: { fontSize: 13, color: '#E0E7FF', lineHeight: 18 },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 12 },
    rowInputs: { flexDirection: 'row', justifyContent: 'space-between' },
    label: { fontSize: 10, fontWeight: '700', color: '#FFFFFF', marginBottom: 6, letterSpacing: 0.8 },
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
    divider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.08)', marginVertical: 16 },
    llmBtn: { borderRadius: 12, overflow: 'hidden', marginBottom: 4 },
    llmBtnGradient: { paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: '#8B5CF6', borderRadius: 12 },
    llmBtnText: { color: '#C4B5FD', fontWeight: '700', fontSize: 13 },
    mainBtnWrapper: { borderRadius: 12, overflow: 'hidden', marginTop: 8 },
    primaryBtn: { paddingVertical: 15, alignItems: 'center' },
    primaryBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
    customDrawerWrapper: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 9999, flexDirection: 'row' },
    drawerBackdrop: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.75)' },
    drawerPanel: { width: '75%', height: '100%', backgroundColor: '#0B0F19', padding: 24, zIndex: 10000, elevation: 20 },
    drawerHeader: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
        paddingBottom: 20,
        marginBottom: 20,
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 10 : 40,
    },
    avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#6366F1', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
    avatarText: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF' },
    userName: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
    userSub: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
    drawerMenu: { flex: 1 },
    drawerItem: { paddingVertical: 14 },
    drawerItemText: { fontSize: 15, color: '#CBD5E1', fontWeight: '500' },
});