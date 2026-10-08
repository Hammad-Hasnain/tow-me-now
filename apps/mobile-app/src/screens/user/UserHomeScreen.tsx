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
    PermissionsAndroid,
    ActivityIndicator,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

export default function UserHomeScreen({ navigation }: any) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Form States
    const [vehicle, setVehicle] = useState('');
    const [model, setModel] = useState('');
    const [problem, setProblem] = useState('');
    const [currentLoc, setCurrentLoc] = useState('');
    const [dropoffLoc, setDropoffLoc] = useState('');
    const [vehicleNo, setVehicleNo] = useState('');
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [loadingDropoff, setLoadingDropoff] = useState(false);

    // Coordinates States
    const [pickupCoords, setPickupCoords] = useState<{ lat: number; lon: number } | null>(null);
    const [dropoffCoords, setDropoffCoords] = useState<{ lat: number; lon: number } | null>(null);

    // Reverse Geocoding with Timeout Safety & English Language
    const getAddressFromCoords = async (lat: number, lon: number) => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 sec timeout safety

            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`,
                {
                    headers: {
                        'User-Agent': 'HighwayTowingApp/1.0',
                    },
                    signal: controller.signal,
                }
            );
            clearTimeout(timeoutId);

            const data = await response.json();
            return data.display_name || `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
        } catch (error) {
            console.error('Geocoding error: ', error);
            return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
        }
    };


    console.log(pickupCoords,"current lat lon")
    console.log(dropoffCoords,"destination lat lon")

    // Dropoff Search Handler
    const handleSearchDropoff = async () => {
       if (!dropoffLoc.trim()) {
        Toast.show({
            type: 'error',
            text1: 'Search Input Empty ⚠️',
            text2: 'Please enter a location name or mechanic shop name.',
            position: 'bottom',
        });
        return;
    }

        setLoadingDropoff(true);
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(dropoffLoc)}&accept-language=en`,
                {
                    headers: {
                        'User-Agent': 'HighwayTowingApp/1.0',
                    },
                    signal: controller.signal,
                }
            );
            clearTimeout(timeoutId);

            const data = await response.json();

            if (data && data.length > 0) {
                const topResult = data[0];

                setDropoffLoc(topResult.display_name);
                setDropoffCoords({
                    lat: parseFloat(topResult.lat),
                    lon: parseFloat(topResult.lon),
                });

                // SUCCESS TOAST
            Toast.show({
                type: 'success',
                text1: 'Location Found',
                text2: topResult.display_name,
                position: 'top',
            });

            } else {
              Toast.show({
                type: 'error',
                text1: 'Location Not Found',
                text2: 'Could not find the location. Try entering a nearby landmark or city name.',
                position: 'top',
            });
            }

        } catch (error) {
            console.error('Dropoff Search Error:', error);
            Toast.show({
            type: 'error',
            text1: 'Search Error',
            text2: 'Failed to fetch location. Please check your network connection.',
            position: 'top',
        });
        } finally {
            setLoadingDropoff(false);
        }
    };

    // Android Location Permission
    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'This app needs access to your location for pickup.',
                        buttonPositive: 'OK',
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true;
    };

    // Current Location Pickup Handler
    const handleGetCurrentLocation = async () => {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
            Alert.alert('Permission Denied', 'Location permission is required.');
            return;
        }

        setLoadingLocation(true);

        Geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                // Save Coordinates State
                setPickupCoords({ lat: latitude, lon: longitude });

                // Fetch English Address Name
                const address = await getAddressFromCoords(latitude, longitude);
                setCurrentLoc(address);
                setLoadingLocation(false);
            },
            (error) => {
                setLoadingLocation(false);
                Alert.alert('Location Error', error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    const handleLLMChat = () => {
        Alert.alert('AI Assistant', 'Analyzing your vehicle description for fast support...');
    };

    // Navigate with Coordinates + Text Address
    const handleGetTow = () => {
        if (!currentLoc.trim() || !dropoffLoc.trim()) {
            Alert.alert('Required', 'Please enter Pick-up and Drop-off locations.');
            return;
        }

        const requestPayload = {
            vehicle,
            model,
            problem,
            vehicleNo,
            pickup: {
                address: currentLoc,
                latitude: pickupCoords?.lat || null,
                longitude: pickupCoords?.lon || null,
            },
            dropoff: {
                address: dropoffLoc,
                latitude: dropoffCoords?.lat || null,
                longitude: dropoffCoords?.lon || null,
            },
        };

        navigation.navigate('AvailableDrivers', {
            requestDetails: requestPayload,
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
{/* 
                            <TouchableOpacity style={styles.llmBtn} onPress={handleLLMChat} activeOpacity={0.8}>
                                <LinearGradient
                                    colors={['rgba(139, 92, 246, 0.25)', 'rgba(99, 102, 241, 0.25)']}
                                    style={styles.llmBtnGradient}>
                                    <Text style={styles.llmBtnText}>🤖 Diagnose Issue with AI Assist</Text>
                                </LinearGradient>
                            </TouchableOpacity> */}

                            <View style={styles.divider} />

                            <Text style={styles.sectionTitle}>Location Setup</Text>

                            {/* PICKUP LOCATION WITH GPS BUTTON */}
                            <Text style={styles.label}>PICKUP LOCATION</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
                                <TextInput
                                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                                    placeholder="Current Location / GPS"
                                    placeholderTextColor="#64748B"
                                    value={currentLoc}
                                    onChangeText={setCurrentLoc}
                                />
                                <TouchableOpacity
                                    onPress={handleGetCurrentLocation}
                                    disabled={loadingLocation}
                                    style={styles.gpsBtn}>
                                    {loadingLocation ? (
                                        <ActivityIndicator color="#FFF" size="small" />
                                    ) : (
                                       
                                       <Icon name="locate-outline" size={25} color="#dfa811" />
                                    )}
                                </TouchableOpacity>
                            </View>

                            {/* DESTINATION WORKSHOP WITH OSM SEARCH BUTTON */}
                            <Text style={styles.label}>DESTINATION WORKSHOP</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
                                <TextInput
                                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                                    placeholder="Dropoff Address / Mechanic Shop"
                                    placeholderTextColor="#64748B"
                                    value={dropoffLoc}
                                    onChangeText={setDropoffLoc}
                                />
                                <TouchableOpacity
                                    onPress={handleSearchDropoff}
                                    disabled={loadingDropoff}
                                    style={styles.searchBtn}>
                                    {loadingDropoff ? (
                                        <ActivityIndicator color="#FFF" size="small" />
                                    ) : (
                                       
                                      <Icon name="search-outline" size={25} color="#FFFFFF" />
                                    )}
                                </TouchableOpacity>
                            </View>

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
    menuBtn: {
        padding: 5,
    },
    menuIcon: {
        color: '#FFFFFF',
        fontSize: 22,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
    profileBadge: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#6366F1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileBadgeText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    heroBanner: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
    },
    bannerBadge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 10,
    },
    bannerBadgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '600',
    },
    bannerTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    bannerSub: {
        color: '#E0E7FF',
        fontSize: 12,
        lineHeight: 18,
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
        marginBottom: 14,
    },
    rowInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    gpsBtn: {
        backgroundColor: '#6366F1',
        height: 44,
        width: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    searchBtn: {
        backgroundColor: '#4F46E5',
        height: 44,
        width: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    llmBtn: {
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
    },
    llmBtnGradient: {
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.4)',
    },
    llmBtnText: {
        color: '#C4B5FD',
        fontSize: 13,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        marginVertical: 10,
        marginBottom: 16,
    },
    mainBtnWrapper: {
        marginTop: 10,
        borderRadius: 14,
        overflow: 'hidden',
    },
    primaryBtn: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    primaryBtnText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
    customDrawerWrapper: {
        ...StyleSheet.absoluteFill,
        zIndex: 999,
        flexDirection: 'row',
    },
    drawerBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    drawerPanel: {
        width: '75%',
        backgroundColor: '#111827',
        height: '100%',
        padding: 24,
        paddingTop: Platform.OS === 'android' ? 50 : 30,
    },
    drawerHeader: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
        paddingBottom: 20,
        marginBottom: 20,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#6366F1',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    userName: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    userSub: {
        color: '#9CA3AF',
        fontSize: 12,
        marginTop: 2,
    },
    drawerMenu: {
        gap: 16,
    },
    drawerItem: {
        paddingVertical: 10,
    },
    drawerItemText: {
        color: '#E5E7EB',
        fontSize: 15,
        fontWeight: '500',
    },
});