import Button from '@/components/Button';
import { colors, fontSizes, fontWeights, shadows, spacing } from '@/constants/theme';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Calendar, Clock, MapPin, Search, User, X } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Mock reservation data
const MOCK_RESERVATIONS = [
  { 
    id: '101', 
    spotId: '1',
    spotName: 'Downtown Parking A',
    spotAddress: '123 Main St',
    userId: 'user1',
    userName: 'John Doe',
    date: '2025-05-10', 
    timeStart: '09:00', 
    timeEnd: '11:00',
    status: 'active',
    verified: false,
  },
  { 
    id: '102', 
    spotId: '3',
    spotName: 'North Side Parking',
    spotAddress: '789 Pine Rd',
    userId: 'user2',
    userName: 'Jane Smith',
    date: '2025-05-10', 
    timeStart: '13:00', 
    timeEnd: '15:00',
    status: 'active',
    verified: true,
  },
  { 
    id: '103', 
    spotId: '2',
    spotName: 'City Center Parking',
    spotAddress: '456 Oak Ave',
    userId: 'user3',
    userName: 'Mike Johnson',
    date: '2025-05-10', 
    timeStart: '10:00', 
    timeEnd: '12:00',
    status: 'active',
    verified: false,
  },
];

export default function InspectorScreen() {
  const router = useRouter();
  const { isInspector } = useAuthContext();
  
  const [reservations, setReservations] = useState(MOCK_RESERVATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  
  if (!isInspector) {
    return (
      <View style={styles.unauthorizedContainer}>
        <Text style={styles.unauthorizedText}>
          You don't have permission to access this area.
        </Text>
      </View>
    );
  }
  
  const filteredReservations = reservations.filter(reservation => 
    reservation.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reservation.spotName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reservation.id.includes(searchQuery)
  );
  
  const verifyReservation = (id) => {
    const updatedReservations = reservations.map(reservation => 
      reservation.id === id 
        ? { ...reservation, verified: true }
        : reservation
    );
    
    setReservations(updatedReservations);
    Alert.alert('Success', 'Reservation verified successfully!');
  };
  
  const reportViolation = (id) => {
    Alert.alert(
      'Report Violation',
      'Are you sure you want to report a violation for this reservation?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Report',
          onPress: () => {
            // In a real app, this would create a violation report
            Alert.alert('Violation Reported', 'The violation has been reported successfully.');
          },
        },
      ]
    );
  };
  
  const renderReservation = ({ item }) => (
    <View style={styles.reservationCard}>
      <View style={styles.reservationHeader}>
        <Text style={styles.reservationTitle}>{item.spotName}</Text>
        
        <View style={[
          styles.verificationStatus,
          item.verified ? styles.verifiedStatus : styles.unverifiedStatus
        ]}>
          <Text style={[
            styles.statusText,
            item.verified ? styles.verifiedStatusText : styles.unverifiedStatusText
          ]}>
            {item.verified ? 'Verified' : 'Not Verified'}
          </Text>
        </View>
      </View>
      
      <View style={styles.reservationDetailsContainer}>
        <View style={styles.reservationDetail}>
          <User size={16} color={colors.text.secondary} />
          <Text style={styles.reservationDetailText}>{item.userName}</Text>
        </View>
        
        <View style={styles.reservationDetail}>
          <Calendar size={16} color={colors.text.secondary} />
          <Text style={styles.reservationDetailText}>{item.date}</Text>
        </View>
        
        <View style={styles.reservationDetail}>
          <Clock size={16} color={colors.text.secondary} />
          <Text style={styles.reservationDetailText}>{item.timeStart} - {item.timeEnd}</Text>
        </View>
        
        <View style={styles.reservationDetail}>
          <MapPin size={16} color={colors.text.secondary} />
          <Text style={styles.reservationDetailText}>{item.spotAddress}</Text>
        </View>
      </View>
      
      {!item.verified && (
        <View style={styles.actionButtons}>
          <Button
            title="Verify"
            variant="outline"
            onPress={() => verifyReservation(item.id)}
            style={styles.verifyButton}
            textStyle={styles.verifyButtonText}
          />
          
          <Button
            title="Report Violation"
            variant="outline"
            onPress={() => reportViolation(item.id)}
            style={styles.violationButton}
            textStyle={styles.violationButtonText}
          />
        </View>
      )}
    </View>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Inspector Dashboard</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={colors.gray[500]} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search reservations..."
            placeholderTextColor={colors.gray[400]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color={colors.gray[500]} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <FlatList
        data={filteredReservations}
        renderItem={renderReservation}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No reservations found</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    backgroundColor: colors.background.primary,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    fontFamily: 'Inter-Bold',
  },
  searchContainer: {
    padding: spacing.md,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSizes.md,
    color: colors.text.primary,
    fontFamily: 'Inter-Regular',
  },
  listContainer: {
    padding: spacing.lg,
  },
  reservationCard: {
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
    ...shadows.sm,
  },
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  reservationTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semiBold,
    color: colors.text.primary,
    fontFamily: 'Inter-SemiBold',
  },
  verificationStatus: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  verifiedStatus: {
    backgroundColor: colors.accentLight,
  },
  unverifiedStatus: {
    backgroundColor: colors.gray[200],
  },
  statusText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    fontFamily: 'Inter-Medium',
  },
  verifiedStatusText: {
    color: colors.accent,
  },
  unverifiedStatusText: {
    color: colors.gray[700],
  },
  reservationDetailsContainer: {
    marginBottom: spacing.md,
  },
  reservationDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  reservationDetailText: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
    fontFamily: 'Inter-Regular',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  verifyButton: {
    flex: 1,
    marginRight: spacing.xs,
    borderColor: colors.accent,
  },
  verifyButtonText: {
    color: colors.accent,
  },
  violationButton: {
    flex: 1,
    marginLeft: spacing.xs,
    borderColor: colors.error,
  },
  violationButtonText: {
    color: colors.error,
  },
  emptyContainer: {
    padding: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: fontSizes.lg,
    color: colors.text.secondary,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  unauthorizedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  unauthorizedText: {
    fontSize: fontSizes.lg,
    textAlign: 'center',
    color: colors.text.secondary,
    fontFamily: 'Inter-Medium',
  },
});