import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  acceptRequest,
  completeRequest,
  getServiceRequest,
  startRequest,
} from '../services/api';
import {
  getRequestPhoto,
  getRequestStatusLabel,
  getRequestUrgency,
  REQUEST_STATUS,
} from '../types';

export default function ProviderRequestDetailsScreen({ token, requestId, onBack }) {
  const [currentRequest, setCurrentRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(true);
  const [error, setError] = useState('');
  const [journeyStarted, setJourneyStarted] = useState(false);

  useEffect(() => {
    let active = true;

    const loadDetails = async () => {
      setRefreshing(true);
      setError('');
      try {
        const latest = await getServiceRequest(token, requestId);
        if (active) setCurrentRequest(latest);
      } catch (requestError) {
        if (active) setError(requestError.message);
      } finally {
        if (active) setRefreshing(false);
      }
    };

    loadDetails();
    return () => {
      active = false;
    };
  }, [requestId, token]);

  const performAction = async (action) => {
    setLoading(true);
    setError('');
    try {
      const updated =
        action === 'accept'
          ? await acceptRequest(token, currentRequest.id)
          : action === 'start'
            ? await startRequest(token, currentRequest.id)
            : await completeRequest(token, currentRequest.id);
      setCurrentRequest(updated);
      setJourneyStarted(false);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  if (!currentRequest) {
    return (
      <View style={styles.screen}>
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            accessibilityRole="button"
          >
            <Text style={styles.backArrow}>‹</Text>
            <Text style={styles.backText}>All requests</Text>
          </TouchableOpacity>
          {refreshing ? (
            <View style={styles.refreshNotice}>
              <ActivityIndicator size="small" color="#087e72" />
              <Text style={styles.refreshText}>Loading request #{requestId}...</Text>
            </View>
          ) : (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>
                {error || `Request #${requestId} could not be found.`}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  const status = currentRequest.status;
  const displayStatus =
    status === REQUEST_STATUS.ACCEPTED && journeyStarted
      ? REQUEST_STATUS.ON_THE_WAY
      : status;
  const photo = getRequestPhoto(currentRequest);
  const primaryAction =
    status === REQUEST_STATUS.PENDING
      ? { label: 'Accept Request', action: 'accept' }
      : status === REQUEST_STATUS.ACCEPTED && journeyStarted
        ? { label: 'Start Work', action: 'start' }
        : status === REQUEST_STATUS.IN_PROGRESS
          ? { label: 'Mark Completed', action: 'complete' }
          : null;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
        accessibilityRole="button"
      >
        <Text style={styles.backArrow}>‹</Text>
        <Text style={styles.backText}>All requests</Text>
      </TouchableOpacity>

      <View style={styles.titleRow}>
        <View style={styles.titleCopy}>
          <Text style={styles.overline}>REQUEST #{currentRequest.id}</Text>
          <Text style={styles.title}>Request details</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {getRequestStatusLabel(displayStatus)}
          </Text>
        </View>
      </View>

      {refreshing ? (
        <View style={styles.refreshNotice}>
          <ActivityIndicator size="small" color="#087e72" />
          <Text style={styles.refreshText}>Updating request details...</Text>
        </View>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>CUSTOMER PROBLEM</Text>
        <Text style={styles.problem}>{currentRequest.title}</Text>
        <Text style={styles.description}>
          {currentRequest.description || 'No additional details were provided.'}
        </Text>
        {currentRequest.customer?.fullName ? (
          <View style={styles.customerRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {currentRequest.customer.fullName.slice(0, 1).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.customerLabel}>Customer</Text>
              <Text style={styles.customerName}>
                {currentRequest.customer.fullName}
              </Text>
            </View>
          </View>
        ) : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>SERVICE TYPE</Text>
        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Text style={styles.detailIconText}>⌂</Text>
          </View>
          <View>
            <Text style={styles.detailMain}>
              {currentRequest.category?.name || 'Service'}
            </Text>
            <Text style={styles.detailSub}>Requested service</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>LOCATION</Text>
        <View style={styles.detailRow}>
          <View style={styles.locationIcon}>
            <Text style={styles.locationIconText}>⌖</Text>
          </View>
          <View style={styles.locationCopy}>
            <Text style={styles.detailMain}>Service address</Text>
            <Text style={styles.detailSub}>
              {currentRequest.address || 'Location not provided'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>PHOTO</Text>
        {photo ? (
          <Image
            source={{ uri: photo }}
            style={styles.photo}
            resizeMode="cover"
            accessibilityLabel="Customer's request photo"
          />
        ) : (
          <View style={styles.noPhoto}>
            <Text style={styles.photoIcon}>▧</Text>
            <Text style={styles.noPhotoText}>No photo attached</Text>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>URGENCY</Text>
        <View style={styles.urgencyRow}>
          <View style={styles.urgencyDot} />
          <Text style={styles.urgencyText}>{getRequestUrgency(currentRequest)}</Text>
        </View>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {status === REQUEST_STATUS.ACCEPTED && !journeyStarted ? (
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setJourneyStarted(true)}
          disabled={loading}
          accessibilityRole="button"
        >
          <Text style={styles.secondaryButtonText}>Start Journey</Text>
        </TouchableOpacity>
      ) : null}

      {primaryAction ? (
        <TouchableOpacity
          style={[styles.primaryButton, loading && styles.disabledButton]}
          onPress={() => performAction(primaryAction.action)}
          disabled={loading}
          accessibilityRole="button"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>{primaryAction.label}</Text>
          )}
        </TouchableOpacity>
      ) : null}

      {status === REQUEST_STATUS.ACCEPTED && journeyStarted ? (
        <Text style={styles.journeyNotice}>
          Journey started. Mark the job in progress when you arrive.
        </Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 18, paddingBottom: 34 },
  backButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7 },
  backArrow: { color: '#087e72', fontSize: 27, marginRight: 5, marginTop: -2 },
  backText: { color: '#087e72', fontSize: 14, fontWeight: '700' },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 17,
  },
  titleCopy: { flex: 1 },
  overline: {
    color: '#087e72',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 5,
  },
  title: { color: '#172b28', fontSize: 24, fontWeight: '800' },
  statusBadge: {
    backgroundColor: '#e9f5f2',
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginLeft: 8,
  },
  statusText: { color: '#087e72', fontSize: 11, fontWeight: '700' },
  refreshNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 3,
  },
  refreshText: { color: '#71807d', fontSize: 12, marginLeft: 8 },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e8eeec',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  sectionLabel: {
    color: '#8a9692',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  problem: { color: '#182d29', fontSize: 18, fontWeight: '700', lineHeight: 25 },
  description: { color: '#71807d', fontSize: 13, lineHeight: 20, marginTop: 7 },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eff2f1',
    marginTop: 15,
    paddingTop: 13,
  },
  avatar: {
    width: 37,
    height: 37,
    borderRadius: 13,
    backgroundColor: '#e9f5f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: { color: '#087e72', fontSize: 15, fontWeight: '800' },
  customerLabel: { color: '#96a19e', fontSize: 11 },
  customerName: { color: '#263a37', fontSize: 13, fontWeight: '700', marginTop: 2 },
  detailRow: { flexDirection: 'row', alignItems: 'center' },
  detailIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: '#e9f5f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  detailIconText: { color: '#087e72', fontSize: 22 },
  locationIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: '#fff3e7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  locationIconText: { color: '#bb7132', fontSize: 22 },
  locationCopy: { flex: 1 },
  detailMain: { color: '#263a37', fontSize: 14, fontWeight: '700' },
  detailSub: { color: '#71807d', fontSize: 12, lineHeight: 18, marginTop: 3 },
  noPhoto: {
    height: 100,
    borderRadius: 12,
    backgroundColor: '#f5f8f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoIcon: { color: '#9eaaa6', fontSize: 26, marginBottom: 5 },
  noPhotoText: { color: '#87938f', fontSize: 12 },
  photo: { width: '100%', height: 190, borderRadius: 12, backgroundColor: '#f5f8f7' },
  urgencyRow: { flexDirection: 'row', alignItems: 'center' },
  urgencyDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#d5a343',
    marginRight: 9,
  },
  urgencyText: { color: '#50605c', fontSize: 13, fontWeight: '600' },
  errorBox: {
    backgroundColor: '#fff0ef',
    borderRadius: 11,
    padding: 12,
    marginBottom: 12,
  },
  errorText: { color: '#b42318', fontSize: 13, lineHeight: 19 },
  primaryButton: {
    minHeight: 53,
    borderRadius: 13,
    backgroundColor: '#087e72',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3,
  },
  disabledButton: { opacity: 0.7 },
  primaryButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  secondaryButton: {
    minHeight: 53,
    borderRadius: 13,
    backgroundColor: '#e9f5f2',
    borderWidth: 1,
    borderColor: '#cde5df',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3,
  },
  secondaryButtonText: { color: '#087e72', fontSize: 15, fontWeight: '700' },
  journeyNotice: {
    color: '#71807d',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
  },
});
