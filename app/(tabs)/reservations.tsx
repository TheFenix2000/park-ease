import Button from '@/components/Button';
import { colors, fontSizes, fontWeights, shadows, spacing } from '@/constants/theme';
import { Calendar, Car, Clock, MapPin, X } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Mock parking data
const MOCK_PARKING_SPOTS = [
  { id: '1', name: 'Downtown Parking A', address: '123 Main St', price: 5 },
  { id: '2', name: 'City Center Parking', address: '456 Oak Ave', price: 8 },
  { id: '3', name: 'North Side Parking', address: '789 Pine Rd', price: 6 },
  { id: '4', name: 'West End Garage', address: '321 Elm St', price: 7 },
];

// Mock reservation data
const MOCK_RESERVATIONS = [
  { 
    id: '101', 
    spotId: '1', 
    date: '2025-05-10', 
    timeStart: '09:00', 
    timeEnd: '11:00',
    status: 'active' 
  },
  { 
    id: '102', 
    spotId: '3', 
    date: '2025-05-15', 
    timeStart: '13:00', 
    timeEnd: '15:00',
    status: 'upcoming' 
  },
];

export default function ReservationsScreen() {
  const [activeTab, setActiveTab] = useState('reserve');
  const [reservations, setReservations] = useState(MOCK_RESERVATIONS);
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);
  
  // Mock function to get spot details
  const getSpotById = (id: string) => {
    return MOCK_PARKING_SPOTS.find(spot => spot.id === id);
  };
  
  // Mock function to create a reservation
  const createReservation = (spotId: string) => {
    const newReservation = {
      id: `${Date.now()}`,
      spotId,
      date: '2025-05-20',
      timeStart: '10:00',
      timeEnd: '12:00',
      status: 'upcoming'
    };
    
    setReservations([...reservations, newReservation]);
    Alert.alert('Success', 'Parking spot reserved successfully!');
    setActiveTab('my-spots');
  };
  
  // Mock function to cancel a reservation
  const cancelReservation = (id: string) => {
    Alert.alert(
      'Cancel Reservation',
      'Are you sure you want to cancel this reservation?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            const updatedReservations = reservations.filter(
              reservation => reservation.id !== id
            );
            setReservations(updatedReservations);
          },
        },
      ]
    );
  };
  
  const renderParkingSpot = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.spotCard,
        selectedSpot === item.id && styles.selectedSpotCard
      ]}
      onPress={() => setSelectedSpot(item.id)}
    >
      <View style={styles.spotInfo}>
        <Text style={styles.spotName}>{item.name}</Text>
        <View style={styles.spotAddressContainer}>
          <MapPin size={16} color={colors.text.secondary} />
          <Text style={styles.spotAddress}>{item.address}</Text>
        </View>
        <Text style={styles.spotPrice}>${item.price}/hour</Text>
      </View>
      
      {selectedSpot === item.id && (
        <Button
          title="Reserve"
          size="small"
          onPress={() => createReservation(item.id)}
          style={styles.reserveButton}
        />
      )}
    </TouchableOpacity>
  );
  
  const renderReservation = ({ item }) => {
    const spot = getSpotById(item.spotId);
    
    return (
      <View style={styles.reservationCard}>
        <View style={styles.reservationHeader}>
          <Text style={styles.reservationTitle}>{spot?.name}</Text>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => cancelReservation(item.id)}
          >
            <X size={16} color={colors.error} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.reservationDetailsContainer}>
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
            <Text style={styles.reservationDetailText}>{spot?.address}</Text>
          </View>
        </View>
        
        <View style={[
          styles.reservationStatus,
          item.status === 'active' ? styles.statusActive : styles.statusUpcoming
        ]}>
          <Text style={[
            styles.statusText,
            item.status === 'active' ? styles.statusTextActive : styles.statusTextUpcoming
          ]}>
            {item.status === 'active' ? 'Active Now' : 'Upcoming'}
          </Text>
        </View>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Parking</Text>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'reserve' && styles.activeTab]}
          onPress={() => setActiveTab('reserve')}
        >
          <Text style={[styles.tabText, activeTab === 'reserve' && styles.activeTabText]}>
            Find a Spot
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'my-spots' && styles.activeTab]}
          onPress={() => setActiveTab('my-spots')}
        >
          <Text style={[styles.tabText, activeTab === 'my-spots' && styles.activeTabText]}>
            My Reservations
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'reserve' ? (
        <FlatList
          data={MOCK_PARKING_SPOTS}
          renderItem={renderParkingSpot}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        reservations.length > 0 ? (
          <FlatList
            data={reservations}
            renderItem={renderReservation}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Car size={64} color={colors.gray[300]} />
            <Text style={styles.emptyText}>No reservations yet</Text>
            <Button
              title="Find a Spot"
              onPress={() => setActiveTab('reserve')}
              style={styles.findButton}
            />
          </View>
        )
      )}
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
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    fontFamily: 'Inter-Medium',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: fontWeights.semiBold,
    fontFamily: 'Inter-SemiBold',
  },
  listContainer: {
    padding: spacing.lg,
  },
  spotCard: {
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
    ...shadows.sm,
  },
  selectedSpotCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  spotInfo: {
    marginBottom: spacing.md,
  },
  spotName: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    fontFamily: 'Inter-SemiBold',
  },
  spotAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  spotAddress: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
    fontFamily: 'Inter-Regular',
  },
  spotPrice: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semiBold,
    color: colors.primary,
    fontFamily: 'Inter-SemiBold',
  },
  reserveButton: {
    alignSelf: 'flex-end',
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
  cancelButton: {
    padding: spacing.xs,
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
  reservationStatus: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusActive: {
    backgroundColor: colors.accentLight,
  },
  statusUpcoming: {
    backgroundColor: colors.primaryLight,
  },
  statusText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    fontFamily: 'Inter-Medium',
  },
  statusTextActive: {
    color: colors.accent,
  },
  statusTextUpcoming: {
    color: colors.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    fontSize: fontSizes.lg,
    color: colors.text.secondary,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    fontFamily: 'Inter-Regular',
  },
  findButton: {
    width: 200,
  },
});