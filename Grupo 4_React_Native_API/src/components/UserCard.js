import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function UserCard({ user }) {
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.initial}>{user.name?.charAt(0)?.toUpperCase() || '?'}</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.company}>{user.company?.name || 'Empresa não informada'}</Text>
        <Text style={styles.city}>{user.address?.city || 'Cidade não informada'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 15, padding: 15, marginBottom: 11, borderWidth: 1, borderColor: '#E7E5F2' },
  avatar: { width: 45, height: 45, borderRadius: 23, backgroundColor: '#E8E4FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  initial: { fontSize: 19, fontWeight: '800', color: '#5942CC' },
  details: { flex: 1 },
  name: { fontSize: 16, fontWeight: '800', color: '#28263B' },
  email: { color: '#5F5D70', marginTop: 4 },
  company: { color: '#5B43D6', marginTop: 5, fontSize: 12, fontWeight: '700' },
  city: { color: '#858397', marginTop: 2, fontSize: 12 }
});
