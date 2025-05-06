import Button from '@/components/Button';
import Input from '@/components/Input';
import { colors, fontSizes, fontWeights, spacing } from '@/constants/theme';
import { useAuthContext } from '@/contexts/AuthContext';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Login() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuthContext();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    
    try {
      await loginWithGoogle();
      router.replace('/(tabs)');
    } catch (err: any) {
      if (err.code === 'auth/popup-blocked') {
        setError('Please allow popups for Google sign-in or wait for redirect.');
      } else {
        setError(err.message || 'Failed to login with Google. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/1756957/pexels-photo-1756957.jpeg?auto=compress&cs=tinysrgb&h=350' }} 
            style={styles.logo} 
          />
          <Text style={styles.title}>ParkEase</Text>
          <Text style={styles.subtitle}>Reserve your parking space effortlessly</Text>
        </View>
        
        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <Button
            title="Login"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />
          
          <View style={styles.orContainer}>
            <View style={styles.divider} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.divider} />
          </View>
          
          <Button
            title="Continue with Google"
            onPress={handleGoogleLogin}
            variant="outline"
            style={styles.googleButton}
            textStyle={styles.googleButtonText}
          />
          
          <Button
            title="Continue as Guest"
            variant="outline"
            onPress={() => router.push('/(tabs)')}
            style={styles.guestButton}
            textStyle={styles.guestButtonText}
          />
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text style={styles.registerLink}>Register</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSizes.xxxl,
    fontWeight: fontWeights.bold,
    fontFamily: 'Inter-Bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  form: {
    marginBottom: spacing.xl,
  },
  errorText: {
    color: colors.error,
    fontSize: fontSizes.sm,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: spacing.md,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray[300],
  },
  orText: {
    marginHorizontal: spacing.md,
    color: colors.text.tertiary,
    fontSize: fontSizes.sm,
    fontFamily: 'Inter-Medium',
  },
  googleButton: {
    backgroundColor: 'white',
    borderColor: colors.gray[300],
    marginBottom: spacing.md,
  },
  googleButtonText: {
    color: colors.text.primary,
  },
  guestButton: {
    backgroundColor: 'transparent',
  },
  guestButtonText: {
    color: colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: colors.text.secondary,
    fontSize: fontSizes.sm,
    fontFamily: 'Inter-Regular',
  },
  registerLink: {
    color: colors.primary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semiBold,
    marginLeft: spacing.xs,
    fontFamily: 'Inter-SemiBold',
  },
});