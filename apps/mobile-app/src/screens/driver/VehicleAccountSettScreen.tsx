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
    Switch,
    ActivityIndicator,
    Alert,
    Modal,
    Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';

interface VehicleAccountSettScreenProps {
    navigation?: any;
    onBackPress?: () => void;
}

const VEHICLE_TYPES = [
    'Flatbed Tow Truck',
    'Hook and Chain Tow Truck',
    'Wheel-Lift Tow Truck',
    'Heavy Duty Integrated Tow Truck',
];

const VehicleAccountSettScreen: React.FC<VehicleAccountSettScreenProps> = ({ navigation, onBackPress }) => {
    // Top Driver Status State
    const [isActive, setIsActive] = useState(true);

    // Read-Only Driver Fields
    const [driverName] = useState('Kamran Khan');
    const [email] = useState('kamran.towme@gmail.com');
    const [phone] = useState('+92 333 1234567');
    const [password] = useState('••••••••••••');

    // Editable Fields
    const [selectedVehicle, setSelectedVehicle] = useState('Flatbed Tow Truck');
    const [vehicleNo, setVehicleNo] = useState('TOW-8899');

    // Dropdown Modal State
    const [dropdownVisible, setDropdownVisible] = useState(false);

    // Document States (Image URIs)
    const [profileImg, setProfileImg] = useState<string | null>(null);
    const [cnicFrontImg, setCnicFrontImg] = useState<string | null>(null);
    const [cnicBackImg, setCnicBackImg] = useState<string | null>(null);
    const [licenseImg, setLicenseImg] = useState<string | null>(null);
    const [vehiclePapersImg, setVehiclePapersImg] = useState<string | null>(null);

    const [isSaving, setIsSaving] = useState(false);
console.log(profileImg,cnicFrontImg,cnicBackImg,licenseImg,vehiclePapersImg,"profileImgprofileImgprofileImgprofileImg")
    const toggleStatus = () => {
        setIsActive(previousState => !previousState);
    };

    // Generic Image Picker Function (Camera / Gallery Chooser)
    const selectImage = (setImageState: (uri: string) => void) => {
        Alert.alert(
            'Select Image Source',
            'Choose an option to pick an image',
            [
                {
                    text: 'Camera',
                    onPress: () => {
                        launchCamera({ mediaType: 'photo', quality: 0.8 }, (response: ImagePickerResponse) => {
                            if (response.assets && response.assets.length > 0 && response.assets[0].uri) {
                                setImageState(response.assets[0].uri);
                            }
                        });
                    },
                },
                {
                    text: 'Gallery',
                    onPress: () => {
                        launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response: ImagePickerResponse) => {
                            if (response.assets && response.assets.length > 0 && response.assets[0].uri) {
                                setImageState(response.assets[0].uri);
                            }
                        });
                    },
                },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    const handleSaveDetails = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            Alert.alert('Success', 'Vehicle settings updated successfully!');
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

                    {/* Top Header */}
                    <View style={styles.topHeader}>
                        <TouchableOpacity
                            style={styles.backBtn}
                            onPress={handleGoBack}
                            activeOpacity={0.6}
                            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                            <Icon name="arrow-back-outline" size={24} color="#FFFFFF" />
                        </TouchableOpacity>

                        <Text style={styles.headerTitle}>Driver Account & Vehicle</Text>

                        <View style={{ width: 24 }} />
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                        {/* TOP STATUS CARD (ACTIVE / INACTIVE TOGGLE) */}
                        <View style={[styles.statusCard, isActive ? styles.statusActiveBorder : styles.statusInactiveBorder]}>
                            <View style={styles.statusHeader}>
                                <View style={styles.statusTitleRow}>
                                    <View style={[styles.statusIndicatorDot, { backgroundColor: isActive ? '#22C55E' : '#EF4444' }]} />
                                    <Text style={styles.statusCardTitle}>
                                        {isActive ? 'PROFILE IS ACTIVE' : 'PROFILE IS INACTIVE'}
                                    </Text>
                                </View>
                                <Switch
                                    trackColor={{ false: '#374151', true: 'rgba(34, 197, 94, 0.4)' }}
                                    thumbColor={isActive ? '#22C55E' : '#9CA3AF'}
                                    ios_backgroundColor="#374151"
                                    onValueChange={toggleStatus}
                                    value={isActive}
                                />
                            </View>

                            <Text style={styles.statusDescription}>
                                {isActive
                                    ? 'Aap active hain! Bilkul paas ke users ki towing requests aap tak bhaiji jayengi.'
                                    : 'Aap offline hain! Jab tak aap ise Active nahi karenge, aapko koi naye order receive nahi honge.'}
                            </Text>

                            <View style={[styles.badgePill, { backgroundColor: isActive ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)' }]}>
                                <Icon
                                    name={isActive ? 'radio-outline' : 'pause-circle-outline'}
                                    size={14}
                                    color={isActive ? '#22C55E' : '#EF4444'}
                                />
                                <Text style={[styles.badgePillText, { color: isActive ? '#22C55E' : '#EF4444' }]}>
                                    {isActive ? 'Ready for New Requests' : 'Requests Paused'}
                                </Text>
                            </View>
                        </View>

                        {/* PROFILE PIC CARD */}
                        <View style={styles.profilePicCard}>
                            <View style={styles.avatarContainer}>
                                {profileImg ? (
                                    <Image source={{ uri: profileImg }} style={styles.avatarImage} />
                                ) : (
                                    <View style={styles.avatar}>
                                        <Text style={styles.avatarText}>KK</Text>
                                    </View>
                                )}
                                <TouchableOpacity
                                    style={styles.cameraBadge}
                                    activeOpacity={0.8}
                                    onPress={() => selectImage(setProfileImg)}>
                                    <Icon name="camera" size={15} color="#FFFFFF" />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.profilePicLabel}>Profile Picture</Text>
                        </View>

                        {/* DRIVER INFO (READ-ONLY) */}
                        <View style={styles.card}>
                            <View style={styles.sectionHeaderRow}>
                                <Text style={styles.sectionTitle}>Driver Account Details</Text>
                                <View style={styles.readOnlyTag}>
                                    <Icon name="lock-closed-outline" size={12} color="#9CA3AF" />
                                    <Text style={styles.readOnlyTagText}>View Only</Text>
                                </View>
                            </View>

                            {/* Name */}
                            <Text style={styles.label}>NAME *</Text>
                            <View style={styles.readOnlyInputContainer}>
                                <TextInput
                                    style={styles.disabledInput}
                                    value={driverName}
                                    editable={false}
                                />
                                <Icon name="lock-closed-outline" size={16} color="#64748B" />
                            </View>

                            {/* Email */}
                            <Text style={styles.label}>EMAIL *</Text>
                            <View style={styles.readOnlyInputContainer}>
                                <TextInput
                                    style={styles.disabledInput}
                                    value={email}
                                    editable={false}
                                />
                                <Icon name="lock-closed-outline" size={16} color="#64748B" />
                            </View>

                            {/* Phone */}
                            <Text style={styles.label}>PHONE *</Text>
                            <View style={styles.readOnlyInputContainer}>
                                <TextInput
                                    style={styles.disabledInput}
                                    value={phone}
                                    editable={false}
                                />
                                <Icon name="lock-closed-outline" size={16} color="#64748B" />
                            </View>

                            {/* Password */}
                            <Text style={styles.label}>PASSWORD *</Text>
                            <View style={styles.readOnlyInputContainer}>
                                <TextInput
                                    style={styles.disabledInput}
                                    value={password}
                                    secureTextEntry
                                    editable={false}
                                />
                                <Icon name="lock-closed-outline" size={16} color="#64748B" />
                            </View>
                        </View>

                        {/* VEHICLE INFO & DOCUMENTS */}
                        <View style={[styles.card, { marginTop: 16 }]}>
                            <Text style={styles.sectionTitle}>Vehicle & Documents</Text>

                            {/* Vehicle Dropdown */}
                            <Text style={styles.label}>VEHICLE (DROPDOWN) *</Text>
                            <TouchableOpacity
                                style={styles.dropdownBtn}
                                activeOpacity={0.8}
                                onPress={() => setDropdownVisible(true)}>
                                <Text style={styles.dropdownBtnText}>{selectedVehicle}</Text>
                                <Icon name="chevron-down" size={18} color="#9CA3AF" />
                            </TouchableOpacity>

                            {/* Vehicle No */}
                            <Text style={styles.label}>VEHICLE NO. *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. TOW-8899"
                                placeholderTextColor="#64748B"
                                autoCapitalize="characters"
                                value={vehicleNo}
                                onChangeText={setVehicleNo}
                            />

                            {/* CNIC FRONT (IMG) */}
                            <Text style={styles.label}>CNIC FRONT (IMG)</Text>
                            <View style={styles.docUploadBox}>
                                <View style={styles.docInfoLeft}>
                                    {cnicFrontImg ? (
                                        <Image source={{ uri: cnicFrontImg }} style={styles.previewImage} />
                                    ) : (
                                        <Icon name="card-outline" size={22} color="#818CF8" />
                                    )}
                                    <View style={{ marginLeft: 10 }}>
                                        <Text style={styles.docTitle}>CNIC Front Side</Text>
                                        <Text style={[styles.docStatusText, { color: cnicFrontImg ? '#22C55E' : '#EF4444' }]}>
                                            {cnicFrontImg ? 'Uploaded' : 'No File Chosen'}
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.uploadBtn} onPress={() => selectImage(setCnicFrontImg)}>
                                    <Icon name="cloud-upload-outline" size={16} color="#FFF" />
                                    <Text style={styles.uploadBtnText}>{cnicFrontImg ? 'Change' : 'Upload'}</Text>
                                </TouchableOpacity>
                            </View>

                            {/* CNIC BACK (IMG) */}
                            <Text style={styles.label}>CNIC BACK (IMG)</Text>
                            <View style={styles.docUploadBox}>
                                <View style={styles.docInfoLeft}>
                                    {cnicBackImg ? (
                                        <Image source={{ uri: cnicBackImg }} style={styles.previewImage} />
                                    ) : (
                                        <Icon name="card-outline" size={22} color="#818CF8" />
                                    )}
                                    <View style={{ marginLeft: 10 }}>
                                        <Text style={styles.docTitle}>CNIC Back Side</Text>
                                        <Text style={[styles.docStatusText, { color: cnicBackImg ? '#22C55E' : '#EF4444' }]}>
                                            {cnicBackImg ? 'Uploaded' : 'No File Chosen'}
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.uploadBtn} onPress={() => selectImage(setCnicBackImg)}>
                                    <Icon name="cloud-upload-outline" size={16} color="#FFF" />
                                    <Text style={styles.uploadBtnText}>{cnicBackImg ? 'Change' : 'Upload'}</Text>
                                </TouchableOpacity>
                            </View>

                            {/* License (img) */}
                            <Text style={styles.label}>LICENSE (IMG)</Text>
                            <View style={styles.docUploadBox}>
                                <View style={styles.docInfoLeft}>
                                    {licenseImg ? (
                                        <Image source={{ uri: licenseImg }} style={styles.previewImage} />
                                    ) : (
                                        <Icon name="id-card-outline" size={22} color="#818CF8" />
                                    )}
                                    <View style={{ marginLeft: 10 }}>
                                        <Text style={styles.docTitle}>Driving License</Text>
                                        <Text style={[styles.docStatusText, { color: licenseImg ? '#22C55E' : '#EF4444' }]}>
                                            {licenseImg ? 'Uploaded' : 'No File Chosen'}
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.uploadBtn} onPress={() => selectImage(setLicenseImg)}>
                                    <Icon name="cloud-upload-outline" size={16} color="#FFF" />
                                    <Text style={styles.uploadBtnText}>{licenseImg ? 'Change' : 'Upload'}</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Vehicle Papers (img) */}
                            <Text style={styles.label}>VEHICLE PAPERS (IMG)</Text>
                            <View style={styles.docUploadBox}>
                                <View style={styles.docInfoLeft}>
                                    {vehiclePapersImg ? (
                                        <Image source={{ uri: vehiclePapersImg }} style={styles.previewImage} />
                                    ) : (
                                        <Icon name="document-text-outline" size={22} color="#818CF8" />
                                    )}
                                    <View style={{ marginLeft: 10 }}>
                                        <Text style={styles.docTitle}>Vehicle Papers / Registration</Text>
                                        <Text style={[styles.docStatusText, { color: vehiclePapersImg ? '#22C55E' : '#EF4444' }]}>
                                            {vehiclePapersImg ? 'Uploaded' : 'No File Chosen'}
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.uploadBtn} onPress={() => selectImage(setVehiclePapersImg)}>
                                    <Icon name="cloud-upload-outline" size={16} color="#FFF" />
                                    <Text style={styles.uploadBtnText}>{vehiclePapersImg ? 'Change' : 'Upload'}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.divider} />

                            {/* Save Button */}
                            <TouchableOpacity
                                activeOpacity={0.85}
                                onPress={handleSaveDetails}
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
                                        <Text style={styles.primaryBtnText}>Save Vehicle Settings</Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                        </View>

                    </ScrollView>
                </SafeAreaView>
            </LinearGradient>

            {/* VEHICLE SELECTOR MODAL */}
            <Modal
                visible={dropdownVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setDropdownVisible(false)}>
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setDropdownVisible(false)}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Vehicle Type</Text>
                        {VEHICLE_TYPES.map((type, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.modalOption}
                                onPress={() => {
                                    setSelectedVehicle(type);
                                    setDropdownVisible(false);
                                }}>
                                <Text
                                    style={[
                                        styles.modalOptionText,
                                        selectedVehicle === type && styles.modalOptionTextActive,
                                    ]}>
                                    {type}
                                </Text>
                                {selectedVehicle === type && (
                                    <Icon name="checkmark" size={18} color="#6366F1" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
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
    statusCard: {
        backgroundColor: 'rgba(31, 41, 55, 0.7)',
        borderRadius: 20,
        padding: 18,
        marginBottom: 16,
        marginTop: 10,
        borderWidth: 1.5,
    },
    statusActiveBorder: {
        borderColor: 'rgba(34, 197, 94, 0.5)',
    },
    statusInactiveBorder: {
        borderColor: 'rgba(239, 68, 68, 0.5)',
    },
    statusHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    statusTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusIndicatorDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    statusCardTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    statusDescription: {
        color: '#9CA3AF',
        fontSize: 12,
        lineHeight: 18,
        marginBottom: 12,
    },
    badgePill: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        gap: 6,
    },
    badgePillText: {
        fontSize: 11,
        fontWeight: '600',
    },
    profilePicCard: {
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: '#4F46E5',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    avatarImage: {
        width: 76,
        height: 76,
        borderRadius: 38,
        borderWidth: 2,
        borderColor: '#6366F1',
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 26,
        fontWeight: 'bold',
    },
    cameraBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#6366F1',
        width: 26,
        height: 26,
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#0B0F19',
    },
    profilePicLabel: {
        color: '#9CA3AF',
        fontSize: 12,
        marginTop: 6,
        fontWeight: '500',
    },
    card: {
        backgroundColor: 'rgba(31, 41, 55, 0.6)',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    readOnlyTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4,
    },
    readOnlyTagText: {
        color: '#9CA3AF',
        fontSize: 10,
        fontWeight: '600',
    },
    label: {
        color: '#9CA3AF',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 6,
    },
    readOnlyInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        paddingHorizontal: 14,
        marginBottom: 14,
    },
    disabledInput: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 13,
        color: '#64748B',
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
    dropdownBtn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 14,
    },
    dropdownBtnText: {
        color: '#FFFFFF',
        fontSize: 13,
    },
    docUploadBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 14,
    },
    docInfoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    previewImage: {
        width: 36,
        height: 36,
        borderRadius: 6,
    },
    docTitle: {
        color: '#E5E7EB',
        fontSize: 13,
        fontWeight: '600',
    },
    docStatusText: {
        fontSize: 10,
        marginTop: 2,
    },
    uploadBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#374151',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 4,
    },
    uploadBtnText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '600',
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContent: {
        width: '100%',
        backgroundColor: '#1E293B',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    modalTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 16,
    },
    modalOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    modalOptionText: {
        color: '#9CA3AF',
        fontSize: 14,
    },
    modalOptionTextActive: {
        color: '#6366F1',
        fontWeight: '700',
    },
});

export default VehicleAccountSettScreen;