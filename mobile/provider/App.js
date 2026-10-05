import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as TokenStorage from './src/services/tokenStorage';
import ProviderDashboardScreen from './src/screens/ProviderDashboardScreen';
import ProviderRequestDetailsScreen from './src/screens/ProviderRequestDetailsScreen';
import LoginScreen from './src/screens/LoginScreen';
import { getCurrentUser } from './src/services/api';

const TOKEN_KEY = 'provider_auth_token';

const Stack = createNativeStackNavigator();

// URL for each screen. On web these are browser paths
// (e.g. http://localhost:8081/requests/5); on a device they are deep links
// (e.g. handyprovider://requests/5).
const linking = {
  prefixes: ['handyprovider://'],
  config: {
    initialRouteName: 'Dashboard',
    screens: {
      Login: 'login',
      Dashboard: '',
      RequestDetails: 'requests/:id',
    },
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ProviderApp />
    </SafeAreaProvider>
  );
}

function ProviderApp() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState('');

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedToken = await TokenStorage.getToken(TOKEN_KEY);
        if (savedToken) {
          const currentUser = await getCurrentUser(savedToken);
          if (currentUser.role !== 'provider') {
            await TokenStorage.deleteToken(TOKEN_KEY);
            setSessionError('This app is only available to provider accounts.');
          } else {
            setToken(savedToken);
            setUser(currentUser);
          }
        }
      } catch (error) {
        await TokenStorage.deleteToken(TOKEN_KEY);
        setSessionError(error.message);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const handleLogin = async (loginToken, loginUser) => {
    await TokenStorage.setToken(TOKEN_KEY, loginToken);
    setToken(loginToken);
    setUser(loginUser);
    setSessionError('');
  };

  const handleLogout = async () => {
    await TokenStorage.deleteToken(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" color="#087e72" />
      </SafeAreaView>
    );
  }

  // Shared header shown above every signed-in screen
  const withTopBar = (screen) => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f4f7f6" />
      <View style={styles.topBar}>
        <View>
          <Text style={styles.brand}>HANDY</Text>
          <Text style={styles.greeting}>
            {user ? `Hello, ${user.fullName.split(' ')[0]}` : 'Provider workspace'}
          </Text>
        </View>
        <TouchableOpacity onPress={handleLogout} accessibilityRole="button">
          <Text style={styles.signOut}>Sign out</Text>
        </TouchableOpacity>
      </View>
      {screen}
    </SafeAreaView>
  );

  return (
    <NavigationContainer
      linking={linking}
      documentTitle={{ formatter: (options) => `${options?.title || 'Provider'} · Handy` }}
    >
      <Stack.Navigator
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#f4f7f6' } }}
      >
        {token ? (
          <>
            <Stack.Screen name="Dashboard" options={{ title: 'New Requests' }}>
              {({ navigation }) =>
                withTopBar(
                  <ProviderDashboardScreen
                    token={token}
                    onSelectRequest={(request) =>
                      navigation.navigate('RequestDetails', { id: String(request.id) })
                    }
                  />
                )
              }
            </Stack.Screen>
            <Stack.Screen name="RequestDetails" options={{ title: 'Request details' }}>
              {({ navigation, route }) =>
                withTopBar(
                  <ProviderRequestDetailsScreen
                    token={token}
                    requestId={route.params?.id}
                    onBack={() =>
                      navigation.canGoBack()
                        ? navigation.goBack()
                        : navigation.navigate('Dashboard')
                    }
                  />
                )
              }
            </Stack.Screen>
          </>
        ) : (
          <Stack.Screen name="Login" options={{ title: 'Sign in' }}>
            {() => (
              <SafeAreaView style={styles.container}>
                <LoginScreen onLogin={handleLogin} initialError={sessionError} />
              </SafeAreaView>
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f6',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f7f6',
  },
  topBar: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    color: '#087e72',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
  },
  greeting: {
    color: '#172b28',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 3,
  },
  signOut: {
    color: '#52615e',
    fontSize: 14,
    fontWeight: '600',
    padding: 8,
  },
});
