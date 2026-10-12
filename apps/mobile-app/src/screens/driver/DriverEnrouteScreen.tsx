// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   StatusBar,
//   ScrollView,
//   ActivityIndicator,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';
// import apiClient from '../api/apiClient'; // Adjust your import path as needed

// export default function DriverEnrouteScreen({ route, navigation }: any) {
//   // Extract item/request passed from navigation
//   const passedRequest = route.params?.request;
//   const requestId = passedRequest?.id;

//   const [requestData, setRequestData] = useState(passedRequest || {
//     userName: 'Ahmed Ali',
//     userPhone: '+92 321 9876543',
//     vehicle: 'Honda Civic',
//     vehicleNo: 'LEB-4321',
//     pickupLoc: 'Gulberg III, Lahore',
//     problem: 'Engine Break Down (Towing Required)',
//     dropoffLoc: 'DHA Phase 5, Lahore',
//   });

//   const [loading, setLoading] = useState(false);
//   const [currentStep, setCurrentStep] = useState(1);

//   // Fetch API data on mount using GET /service-request/:id/en-route
//   useEffect(() => {
//     if (requestId) {
//       fetchEnrouteDetails();
//     }
//   }, [requestId]);

//   const fetchEnrouteDetails = async () => {
//     try {
//       setLoading(true);
//       console.log("Fetching enroute details for ID:", requestId);
      
//       const response: any = await apiClient.get(`/service-request/${requestId}/en-route`);
//       console.log("Enroute API Response:", response);

//       if (response) {
//         // Adjust if your backend wraps data inside response.data or response.item
//         setRequestData(response.data || response);
//       }
//     } catch (error) {
//       console.error("Error fetching enroute details:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const statuses = [
//     {
//       id: 1,
//       title: 'Request Accepted',
//       desc: 'You accepted the towing job.',
//       time: '10:42 AM',
//       iconName: 'checkmark-circle-outline',
//     },
//     {
//       id: 2,
//       title: 'In Transit / Enroute',
//       desc: `Navigating to ${requestData.userName || 'Customer'}'s pickup location.`,
//       time: 'Arriving in ~8 mins',
//       iconName: 'car-outline',
//     },
//     {
//       id: 3,
//       title: 'Vehicle Picked Up',
//       desc: 'Car safely hooked & loaded onto your tow truck.',
//       time: 'Pending',
//       iconName: 'construct-outline',
//     },
//     {
//       id: 4,
//       title: 'Arrived Safely / Delivered',
//       desc: 'Vehicle safely delivered to dropoff location.',
//       time: 'Pending',
//       iconName: 'flag-outline',
//     },
//   ];

//   const handleNextStage = () => {
//     if (currentStep < 4) {
//       setCurrentStep((prev) => prev + 1);
//     } else {
//       navigation.navigate('DriverHomeScreen');
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#A78BFA" />
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1, backgroundColor: '#0B0F19' }}>
//       <StatusBar
//         barStyle="light-content"
//         {...({
//           translucent: true,
//           backgroundColor: 'transparent',
//         } as any)}
//       />
      
//       <LinearGradient colors={['#0B0F19', '#111827', '#1E1B4B']} style={{ flex: 1 }}>
//         <SafeAreaView style={{ flex: 1 }}>
//           {/* Header */}
//           <View style={styles.topHeader}>
//             <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
//               <Icon name="arrow-back" size={22} color="#A78BFA" />
//             </TouchableOpacity>
//             <Text style={styles.headerTitle}>Trip Management</Text>
//             <View style={{ width: 30 }} />
//           </View>

//           <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
//             {/* Map Placeholder */}
//             <View style={styles.mapBox}>
//               <Icon name="map-outline" size={36} color="#A78BFA" />
//               <Text style={styles.mapTitle}>🗺️ Live Navigation View</Text>
//               <Text style={styles.mapSub}>
//                 {currentStep <= 2 ? `Pickup: ${requestData.pickupLoc}` : `Dropoff: ${requestData.dropoffLoc}`}
//               </Text>
//             </View>

//             {/* Customer Info Card */}
//             <View style={styles.customerCard}>
//               <View style={styles.avatarCircle}>
//                 <Icon name="person" size={22} color="#FFFFFF" />
//               </View>
//               <View style={{ flex: 1, marginLeft: 12 }}>
//                 <Text style={styles.customerName}>{requestData.userName}</Text>
//                 <Text style={styles.customerSub}>
//                   {requestData.vehicle} {requestData.vehicleNo}
//                 </Text>
//                 <Text style={styles.customerPhone}>📞 {requestData.userPhone}</Text>
//               </View>
//             </View>

//             {/* Status Timeline Card */}
//             <View style={styles.card}>
//               <Text style={styles.sectionTitle}>Trip Status Timeline</Text>

