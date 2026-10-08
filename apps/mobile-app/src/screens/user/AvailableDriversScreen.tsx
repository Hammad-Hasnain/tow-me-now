import React from 'react';
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

export default function AvailableDriversScreen({ navigation,route }: any) {
    const driversList = [
        {
            id: '1',
            name: 'Ali Raza',
            phone: '+92 300 1234567',
            vehicle: 'Flatbed Tow Truck',
            vehicleNo: 'LEB-9988',
            distance: '2.5 km away',
            fare: 'PKR 3,500',
        },
        {
            id: '2',
            name: 'Usman Khan',
            phone: '+92 321 7654321',
            vehicle: 'Wheel Lift Truck',
            vehicleNo: 'KHI-4433',
            distance: '4.1 km away',
            fare: 'PKR 2,800',
        },
    ];

    const requestDetails = route?.params?.requestDetails;
// 2. Individual fields destruct karein
    const { 
        pickup, 
        dropoff 
    } = requestDetails || {};

    console.log("Pickup Data:", pickup?.address, pickup?.latitude, pickup?.longitude);
    console.log("Dropoff Data:", dropoff?.address, dropoff?.latitude, dropoff?.longitude);

    const handleSelectDriver = (driver: any) => {
        navigation.navigate('DriverStatus', { driver });
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
                                    <Text style={styles.fareText}>{driver.fare}</Text>
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