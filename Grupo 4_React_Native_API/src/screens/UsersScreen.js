import React from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import UserCard from '../components/UserCard';
import { useUsers } from '../hooks/useUsers';

export default function UsersScreen() {
  const { users, loading, refreshing, error, source, reload } = useUsers();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.kicker}>GRUPO 3 E 4 • INTEGRAÇÃO MOBILE</Text>
        <Text style={styles.title}>Usuários da API</Text>
        <Text style={styles.subtitle}>Fetch + AsyncStorage + hook customizado</Text>
        <View style={styles.pills}>
          <Text style={styles.pill}>Fonte: {source === 'api' ? 'API' : source === 'cache' ? 'cache local' : 'aguardando'}</Text>
          <Text style={styles.pill}>{users.length} usuários</Text>
        </View>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={() => reload()} style={styles.retryButton}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : null}

      {loading && users.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#5B43D6" />
          <Text style={styles.loadingText}>Carregando usuários da API...</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <UserCard user={item} />}
          contentContainerStyle={styles.list}
          onRefresh={() => reload({ showFullLoading: false })}
          refreshing={refreshing}
          ListEmptyComponent={
            !loading ? <Text style={styles.empty}>Nenhum usuário disponível. Verifique a conexão e tente novamente.</Text> : null
          }
          ListHeaderComponent={
            source === 'cache' ? <Text style={styles.cacheNotice}>Dados salvos anteriormente no dispositivo.</Text> : null
          }
        />
      )}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Demonstração acadêmica • Dados fornecidos por JSONPlaceholder</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F4FB' },
  header: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 18, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E7E5F2' },
  kicker: { fontSize: 10, color: '#5B43D6', fontWeight: '800', letterSpacing: 1.1 },
  title: { fontSize: 29, fontWeight: '900', color: '#25243A', marginTop: 9 },
  subtitle: { color: '#777587', marginTop: 5 },
  pills: { flexDirection: 'row', gap: 8, marginTop: 13 },
  pill: { color: '#5140B4', backgroundColor: '#EDEAFF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, fontSize: 11, fontWeight: '700' },
  list: { padding: 16, paddingBottom: 25 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { color: '#666579', marginTop: 12 },
  errorBox: { margin: 15, padding: 13, backgroundColor: '#FCE8E9', borderRadius: 12 },
  errorText: { color: '#9E1C2A', lineHeight: 20 },
  retryButton: { marginTop: 10, backgroundColor: '#9E1C2A', padding: 10, borderRadius: 8, alignSelf: 'flex-start' },
  retryText: { color: '#FFFFFF', fontWeight: '800' },
  empty: { textAlign: 'center', color: '#777587', padding: 24, lineHeight: 22 },
  cacheNotice: { color: '#6C5BC7', backgroundColor: '#EDEAFF', padding: 10, borderRadius: 9, marginBottom: 12 },
  footer: { padding: 10, alignItems: 'center', backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E7E5F2' },
  footerText: { fontSize: 10, color: '#858397' }
});