//               <View style={styles.timelineContainer}>
//                 {statuses.map((item, index) => {
//                   const isDone = item.id <= currentStep;
//                   const isCurrent = item.id === currentStep;

//                   return (
//                     <View key={item.id} style={styles.timelineRow}>
//                       {index !== statuses.length - 1 && (
//                         <View
//                           style={[
//                             styles.timelineLine,
//                             item.id < currentStep && styles.timelineLineActive,
//                           ]}
//                         />
//                       )}

//                       <View
//                         style={[
//                           styles.iconCircle,
//                           isDone && styles.iconCircleActive,
//                           isCurrent && styles.iconCircleCurrent,
//                         ]}>
//                         <Icon
//                           name={item.iconName}
//                           size={18}
//                           color={isCurrent ? '#FFFFFF' : isDone ? '#A78BFA' : '#64748B'}
//                         />
//                       </View>

//                       <View style={styles.timelineContent}>
//                         <View style={styles.stepHeader}>
//                           <Text style={[styles.stepTitle, isDone && styles.textWhite]}>
//                             {item.title}
//                           </Text>
//                           <Text style={[styles.stepTime, isCurrent && styles.textHighlight]}>
//                             {item.time}
//                           </Text>
//                         </View>
//                         <Text style={styles.stepDesc}>{item.desc}</Text>
//                       </View>
//                     </View>
//                   );
//                 })}
//               </View>

//               {/* Main Stage Action Button */}
//               <TouchableOpacity style={styles.actionBtn} onPress={handleNextStage}>
//                 <Text style={styles.actionBtnText}>
//                   {currentStep === 1 && 'Start Driving to Customer'}
//                   {currentStep === 2 && 'Mark as Vehicle Picked Up'}
//                   {currentStep === 3 && 'Complete & Mark Delivered'}
//                   {currentStep === 4 && 'Finish Trip & Go Home'}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </ScrollView>
//         </SafeAreaView>
//       </LinearGradient>
//     </View>
//   );
// }

// const styles = StyleSheet.create({


//   loaderContainer: {
//     flex: 1,
//     backgroundColor: '#0B0F19',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   topHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingTop: 45,
//     paddingBottom: 15,
//   },
//   headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
//   backBtn: { paddingVertical: 6, paddingRight: 10 },
//   container: { padding: 16, paddingBottom: 30 },

//   // Map Block
//   mapBox: {
//     height: 160,
//     backgroundColor: 'rgba(255, 255, 255, 0.04)',
//     borderRadius: 18,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.08)',
//   },
//   mapTitle: { color: '#FFF', fontSize: 14, fontWeight: '700', marginTop: 6 },
//   mapSub: { color: '#94A3B8', fontSize: 12, marginTop: 2 },

//   // Customer Card
//   customerCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.05)',
//     borderRadius: 16,
//     padding: 14,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.08)',
//   },
//   avatarCircle: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: '#4F46E5',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   customerName: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
//   customerSub: { color: '#94A3B8', fontSize: 12, marginTop: 1 },
//   customerPhone: { color: '#A78BFA', fontSize: 12, fontWeight: '600', marginTop: 3 },

//   // Timeline
//   card: {
//     backgroundColor: 'rgba(255, 255, 255, 0.04)',
//     borderRadius: 20,
//     padding: 18,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.08)',
//   },
//   sectionTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 18 },
//   timelineContainer: { paddingLeft: 4, marginBottom: 10 },
//   timelineRow: { flexDirection: 'row', marginBottom: 24, position: 'relative' },
//   timelineLine: {
//     position: 'absolute',
//     top: 28,
//     left: 17,
//     width: 2,
//     height: '100%',
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     zIndex: 1,
//   },
//   timelineLineActive: { backgroundColor: '#6366F1' },
//   iconCircle: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: 'rgba(255, 255, 255, 0.08)',
//     alignItems: 'center',
//     justifyContent: 'center',
//     zIndex: 2,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.15)',
//   },
//   iconCircleActive: { backgroundColor: '#312E81', borderColor: '#6366F1' },
//   iconCircleCurrent: { backgroundColor: '#4F46E5', borderColor: '#A78BFA' },
//   timelineContent: { flex: 1, marginLeft: 14, justifyContent: 'center' },
//   stepHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   stepTitle: { fontSize: 14, fontWeight: '600', color: '#64748B' },
//   textWhite: { color: '#FFFFFF' },
//   stepTime: { fontSize: 11, color: '#64748B' },
//   textHighlight: { color: '#A78BFA', fontWeight: 'bold' },
//   stepDesc: { fontSize: 12, color: '#94A3B8', marginTop: 3 },

//   actionBtn: {
//     backgroundColor: '#10B981',
//     borderRadius: 14,
//     paddingVertical: 14,
//     alignItems: 'center',
//     marginTop: 6,
//   },
//   actionBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
// });

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import apiClient from '../api/apiClient'; // Adjust your import path as needed

