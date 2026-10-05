import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { login } from '../services/api';

export default function LoginScreen({ onLogin, initialError = '' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(initialError);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password) {
      setError('Enter your email address and password.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const result = await login(email.trim(), password);
      if (result.user?.role !== 'provider') {
        setError('This app is only available to provider accounts.');
        return;
      }
      await onLogin(result.token, result.user);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <View style={styles.logoMark}>
          <Text style={styles.logoIcon}>H</Text>
        </View>
        <Text style={styles.eyebrow}>PROVIDER APP</Text>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          Sign in to find and manage service requests near you.
        </Text>

        <Text style={styles.label}>Email address</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor="#98a5a2"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="emailAddress"
          accessibilityLabel="Email address"
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          placeholderTextColor="#98a5a2"
          secureTextEntry
          textContentType="password"
          accessibilityLabel="Password"
          onSubmitEditing={handleSubmit}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
          accessibilityRole="button"
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign in</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.footer}>Your provider account is managed by Handy.</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f4f7f6',
    paddingHorizontal: 24,
  },
  content: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
  logoMark: {
    width: 54,
    height: 54,
    borderRadius: 17,
    backgroundColor: '#087e72',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  logoIcon: { color: '#fff', fontSize: 29, fontWeight: '800' },
  eyebrow: {
    color: '#087e72',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1.8,
    marginBottom: 9,
  },
  title: { color: '#172b28', fontSize: 32, fontWeight: '800' },
  subtitle: {
    color: '#71807d',
    fontSize: 15,
    lineHeight: 23,
    marginTop: 9,
    marginBottom: 30,
  },
  label: {
    color: '#263a37',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#dce5e2',
    borderRadius: 12,
    paddingHorizontal: 15,
    color: '#172b28',
    backgroundColor: '#fff',
    fontSize: 15,
    marginBottom: 19,
  },
  error: {
    color: '#b42318',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },
  button: {
    height: 54,
    borderRadius: 13,
    backgroundColor: '#087e72',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  footer: {
    color: '#87938f',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 22,
  },
});
