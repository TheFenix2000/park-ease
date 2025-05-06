import { colors } from '@/constants/theme';
import { useAuthContext } from '@/contexts/AuthContext';
import { Tabs } from 'expo-router';
import { Calendar, ClipboardList, HomeIcon as Home, User } from 'lucide-react-native';
import { Platform } from 'react-native';

export default function TabLayout() {
  const { user, isAdmin, isInspector } = useAuthContext();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray[500],
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingTop: Platform.OS === 'ios' ? 8 : 0,
          backgroundColor: colors.background.primary,
          borderTopColor: colors.gray[200],
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />

      {user && (
        <Tabs.Screen
          name="reservations"
          options={{
            title: 'My Spots',
            tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
          }}
        />
      )}

      {isAdmin === true && (
        <Tabs.Screen
          name="admin"
          options={{
            title: 'Admin',
            tabBarIcon: ({ color, size }) => <ClipboardList size={size} color={color} />,
          }}
        />
      )}

      {isInspector && (
        <Tabs.Screen
          name="inspector"
          options={{
            title: 'Inspector',
            tabBarIcon: ({ color, size }) => <ClipboardList size={size} color={color} />,
          }}
        />
      )}

      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}