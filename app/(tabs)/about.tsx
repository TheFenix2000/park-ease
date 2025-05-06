import { colors, fontSizes, fontWeights, shadows, spacing } from '@/constants/theme';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Github, LogOut } from 'lucide-react-native';
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Author data
const AUTHORS = [
  {
    id: '1',
    name: 'Kamil Kufel',
    role: 'Project Manager',
    image: 'https://bit.ly/3EUDWEu',
    github: 'https://github.com/Kkmil',
  },
  {
    id: '2',
    name: 'Michał Woś',
    role: 'Lead Developer',
    image: 'https://bit.ly/4d7EeED',
    github: 'https://github.com/TheFenix2000',
  },
  {
    id: '3',
    name: 'Tomasz Nykiel',
    role: 'UI/UX Designer',
    image: 'https://bit.ly/42YOPgr',
    github: 'https://github.com/Tomkers77',
  },
];

export default function AboutScreen() {
  const router = useRouter();
  const { user, logout } = useAuthContext();

  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>About ParkEase</Text>
        {user && (
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <LogOut size={20} color={colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.aboutSection}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&h=350' }} 
            style={styles.aboutImage} 
          />
          <Text style={styles.aboutTitle}>Our Mission</Text>
          <Text style={styles.aboutText}>
            ParkEase aims to revolutionize the parking experience by providing a seamless platform 
            for drivers to find and reserve parking spots in advance. We believe that parking 
            should be stress-free and efficient.
          </Text>
        </View>
        
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureTitle}>Easy Reservations</Text>
              <Text style={styles.featureText}>
                Book parking spots in advance with just a few taps
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureTitle}>Real-time Availability</Text>
              <Text style={styles.featureText}>
                See which spots are available in real-time
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureTitle}>Secure Payments</Text>
              <Text style={styles.featureText}>
                Pay for your parking securely through the app
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureTitle}>Verified Parking</Text>
              <Text style={styles.featureText}>
                All parking spots are verified by our inspectors
              </Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Our Team</Text>
        
        {AUTHORS.map((author) => (
          <View key={author.id} style={styles.authorCard}>
            <Image source={{ uri: author.image }} style={styles.authorImage} />
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{author.name}</Text>
              <Text style={styles.authorRole}>{author.role}</Text>
              <View style={styles.socialLinks}>
                <TouchableOpacity 
                  style={styles.socialButton}
                  onPress={() => handleOpenLink(author.github)}
                >
                  <Github size={20} color={colors.text.secondary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>ParkEase v1.0.0</Text>
          <Text style={styles.copyrightText}>© 2025 ParkEase. All rights reserved.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
  },
  logoutText: {
    marginLeft: spacing.xs,
    color: colors.error,
    fontSize: fontSizes.md,
    fontFamily: 'Inter-Medium',
  },
  scrollContainer: {
    padding: spacing.lg,
  },
  aboutSection: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  aboutImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  aboutTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    fontFamily: 'Inter-Bold',
  },
  aboutText: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  featuresSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    fontFamily: 'Inter-Bold',
  },
  featuresList: {
    gap: spacing.md,
  },
  featureItem: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: spacing.md,
    ...shadows.sm,
  },
  featureTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    fontFamily: 'Inter-SemiBold',
  },
  featureText: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    fontFamily: 'Inter-Regular',
  },
  authorCard: {
    flexDirection: 'row',
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
    ...shadows.sm,
  },
  authorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: spacing.md,
  },
  authorInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  authorName: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    fontFamily: 'Inter-SemiBold',
  },
  authorRole: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    fontFamily: 'Inter-Regular',
  },
  socialLinks: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  socialButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  versionContainer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  versionText: {
    fontSize: fontSizes.sm,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
    fontFamily: 'Inter-Regular',
  },
  copyrightText: {
    fontSize: fontSizes.sm,
    color: colors.text.tertiary,
    fontFamily: 'Inter-Regular',
  },
});