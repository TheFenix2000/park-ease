import Button from '@/components/Button';
import { colors, fontSizes, fontWeights, shadows, spacing } from '@/constants/theme';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { CreditCard as Edit, MapPin, Trash2, User, } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Mock parking data
const INITIAL_PARKING_SPOTS = [
  { id: '1', name: 'Downtown Parking A', address: '123 Main St', price: 5, available: true },
  { id: '2', name: 'City Center Parking', address: '456 Oak Ave', price: 8, available: true },
  { id: '3', name: 'North Side Parking', address: '789 Pine Rd', price: 6, available: true },
  { id: '4', name: 'West End Garage', address: '321 Elm St', price: 7, available: false },
];

// Mock user data
const MOCK_USERS = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
  { id: '3', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
  { id: '4', name: 'Inspector User', email: 'inspector@example.com', role: 'inspector' },
];

export default function AdminScreen() {
  const router = useRouter();
  const { user, isAdmin } = useAuthContext();
  
  const [activeTab, setActiveTab] = useState('spots');
  const [parkingSpots, setParkingSpots] = useState(INITIAL_PARKING_SPOTS);
  const [users, setUsers] = useState(MOCK_USERS);
  const [showAddSpotForm, setShowAddSpotForm] = useState(false);
  const [editingSpot, setEditingSpot] = useState(null);
  
  // Form state
  const [spotName, setSpotName] = useState('');
  const [spotAddress, setSpotAddress] = useState('');
  const [spotPrice, setSpotPrice] = useState('');
  
  if (!isAdmin) {
    return (
      <View style={styles.unauthorizedContainer}>
        <Text style={styles.unauthorizedText}>
          You don't have permission to access this area.
        </Text>
      </View>
    );
  }
  
  const resetForm = () => {
    setSpotName('');
    setSpotAddress('');
    setSpotPrice('');
    setEditingSpot(null);
  };
  
  const handleAddSpot = () => {
    if (!spotName || !spotAddress || !spotPrice) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    const newSpot = {
      id: `${Date.now()}`,
      name: spotName,
      address: spotAddress,
      price: parseFloat(spotPrice),
      available: true,
    };
    
    setParkingSpots([...parkingSpots, newSpot]);
    resetForm();
    setShowAddSpotForm(false);
    Alert.alert('Success', 'Parking spot added successfully!');
  };
  
  const handleUpdateSpot = () => {
    if (!spotName || !spotAddress || !spotPrice) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    const updatedSpots = parkingSpots.map(spot => 
      spot.id === editingSpot!.id 
        ? {
            ...spot,
            name: spotName,
            address: spotAddress,
            price: parseFloat(spotPrice),
          }
        : spot
    );
    
    setParkingSpots(updatedSpots);
    resetForm();
    setShowAddSpotForm(false);
    Alert.alert('Success', 'Parking spot updated successfully!');
  };
  
  const handleEditSpot = (spot) => {
    setSpotName(spot.name);
    setSpotAddress(spot.address);
    setSpotPrice(spot.price.toString());
    setEditingSpot(spot);
    setShowAddSpotForm(true);
  };
  
  const handleDeleteSpot = (id) => {
    Alert.alert(
      'Delete Parking Spot',
      'Are you sure you want to delete this parking spot?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            const updatedSpots = parkingSpots.filter(spot => spot.id !== id);
            setParkingSpots(updatedSpots);
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  const toggleSpotAvailability = (id) => {
    const updatedSpots = parkingSpots.map(spot => 
      spot.id === id 
        ? { ...spot, available: !spot.available }
        : spot
    );
    
    setParkingSpots(updatedSpots);
  };
  
  const renderParkingSpot = ({ item }) => (
    <View style={styles.spotCard}>
      <View style={styles.spotInfo}>
        <Text style={styles.spotName}>{item.name}</Text>
        <View style={styles.spotAddressContainer}>
          <MapPin size={16} color={colors.text.secondary} />
          <Text style={styles.spotAddress}>{item.address}</Text>
        </View>
        <Text style={styles.spotPrice}>${item.price}/hour</Text>
        
        <View style={styles.availabilityContainer}>
          <Text style={styles.availabilityLabel}>Available:</Text>
          <TouchableOpacity
            onPress={() => toggleSpotAvailability(item.id)}
            style={[
              styles.availabilityToggle,
              item.available ? styles.availableToggle : styles.unavailableToggle
            ]}
          >
            <View 
              style={[
                styles.toggleCircle,
              ]} 
            />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => handleEditSpot(item)}
        >
          <Edit size={16} color={colors.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDeleteSpot(item.id)}
        >
          <Trash2 size={16} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
  
  const renderUser = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <View style={styles.userEmailContainer}>
          <User size={16} color={colors.text.secondary} />
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
        <View style={styles.roleContainer}>
          <Text style={[
            styles.roleText,
            item.role === 'admin' && styles.adminRole,
            item.role === 'inspector' && styles.inspectorRole,
            item.role === 'user' && styles.userRole,
          ]}>
            {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
          </Text>
        </View>
      </View>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'spots' && styles.activeTab]}
          onPress={() => setActiveTab('spots')}
        >
          <Text style={[styles.tabText, activeTab === 'spots' && styles.activeTabText]}>
            Parking Spots
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'users' && styles.activeTab]}
          onPress={() => setActiveTab('users')}
        >
          <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>
            Users
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'spots' ? (
        <>
          {!showAddSpotForm ? (
            <View style={styles.addButtonContainer}>
              <Button
                title="Add New Parking Spot"
                onPress={() => setShowAddSpotForm(true)}
                style={styles.addButton}
                textStyle={styles.addButtonText}
                variant="outline"
              />
            </View>
          ) : (
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>
                {editingSpot ? 'Edit Parking Spot' : 'Add New Parking Spot'}
              </Text>
              
              <TextInput
                style={styles.input}
                value={spotName}
                onChangeText={setSpotName}
                placeholder="Spot Name"
                placeholderTextColor={colors.gray[400]}
              />
              
              <TextInput
                style={styles.input}
                value={spotAddress}
                onChangeText={setSpotAddress}
                placeholder="Address"
                placeholderTextColor={colors.gray[400]}
              />
              
              <TextInput
                style={styles.input}
                value={spotPrice}
                onChangeText={setSpotPrice}
                placeholder="Price per hour"
                placeholderTextColor={colors.gray[400]}
                keyboardType="numeric"
              />
              
              <View style={styles.formButtons}>
                <Button
                  title="Cancel"
                  onPress={() => {
                    setShowAddSpotForm(false);
                    resetForm();
                  }}
                  variant="outline"
                  style={styles.cancelButton}
                />
                
                <Button
                  title={editingSpot ? 'Update' : 'Add'}
                  onPress={editingSpot ? handleUpdateSpot : handleAddSpot}
                  style={styles.submitButton}
                />
              </View>
            </View>
          )}
          
          <FlatList
            data={parkingSpots}
            renderItem={renderParkingSpot}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
          />
        </>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...shadows.sm,
  },
  spotInfo: {
    flex: 1,
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
    marginBottom: spacing.sm,
    fontFamily: 'Inter-SemiBold',
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityLabel: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginRight: spacing.xs,
    fontFamily: 'Inter-Regular',
  },
  availabilityToggle: {
    width: 36,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  availableToggle: {
    backgroundColor: colors.accent,
    alignItems: 'flex-start',
  },
  unavailableToggle: {
    backgroundColor: colors.gray[300],
    alignItems: 'flex-end',
  },
  toggleCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  actionButtons: {
    justifyContent: 'center',
    gap: spacing.sm,
  },
  editButton: {
    padding: spacing.xs,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  addButtonContainer: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    marginLeft: spacing.xs,
  },
  formContainer: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    backgroundColor: colors.gray[50],
  },
  formTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    fontFamily: 'Inter-SemiBold',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    fontFamily: 'Inter-Regular',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    marginRight: spacing.sm,
  },
  submitButton: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  userCard: {
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
    ...shadows.sm,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    fontFamily: 'Inter-SemiBold',
  },
  userEmailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  userEmail: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
    fontFamily: 'Inter-Regular',
  },
  roleContainer: {
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    overflow: 'hidden',
    fontFamily: 'Inter-Medium',
  },
  adminRole: {
    backgroundColor: colors.primaryLight,
    color: colors.primary,
  },
  inspectorRole: {
    backgroundColor: colors.secondaryLight,
    color: colors.secondary,
  },
  userRole: {
    backgroundColor: colors.accentLight,
    color: colors.accent,
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