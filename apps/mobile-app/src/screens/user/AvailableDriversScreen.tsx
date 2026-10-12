import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { serviceRequestService } from '../services/serviceRequest';

export default function AvailableDriversScreen({ navigation, route }: any) {
    // route.params se requestDetails nikalna zaroori hai
    const { requestDetails } = route?.params || {};
const requestId = requestDetails?.id;
    console.log("Received Request Details on Next Screen:", requestDetails);



    const [driversList, setDriversList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(false);

    // API Call to fetch available drivers
    useEffect(() => {
        const fetchAvailableDrivers = async () => {
            if (!requestId) {
                Alert.alert('Error', 'Service Request ID not found.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await serviceRequestService.getAvailableDrivers(requestId);
                console.log("Fetched Available Drivers:", data);
                
                // Agar data array hai to set kar dein (ya backend response ke mutabiq adjust karein)
                setDriversList(Array.isArray(data) ? data : data.drivers || []);
            } catch (error: any) {
                console.log("Error fetching drivers:", error);
                Alert.alert('Error', typeof error === 'string' ? error : 'Failed to fetch available drivers');
            } finally {
                setLoading(false);
            }
        };

        fetchAvailableDrivers();
    }, [requestId]);
const handleSelectDriver = async (driver: any) => {
        if (!requestId) {
            Alert.alert('Error', 'Service Request ID is missing.');
            return;
        }

        try {
            setAssigning(true);

            // Image ki API requirement ke mutabiq payload
            const payload = {
                driverId: driver.driverId, // Driver object se driverId
                fare: driver.fare,         // Driver object se fare
            };

            console.log("Assigning Driver Payload:", payload);

            const response = await serviceRequestService.assignDriver(requestId, payload);
            console.log("Assign Driver Response:", response);

            Alert.alert('Success', `Driver ${driver.driverName || 'Partner'} assigned successfully!`);

            // Next screen par navigate karein (e.g. Driver Status / Enroute screen)
            navigation.navigate('UserHomeScreen', { driver, response });

        } catch (error: any) {
            console.log("Assign Driver Error:", error);
            Alert.alert('Failed', error?.message || 'Could not assign driver.');
        } finally {
            setAssigning(false);
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
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.topHeader}>
                        <TouchableOpacity onPress={() => navigation.navigate("UserHomeScreen")} style={styles.backBtn}>
                            <Text style={styles.backBtnText}>← Back</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Available Towing Services</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <ScrollView contentContainerStyle={styles.container}>
                        {driversList.map((driver) => (
                            <View key={driver.id} style={styles.driverCard}>
                                <View style={styles.driverHeader}>
                                    <Text style={styles.driverName}>{driver.name}</Text>
                                    <Text style={styles.fareText}>{driver.fare} RS.</Text>
                                </View>
                                <Text style={styles.driverSub}>📞 {driver.phone}</Text>
                                <Text style={styles.driverSub}>🚚 {driver.vehicle} ({driver.vehicleNo})</Text>
                                <Text style={styles.distanceBadge}>⚡ {driver.distance}</Text>

                                <View style={styles.driverActions}>
                                    <TouchableOpacity
                                        style={styles.secondaryBtn}
                                        onPress={() => Alert.alert('Vehicle Info', driver.vehicle)}>
                                        <Text style={styles.secondaryBtnText}>Details</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.primaryBtnSmall}
                                        onPress={() => handleSelectDriver(driver)}>
                                        <Text style={styles.primaryBtnText}>Request Driver</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </SafeAreaView>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    topHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 15,
    },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
    backBtn: { paddingVertical: 6 },
    backBtnText: { color: '#A78BFA', fontWeight: '600', fontSize: 15 },
    container: { padding: 16 },
    driverCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    driverHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    driverName: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
    fareText: { fontSize: 16, fontWeight: 'bold', color: '#10B981' },
    driverSub: { fontSize: 13, color: '#94A3B8', marginTop: 2 },
    distanceBadge: { fontSize: 12, color: '#A78BFA', marginTop: 8, fontWeight: '600' },
    driverActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
    secondaryBtn: {
        flex: 0.35,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: 'center',
    },
    secondaryBtnText: { color: '#CBD5E1', fontSize: 13, fontWeight: '600' },
    primaryBtnSmall: {
        flex: 0.6,
        backgroundColor: '#6366F1',
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: 'center',
    },
    primaryBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
});