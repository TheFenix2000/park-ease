import Button from '@/components/Button';
import { colors, fontSizes, fontWeights, shadows, spacing } from '@/constants/theme';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Calendar, Clock, Info, MapPin } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Animated, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthContext();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>ParkEase</Text>
          {user ? (
            <Button 
              title="Book a Spot"
              onPress={() => router.push('/(tabs)/reservations')}
              size="small"
            />
          ) : (
            <Button 
              title="Sign In"
              onPress={() => router.push('/(auth)/login')}
              size="small"
            />
          )}
        </View>
        
        <Animated.View 
          style={[
            styles.heroContainer, 
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Image
            source={{ uri: 'https://images.pexels.com/photos/1756957/pexels-photo-1756957.jpeg' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Find and Reserve Parking Spots</Text>
            <Text style={styles.heroSubtitle}>Secure your parking space in advance, hassle-free</Text>
            {!user && (
              <Button
                title="Get Started"
                onPress={() => router.push('/(auth)/register')}
                style={styles.heroButton}
              />
            )}
          </View>
        </Animated.View>
        
        <Text style={styles.sectionTitle}>How It Works</Text>
        
        <View style={styles.stepsContainer}>
          <View style={styles.step}>
            <View style={styles.stepIconContainer}>
              <MapPin size={24} color={colors.primary} />
            </View>
            <Text style={styles.stepTitle}>Find a Spot</Text>
            <Text style={styles.stepDescription}>Browse available parking spots in your area</Text>
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepIconContainer}>
              <Calendar size={24} color={colors.primary} />
            </View>
            <Text style={styles.stepTitle}>Reserve</Text>
            <Text style={styles.stepDescription}>Select your date and time to reserve a spot</Text>
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepIconContainer}>
              <Clock size={24} color={colors.primary} />
            </View>
            <Text style={styles.stepTitle}>Park</Text>
            <Text style={styles.stepDescription}>Arrive at your reserved spot during your time slot</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.aboutSection}
          onPress={() => router.push('/(tabs)/about')}
        >
          <Info size={20} color={colors.primary} />
          <Text style={styles.aboutText}>Learn more about ParkEase</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContainer: {
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    fontFamily: 'Inter-Bold',
  },
  heroContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    borderRadius: 16,
    overflow: 'hidden',
    ...shadows.lg,
  },
  heroImage: {
    width: '100%',
    height: 200,
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  heroTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: 'white',
    marginBottom: spacing.xs,
    fontFamily: 'Inter-Bold',
  },
  heroSubtitle: {
    fontSize: fontSizes.md,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: spacing.md,
    fontFamily: 'Inter-Regular',
  },
  heroButton: {
    alignSelf: 'flex-start',
  },
  sectionTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    fontFamily: 'Inter-Bold',
  },
  stepsContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  step: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  stepIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  stepTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    fontFamily: 'Inter-SemiBold',
  },
  stepDescription: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    fontFamily: 'Inter-Regular',
  },
  aboutSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
  },
  aboutText: {
    fontSize: fontSizes.md,
    color: colors.primary,
    marginLeft: spacing.xs,
    fontFamily: 'Inter-Medium',
  },
});