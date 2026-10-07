import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

export default function DriverStatusScreen({ route, navigation }: any) {
    const driver = route.params?.driver || {
        name: 'Ali Raza',
        phone: '+92 300 1234567',
        vehicle: 'Flatbed Tow Truck',
        vehicleNo: 'LEB-9988',
    };

    // Tracking States: 1 -> Accepted, 2 -> Enroute, 3 -> Picked Up, 4 -> Completed
    const [currentStep, setCurrentStep] = useState(1);

    const statuses = [
        {
            id: 1,
            title: 'Request Accepted',
            desc: 'Driver accepted your towing job.',
            time: '10:42 AM',
            iconName: 'checkmark-circle-outline',
        },
        {
            id: 2,
            title: 'Driver Enroute',
            desc: `${driver.name} is heading to your pickup location.`,
            time: 'Arriving in ~8 mins',
            iconName: 'car-outline',
        },
        {
            id: 3,
            title: 'Vehicle Picked Up',
            desc: 'Car safely hooked & loaded onto the tow truck.',
            time: 'Pending',
            iconName: 'construct-outline',
        },
        {
            id: 4,
            title: 'Arrived Safely',
            desc: 'Vehicle successfully delivered to destination.',
            time: 'Pending',
            iconName: 'flag-outline',
        },
    ];

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
                    {/* Header */}
                    <View style={styles.topHeader}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                            <Text style={styles.backBtnText}>← Back</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Live Trip Tracking</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                        {/* Live Status Top Banner */}
                        <LinearGradient
                            colors={['#312E81', '#4338CA', '#6366F1']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.engagementBanner}>
                            <View style={styles.pulseBadge}>
                                <View style={styles.pulseDot} />
                                <Text style={styles.pulseText}>LIVE ASSISTANCE IN PROGRESS</Text>
                            </View>

                            <Text style={styles.bannerTitle}>
                                {currentStep === 1 && 'Driver confirmed your booking!'}
                                {currentStep === 2 && 'Sit tight! Driver is on his way.'}
                                {currentStep === 3 && 'Vehicle is in transit to destination.'}
                                {currentStep === 4 && 'Trip Completed Successfully!'}
                            </Text>

                            <Text style={styles.bannerSub}>
                                We are continuously monitoring your tow request for safe delivery.
                            </Text>
                        </LinearGradient>

                        {/* Driver Brief Info Card */}
                        <View style={styles.driverInfoCard}>
                            <View style={styles.driverAvatar}>
                                <Text style={styles.avatarText}>
                                    {driver.name.split(' ').map((n: string) => n[0]).join('')}
                                </Text>
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={styles.driverName}>{driver.name}</Text>
                                <Text style={styles.driverSub}>{driver.vehicle} • {driver.vehicleNo}</Text>
                                <Text style={styles.driverPhone}>📞 {driver.phone}</Text>
                            </View>
                        </View>

                        {/* Status Timeline Card */}
                        <View style={styles.card}>
                            <Text style={styles.sectionTitle}>Trip Progress</Text>

                            <View style={styles.timelineContainer}>
                                {statuses.map((item, index) => {
                                    const isDone = item.id <= currentStep;
                                    const isCurrent = item.id === currentStep;

                                    return (
                                        <View key={item.id} style={styles.timelineRow}>
                                            {/* Line connecting steps */}
                                            {index !== statuses.length - 1 && (
                                                <View
                                                    style={[
                                                        styles.timelineLine,
                                                        item.id < currentStep && styles.timelineLineActive,
                                                    ]}
                                                />
                                            )}

                                            {/* Icon Indicator Circle */}
                                            <View
                                                style={[
                                                    styles.iconCircle,
                                                    isDone && styles.iconCircleActive,
                                                    isCurrent && styles.iconCircleCurrent,
                                                ]}>
                                                <Icon
                                                    name={item.iconName}
                                                    size={20}
                                                    color={isDone ? '#10B981' : '#94A3B8'}
                                                />
                                            </View>

                                            {/* Details Text */}
                                            <View style={styles.timelineContent}>
                                                <View style={styles.stepHeader}>
                                                    <Text style={[styles.stepTitle, isDone && styles.textWhite]}>
                                                        {item.title}
                                                    </Text>
                                                    <Text style={[styles.stepTime, isCurrent && styles.textHighlight]}>
                                                        {item.time}
                                                    </Text>
                                                </View>
                                                <Text style={styles.stepDesc}>{item.desc}</Text>
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>

                            {/* Demo Navigation button to test stages */}
                            <TouchableOpacity
                                style={styles.demoStepBtn}
                                onPress={() => setCurrentStep((prev) => (prev < 4 ? prev + 1 : 1))}>
                                <Text style={styles.demoStepBtnText}>
                                    🔄 Next Stage (Demo Test: {currentStep}/4)
                                </Text>
                            </TouchableOpacity>

                            {/* Cancel Button */}
                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={() => navigation.navigate('AvailableDrivers')}>
                                <Text style={styles.cancelBtnText}>Cancel Request</Text>
                            </TouchableOpacity>
                        </View>
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
        paddingTop: 45,
        paddingBottom: 15,
    },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
    backBtn: { paddingVertical: 6 },
    backBtnText: { color: '#A78BFA', fontWeight: '600', fontSize: 15 },
    container: { padding: 16, paddingBottom: 30 },

    // Engagement Top Banner
    engagementBanner: {
        borderRadius: 18,
        padding: 18,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    pulseBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#10B981',
    },
    pulseDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#10B981',
        marginRight: 6,
    },
    pulseText: { color: '#34D399', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
    bannerTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
    bannerSub: { fontSize: 12, color: '#C7D2FE', lineHeight: 16 },

    // Driver Card
    driverInfoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        padding: 14,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    driverAvatar: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: '#4F46E5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
    driverName: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    driverSub: { color: '#94A3B8', fontSize: 12, marginTop: 2 },
    driverPhone: { color: '#A78BFA', fontSize: 12, fontWeight: '600', marginTop: 4 },

    // Main Card & Stepper
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 18 },
    timelineContainer: { paddingLeft: 4, marginBottom: 10 },
    timelineRow: { flexDirection: 'row', marginBottom: 24, position: 'relative' },
    timelineLine: {
        position: 'absolute',
        top: 28,
        left: 17,
        width: 2,
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        zIndex: 1,
    },
    timelineLineActive: { backgroundColor: '#6366F1' },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    iconCircleActive: { backgroundColor: '#312E81', borderColor: '#6366F1' },
    iconCircleCurrent: { backgroundColor: '#4F46E5', borderColor: '#A78BFA' },
    timelineContent: { flex: 1, marginLeft: 14, justifyContent: 'center' },
    stepHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    stepTitle: { fontSize: 14, fontWeight: '600', color: '#64748B' },
    textWhite: { color: '#FFFFFF' },
    stepTime: { fontSize: 11, color: '#64748B' },
    textHighlight: { color: '#A78BFA', fontWeight: 'bold' },
    stepDesc: { fontSize: 12, color: '#94A3B8', marginTop: 3 },

    // Buttons
    demoStepBtn: {
        backgroundColor: 'rgba(99, 102, 241, 0.12)',
        borderWidth: 1,
        borderColor: '#6366F1',
        borderRadius: 12,
        paddingVertical: 10,
        alignItems: 'center',
        marginBottom: 12,
    },
    demoStepBtnText: { color: '#C4B5FD', fontSize: 12, fontWeight: '700' },
    cancelBtn: {
        backgroundColor: 'rgba(239, 68, 68, 0.12)',
        borderWidth: 1,
        borderColor: '#EF4444',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    cancelBtnText: { color: '#FCA5A5', fontWeight: 'bold', fontSize: 13 },
});