export default function DriverEnrouteScreen({ route, navigation }: any) {
  const passedRequest = route.params?.request;
  const requestId = passedRequest?.id;

  const [requestData, setRequestData] = useState(passedRequest || {
    userName: 'Ahmed Ali',
    userPhone: '+92 321 9876543',
    vehicle: 'Honda Civic',
    vehicleNo: 'LEB-4321',
    pickupLoc: 'Gulberg III, Lahore',
    problem: 'Engine Break Down (Towing Required)',
    dropoffLoc: 'DHA Phase 5, Lahore',
  });

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Initial fetch and 2-second interval polling for live updates
  useEffect(() => {
    if (!requestId) return;

    fetchEnrouteDetails(); // Initial call

    const interval = setInterval(() => {
      fetchEnrouteDetails(true); // true means silent poll (no loading spinner)
    }, 2000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [requestId]);

  const fetchEnrouteDetails = async (isPolling = false) => {
    try {
      if (!isPolling) setLoading(true);
      
      const response: any = await apiClient.get(`/service-request/${requestId}/en-route`);
      if (response) {
        setRequestData(response.data || response);
      }
    } catch (error) {
      console.error("Error fetching enroute details:", error);
    } finally {
      if (!isPolling) setLoading(false);
    }
  };

  // Map step progression to backend status strings
  const handleNextStage = async () => {
    try {
      setUpdatingStatus(true);
      let nextStatus = '';

      if (currentStep === 1) {
        nextStatus = 'ARRIVED';
      } else if (currentStep === 2) {
        nextStatus = 'TOWING';
      } else if (currentStep === 3) {
        nextStatus = 'COMPLETED';
      }

      // Call the PATCH status update API if a status is mapped
      if (nextStatus) {
        console.log(`Updating status to ${nextStatus} for ID:`, requestId);
        await apiClient.patch(`/service-request/${requestId}/status`, {
          status: nextStatus,
        });
      }

      if (currentStep < 4) {
        setCurrentStep((prev) => prev + 1);
      } else {
        navigation.navigate('DriverHomeScreen');
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdatingStatus(false);
    }
  };

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
      desc: `Navigating to ${requestData.userName || 'Customer'}'s pickup location.`,
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

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#A78BFA" />
      </View>
    );
  }

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
                {currentStep <= 2 ? `Pickup: ${requestData.pickupLoc}` : `Dropoff: ${requestData.dropoffLoc}`}
              </Text>
            </View>

            {/* Customer Info Card */}
            <View style={styles.customerCard}>
              <View style={styles.avatarCircle}>
                <Icon name="person" size={22} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.customerName}>{requestData.userName}</Text>
                <Text style={styles.customerSub}>
                  {requestData.vehicle} {requestData.vehicleNo}
                </Text>
                <Text style={styles.customerPhone}>📞 {requestData.userPhone}</Text>
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
              <TouchableOpacity 
                style={[styles.actionBtn, updatingStatus && { opacity: 0.7 }]} 
                onPress={handleNextStage}
                disabled={updatingStatus}
              >
                {updatingStatus ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.actionBtnText}>
                    {currentStep === 1 && 'Start Driving to Customer'}
                    {currentStep === 2 && 'Mark as Vehicle Picked Up'}
                    {currentStep === 3 && 'Complete & Mark Delivered'}
                    {currentStep === 4 && 'Finish Trip & Go Home'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    backgroundColor: '#0B0F19',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backBtn: {
    padding: 6,
    backgroundColor: 'rgba(167, 139, 250, 0.1)',
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  container: {
    padding: 20,
  },
  mapBox: {
    height: 150,
    backgroundColor: 'rgba(30, 27, 75, 0.6)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.2)',
  },
  mapTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 8,
  },
  mapSub: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 4,
  },
  customerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customerName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  customerSub: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 2,
  },
  customerPhone: {
    color: '#A78BFA',
    fontSize: 13,
    marginTop: 4,
  },
  card: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  timelineContainer: {
    paddingLeft: 4,
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: 24,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 15,
    top: 32,
    width: 2,
    height: 40,
    backgroundColor: '#374151',
  },
  timelineLineActive: {
    backgroundColor: '#A78BFA',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  iconCircleActive: {
    borderColor: '#A78BFA',
    backgroundColor: 'rgba(167, 139, 250, 0.1)',
  },
  iconCircleCurrent: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  timelineContent: {
    flex: 1,
    marginLeft: 12,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepTitle: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
  },
  textWhite: {
    color: '#FFFFFF',
  },
  stepTime: {
    color: '#64748B',
    fontSize: 12,
  },
  textHighlight: {
    color: '#A78BFA',
    fontWeight: 'bold',
  },
  stepDesc: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 4,
  },
  actionBtn: {
    backgroundColor: '#7C3AED',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});