import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  Switch,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// Mock Data
const mockRequest = {
  fare: 'PKR 2,500',
  userName: 'Ali Raza',
  userPhone: '0300-1234567',
  vehicle: 'Toyota Corolla (2020)',
  vehicleNo: 'LEB-4521',
  problem: 'Engine Break Down (Towing Required)',
  pickupLoc: 'Gulberg III, Main Boulevard, Lahore',
  dropoffLoc: 'Toyota Township Motors, Lahore',
};

export default function HomeScreen() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [hasRequest, setHasRequest] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
// 2. Navigation Hook Initialize Karein
  const navigation = useNavigation<any>();
 // 3. Exact key 'request' ke naam se data pass karein
    navigation.navigate('DriverEnroute', {
      request: mockRequest,
    });


const handleAccept = () => {
  setHasRequest(false);
  setIsDrawerOpen(false); // Drawer state ko close karein

  // Standard Navigation
  navigation.navigate('DriverEnrouteScreen', {
    request: mockRequest,
  });
};
  const handleReject = () => {
    setHasRequest(false);
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
          
          {/* Top Header */}
          <View style={styles.topHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <TouchableOpacity
                style={styles.menuBtn}
                onPress={() => setIsDrawerOpen(true)}
                activeOpacity={0.6}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                <Text style={styles.menuIcon}>☰</Text>
              </TouchableOpacity>

              <View>
                <Text style={styles.headerSubtitle}>Welcome Back,</Text>
                <Text style={styles.headerTitle}>Driver Partner 👋</Text>
              </View>
            </View>

            {/* Online/Offline Switch */}
            <View style={[styles.toggleContainer, isOnline ? styles.onlineBg : styles.offlineBg]}>
              <Text style={styles.toggleText}>{isOnline ? 'Online' : 'Offline'}</Text>
              <Switch
                value={isOnline}
                onValueChange={(val) => {
                  setIsOnline(val);
                  if (!val) setHasRequest(false);
                }}
                trackColor={{ false: '#374151', true: '#059669' }}
                thumbColor={isOnline ? '#34D399' : '#9CA3AF'}
              />
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            
            {/* Quick Today's Stats Banner */}
            <View style={styles.statsBanner}>
              <LinearGradient
                colors={['rgba(99, 102, 241, 0.25)', 'rgba(30, 27, 75, 0.4)']}
                style={styles.statsGradient}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Today's Earned</Text>
                  <Text style={styles.statValue}>PKR 8,450</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Trips</Text>
                  <Text style={styles.statValue}>5 Jobs</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Online</Text>
                  <Text style={styles.statValue}>4.5 hrs</Text>
                </View>
              </LinearGradient>
            </View>

            {/* Promo / Announcement Banner */}
            <TouchableOpacity style={styles.promoBanner} activeOpacity={0.85}>
              <LinearGradient
                colors={['#4F46E5', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.promoGradient}>
                <View style={{ flex: 1 }}>
                  <View style={styles.promoBadge}>
                    <Text style={styles.promoBadgeText}>PEAK HOUR BONUS</Text>
                  </View>
                  <Text style={styles.promoTitle}>Earn 20% Extra on Every Tow!</Text>
                  <Text style={styles.promoSub}>Complete 3 more rides today before 10 PM.</Text>
                </View>
                <Icon name="rocket-outline" size={38} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>

            {/* Quick Action Buttons */}
            <View style={styles.actionGrid}>
              <TouchableOpacity style={styles.gridCard} activeOpacity={0.7}>
                <View style={[styles.gridIconBg, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                  <Icon name="wallet-outline" size={20} color="#10B981" />
                </View>
                <Text style={styles.gridText}>Payouts</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridCard} activeOpacity={0.7}>
                <View style={[styles.gridIconBg, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
                  <Icon name="map-outline" size={20} color="#6366F1" />
                </View>
                <Text style={styles.gridText}>Hotspots</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridCard} activeOpacity={0.7}>
                <View style={[styles.gridIconBg, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                  <Icon name="trophy-outline" size={20} color="#F59E0B" />
                </View>
                <Text style={styles.gridText}>Targets</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridCard} activeOpacity={0.7}>
                <View style={[styles.gridIconBg, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                  <Icon name="headset-outline" size={20} color="#EF4444" />
                </View>
                <Text style={styles.gridText}>Support</Text>
              </TouchableOpacity>
            </View>

            {/* Section Heading */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Job Dispatcher</Text>
              {isOnline && <Text style={styles.liveDot}>● Live Radar</Text>}
            </View>

            {/* Offline State */}
            {!isOnline && (
              <View style={styles.emptyCard}>
                <Icon name="power" size={48} color="#64748B" />
                <Text style={styles.emptyTitle}>You are Offline</Text>
                <Text style={styles.emptySub}>Turn online to start receiving towing requests.</Text>
              </View>
            )}

            {/* Online & Searching State */}
            {isOnline && !hasRequest && (
              <View style={styles.emptyCard}>
                <Icon name="radar-outline" size={48} color="#6366F1" />
                <Text style={styles.emptyTitle}>Searching for Nearby Requests...</Text>
                <Text style={styles.emptySub}>Stay active on this screen to get job notifications.</Text>
                <TouchableOpacity style={styles.demoSimulateBtn} onPress={() => setHasRequest(true)}>
                  <Text style={styles.demoSimulateText}>⚡ Simulate New Job</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* New Job Request Card */}
            {isOnline && hasRequest && (
              <View style={styles.requestCard}>
                <View style={styles.requestHeader}>
                  <View style={styles.badgeAlert}>
                    <Text style={styles.badgeAlertText}>NEW TOW REQUEST</Text>
                  </View>
                  <Text style={styles.fareText}>{mockRequest.fare}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Icon name="person-outline" size={18} color="#A78BFA" />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.label}>Customer</Text>
                    <Text style={styles.value}>{mockRequest.userName} ({mockRequest.userPhone})</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Icon name="car-sport-outline" size={18} color="#A78BFA" />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.label}>Vehicle</Text>
                    <Text style={styles.value}>{mockRequest.vehicle} • {mockRequest.vehicleNo}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Icon name="warning-outline" size={18} color="#F59E0B" />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.label}>Issue / Problem</Text>
                    <Text style={[styles.value, { color: '#FBBF24' }]}>{mockRequest.problem}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailRow}>
                  <Icon name="location-outline" size={18} color="#10B981" />
                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text style={styles.label}>Pickup Location</Text>
                    <Text style={styles.value}>{mockRequest.pickupLoc}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Icon name="navigate-outline" size={18} color="#EF4444" />
                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text style={styles.label}>Dropoff Location</Text>
                    <Text style={styles.value}>{mockRequest.dropoffLoc}</Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.rejectBtn} onPress={handleReject}>
                    <Text style={styles.rejectBtnText}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.acceptBtn} onPress={handleAccept}>
                    <Text style={styles.acceptBtnText}>Accept Request</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Daily Incentive Progress Card */}
            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalTitle}>Daily Target Progress</Text>
                <Text style={styles.goalSub}>5 / 8 Trips Done</Text>
              </View>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: '62%' }]} />
              </View>
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
                <Text style={styles.avatarText}>D</Text>
              </View>
              <Text style={styles.userName}>Driver Partner</Text>
              <Text style={styles.userSub}>+92 321 0000000</Text>
            </View>

            <View style={styles.drawerMenu}>
              <TouchableOpacity style={styles.drawerItem} onPress={() => setIsDrawerOpen(false)}>
                <Text style={styles.drawerItemText}>🚚 Active Jobs</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.drawerItem} onPress={() => setIsDrawerOpen(false)}>
                <Text style={styles.drawerItemText}>💰 Earnings & Payouts</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.drawerItem} onPress={() => setIsDrawerOpen(false)}>
                <Text style={styles.drawerItemText}>📜 Completed Trips</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.drawerItem} onPress={() => setIsDrawerOpen(false)}>
                <Text style={styles.drawerItemText}>⚙️ Vehicle & Account Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 12,
  },
  menuBtn: { padding: 8, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  menuIcon: { fontSize: 26, color: '#FFFFFF' },
  headerSubtitle: { color: '#94A3B8', fontSize: 11 },
  headerTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  onlineBg: { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: '#10B981' },
  offlineBg: { backgroundColor: 'rgba(100, 116, 139, 0.15)', borderColor: '#64748B' },
  toggleText: { color: '#FFF', fontWeight: 'bold', fontSize: 12, marginRight: 6 },
  container: { padding: 16, paddingBottom: 40 },
  
  /* Stats Banner */
  statsBanner: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statsGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  statItem: { alignItems: 'center', flex: 1 },
  statLabel: { color: '#94A3B8', fontSize: 11, marginBottom: 4 },
  statValue: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  statDivider: { width: 1, height: 26, backgroundColor: 'rgba(255, 255, 255, 0.15)' },

  /* Promo Banner */
  promoBanner: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 4,
  },
  promoGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  promoBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  promoBadgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' },
  promoTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  promoSub: { color: '#E0E7FF', fontSize: 11, marginTop: 2 },

  /* Action Grid */
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridCard: {
    width: (width - 64) / 4,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  gridIconBg: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  gridText: { color: '#CBD5E1', fontSize: 11, fontWeight: '600' },

  /* Section Title */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  liveDot: { color: '#10B981', fontSize: 12, fontWeight: '600' },

  /* Cards */
  emptyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  emptyTitle: { color: '#FFF', fontSize: 16, fontWeight: '700', marginTop: 14 },
  emptySub: { color: '#94A3B8', fontSize: 12, textAlign: 'center', marginTop: 6 },
  demoSimulateBtn: {
    marginTop: 18,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  demoSimulateText: { color: '#A78BFA', fontWeight: 'bold', fontSize: 12 },
  requestCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
  },
  requestHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  badgeAlert: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  badgeAlertText: { color: '#FCA5A5', fontSize: 10, fontWeight: '800' },
  fareText: { color: '#10B981', fontSize: 20, fontWeight: '800' },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  label: { color: '#64748B', fontSize: 11, fontWeight: '600' },
  value: { color: '#FFFFFF', fontSize: 13, fontWeight: '600', marginTop: 2 },
  divider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.08)', marginVertical: 10 },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  rejectBtn: {
    flex: 1,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  rejectBtnText: { color: '#FCA5A5', fontWeight: 'bold', fontSize: 14 },
  acceptBtn: {
    flex: 2,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  acceptBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },

  /* Target Progress Card */
  goalCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  goalTitle: { color: '#E2E8F0', fontSize: 13, fontWeight: '600' },
  goalSub: { color: '#A78BFA', fontSize: 12, fontWeight: 'bold' },
  progressBarTrack: { height: 8, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#6366F1', borderRadius: 4 },

  /* Custom Drawer Overlay Styles */
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
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  avatarText: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF' },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  userSub: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  drawerMenu: { flex: 1 },
  drawerItem: { paddingVertical: 14 },
  drawerItemText: { fontSize: 15, color: '#CBD5E1', fontWeight: '500' },
});