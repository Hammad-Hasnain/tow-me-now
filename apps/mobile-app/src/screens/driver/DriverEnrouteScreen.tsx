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

export default function DriverEnrouteScreen({ route, navigation }: any) {
  const request = route.params?.request || {
    userName: 'Ahmed Ali',
    userPhone: '+92 321 9876543',
    vehicle: 'Honda Civic',
    vehicleNo: 'LEB-4321',
    pickupLoc: 'Gulberg III, Lahore',
    problem: 'Engine Break Down (Towing Required)',
    dropoffLoc: 'DHA Phase 5, Lahore',
  };

  const [currentStep, setCurrentStep] = useState(1);

  const statuses = [
    {
      id: 1,
      title: 'Request Accepted',
      desc: 'You accepted the towing job.',
      time: '10:42 AM',
      iconName: 'checkmark-circle-outline',
    },
    {
      id: 2,
      title: 'In Transit / Enroute',
      desc: `Navigating to ${request.userName}'s pickup location.`,
      time: 'Arriving in ~8 mins',
      iconName: 'car-outline',
    },
    {
      id: 3,
      title: 'Vehicle Picked Up',
      desc: 'Car safely hooked & loaded onto your tow truck.',
      time: 'Pending',
      iconName: 'construct-outline',
    },
    {
      id: 4,
      title: 'Arrived Safely / Delivered',
      desc: 'Vehicle safely delivered to dropoff location.',
      time: 'Pending',
      iconName: 'flag-outline',
    },
  ];

  const handleNextStage = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Direct Stack Screen par wapas jayein
      navigation.navigate('DriverHomeScreen');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0B0F19' }}>
      {/* Fixed StatusBar Props */}
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
              <Icon name="arrow-back" size={22} color="#A78BFA" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Trip Management</Text>
            <View style={{ width: 30 }} />
          </View>

          <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            {/* Map Placeholder */}
            <View style={styles.mapBox}>
              <Icon name="map-outline" size={36} color="#A78BFA" />
              <Text style={styles.mapTitle}>🗺️ Live Navigation View</Text>
              <Text style={styles.mapSub}>
                {currentStep <= 2 ? `Pickup: ${request.pickupLoc}` : `Dropoff: ${request.dropoffLoc}`}
              </Text>
            </View>

            {/* Customer Info Card */}
            <View style={styles.customerCard}>
              <View style={styles.avatarCircle}>
                <Icon name="person" size={22} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.customerName}>{request.userName}</Text>
                <Text style={styles.customerSub}>{request.vehicle} • {request.vehicleNo}</Text>
                <Text style={styles.customerPhone}>📞 {request.userPhone}</Text>
              </View>
            </View>

            {/* Status Timeline Card */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Trip Status Timeline</Text>

              <View style={styles.timelineContainer}>
                {statuses.map((item, index) => {
                  const isDone = item.id <= currentStep;
                  const isCurrent = item.id === currentStep;

                  return (
                    <View key={item.id} style={styles.timelineRow}>
                      {index !== statuses.length - 1 && (
                        <View
                          style={[
                            styles.timelineLine,
                            item.id < currentStep && styles.timelineLineActive,
                          ]}
                        />
                      )}

                      <View
                        style={[
                          styles.iconCircle,
                          isDone && styles.iconCircleActive,
                          isCurrent && styles.iconCircleCurrent,
                        ]}>
                        <Icon
                          name={item.iconName}
                          size={18}
                          color={isCurrent ? '#FFFFFF' : isDone ? '#A78BFA' : '#64748B'}
                        />
                      </View>

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

              {/* Main Stage Action Button */}
              <TouchableOpacity style={styles.actionBtn} onPress={handleNextStage}>
                <Text style={styles.actionBtnText}>
                  {currentStep === 1 && 'Start Driving to Customer'}
                  {currentStep === 2 && 'Mark as Vehicle Picked Up'}
                  {currentStep === 3 && 'Complete & Mark Delivered'}
                  {currentStep === 4 && 'Finish Trip & Go Home'}
                </Text>
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
  backBtn: { paddingVertical: 6, paddingRight: 10 },
  container: { padding: 16, paddingBottom: 30 },

  // Map Block
  mapBox: {
    height: 160,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  mapTitle: { color: '#FFF', fontSize: 14, fontWeight: '700', marginTop: 6 },
  mapSub: { color: '#94A3B8', fontSize: 12, marginTop: 2 },

  // Customer Card
  customerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerName: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
  customerSub: { color: '#94A3B8', fontSize: 12, marginTop: 1 },
  customerPhone: { color: '#A78BFA', fontSize: 12, fontWeight: '600', marginTop: 3 },

  // Timeline
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

  actionBtn: {
    backgroundColor: '#10B981',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  actionBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
});