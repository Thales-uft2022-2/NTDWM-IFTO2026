import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function DashboardScreen() {
  const { user } = useContext(AuthContext);
  const [visits, setVisits] = useState(0);

  useEffect(() => {
    // Exemplo de efeito dependente de um estado.
    console.log(`O contador de visitas mudou para ${visits}`);
  }, [visits]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>PAINEL PRINCIPAL</Text>
      <Text style={styles.title}>Olá, {user?.name || 'usuário'}!</Text>
      <Text style={styles.subtitle}>Este nome veio do AuthContext compartilhado.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Estado compartilhado</Text>
        <Text style={styles.body}>Usuário: {user?.name}</Text>
        <Text style={styles.body}>E-mail: {user?.email}</Text>
        <Text style={styles.body}>O Dashboard lê o mesmo estado criado no AuthProvider.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Exemplo de useState</Text>
        <Text style={styles.counter}>{visits}</Text>
        <Text style={styles.body}>Toques registrados nesta tela.</Text>
        <Pressable style={styles.button} onPress={() => setVisits(value => value + 1)}>
          <Text style={styles.buttonText}>Adicionar visita</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4F3FB' },
  content: { padding: 20, gap: 16 },
  eyebrow: { color: '#5B43D6', fontWeight: '800', letterSpacing: 1.5, marginTop: 10 },
  title: { color: '#202033', fontSize: 29, fontWeight: '800' },
  subtitle: { color: '#6C6B7A', lineHeight: 21 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 17, padding: 19, elevation: 2 },
  cardTitle: { color: '#25243A', fontSize: 17, fontWeight: '800', marginBottom: 12 },
  body: { color: '#666579', lineHeight: 23, marginBottom: 4 },
  counter: { fontSize: 36, color: '#5B43D6', fontWeight: '800' },
  button: { backgroundColor: '#5B43D6', padding: 13, borderRadius: 10, alignItems: 'center', marginTop: 12 },
  buttonText: { color: '#FFFFFF', fontWeight: '800' }
});