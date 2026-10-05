import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getAvailableRequests } from '../services/api';
import { getRequestStatusLabel, getRequestUrgency } from '../types';

function RequestCard({ request, onPress }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeading}>
        <View style={styles.categoryIcon}>
          <Text style={styles.categoryIconText}>
            {(request.category?.name || 'S').slice(0, 1).toUpperCase()}
          </Text>
        </View>
        <View style={styles.cardHeadingText}>
          <Text style={styles.category}>{request.category?.name || 'Service'}</Text>
          <Text style={styles.time}>
            {request.createdAt
              ? new Date(request.createdAt).toLocaleDateString()
              : 'New request'}
          </Text>
        </View>
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>
            {getRequestStatusLabel(request.status)}
          </Text>
        </View>
      </View>

      <Text style={styles.problem} numberOfLines={2}>
        {request.title}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {request.description}
      </Text>

      <View style={styles.metaRow}>
        <Text style={styles.locationIcon}>⌖</Text>
        <Text style={styles.location} numberOfLines={1}>
          {request.address || 'Location not provided'}
        </Text>
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.urgencyBadge}>
          <View style={styles.urgencyDot} />
          <Text style={styles.urgencyText}>{getRequestUrgency(request)}</Text>
        </View>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => onPress(request)}
          accessibilityRole="button"
          accessibilityLabel={`View request: ${request.title}`}
        >
          <Text style={styles.viewButtonText}>View Request</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ProviderDashboardScreen({ token, onSelectRequest }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadRequests = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');
    try {
      setRequests(await getAvailableRequests(token));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  return (
    <View style={styles.screen}>
      <View style={styles.intro}>
        <Text style={styles.overline}>YOUR WORKSPACE</Text>
        <Text style={styles.title}>New Requests</Text>
        <Text style={styles.subtitle}>
          Find your next job from customers in your service area.
        </Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#087e72" />
          <Text style={styles.helper}>Finding available requests...</Text>
        </View>
      ) : error ? (
        <View style={styles.messageCard}>
          <Text style={styles.messageTitle}>Requests couldn't be loaded</Text>
          <Text style={styles.messageText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => loadRequests()}
            accessibilityRole="button"
          >
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <RequestCard request={item} onPress={onSelectRequest} />
          )}
          contentContainerStyle={[
            styles.list,
            requests.length === 0 && styles.emptyList,
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadRequests(true)}
              tintColor="#087e72"
              colors={['#087e72']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyCard}>
              <View style={styles.emptyIcon}>
                <Text style={styles.emptyIconText}>✓</Text>
              </View>
              <Text style={styles.emptyTitle}>You're all caught up</Text>
              <Text style={styles.emptyText}>
                New requests for your services will show up here.
              </Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => loadRequests(true)}
                accessibilityRole="button"
              >
                <Text style={styles.retryText}>Refresh requests</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  intro: { paddingHorizontal: 22, paddingTop: 6, paddingBottom: 20 },
  overline: {
    color: '#087e72',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.6,
    marginBottom: 6,
  },
  title: { color: '#172b28', fontSize: 28, fontWeight: '800' },
  subtitle: { color: '#71807d', fontSize: 14, marginTop: 7, lineHeight: 21 },
  list: { paddingHorizontal: 18, paddingBottom: 28 },
  emptyList: { flexGrow: 1, justifyContent: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 17,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: '#e8eeec',
    shadowColor: '#173a34',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeading: { flexDirection: 'row', alignItems: 'center' },
  categoryIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: '#e9f5f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconText: { color: '#087e72', fontSize: 17, fontWeight: '800' },
  cardHeadingText: { flex: 1, marginLeft: 11 },
  category: { color: '#263a37', fontSize: 14, fontWeight: '700' },
  time: { color: '#96a19e', fontSize: 11, marginTop: 3 },
  newBadge: {
    backgroundColor: '#e9f5f2',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  newBadgeText: { color: '#087e72', fontSize: 10, fontWeight: '700' },
  problem: {
    color: '#182d29',
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '700',
    marginTop: 17,
  },
  description: {
    color: '#71807d',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  locationIcon: { color: '#087e72', fontSize: 18, marginRight: 6 },
  location: { color: '#50605c', fontSize: 12, flex: 1 },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: '#eff2f1',
  },
  urgencyBadge: { flexDirection: 'row', alignItems: 'center' },
  urgencyDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#d5a343',
    marginRight: 7,
  },
  urgencyText: { color: '#697672', fontSize: 12, fontWeight: '600' },
  viewButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  viewButtonText: { color: '#087e72', fontSize: 13, fontWeight: '700' },
  arrow: { color: '#087e72', fontSize: 22, marginLeft: 4, marginTop: -2 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  helper: { color: '#71807d', fontSize: 13, marginTop: 12 },
  messageCard: {
    backgroundColor: '#fff',
    marginHorizontal: 18,
    borderRadius: 16,
    padding: 20,
  },
  messageTitle: { color: '#263a37', fontSize: 17, fontWeight: '700' },
  messageText: { color: '#71807d', fontSize: 13, lineHeight: 20, marginTop: 8 },
  retryButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#e9f5f2',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 16,
  },
  retryText: { color: '#087e72', fontSize: 13, fontWeight: '700' },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 24,
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#e9f5f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  emptyIconText: { color: '#087e72', fontSize: 25, fontWeight: '700' },
  emptyTitle: { color: '#263a37', fontSize: 17, fontWeight: '700' },
  emptyText: {
    color: '#71807d',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 7,
  },
});
