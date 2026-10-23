import React, { useContext } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, signOut } = useContext(AuthContext);

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase() || '?'}</Text></View>
        <Text style={styles.title}>Meu perfil</Text>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.info}>Esta tela também consome o AuthContext. Ao sair, o estado global é limpo e o app volta ao Login.</Text>
        <Pressable style={styles.button} onPress={signOut}>
          <Text style={styles.buttonText}>Sair da conta</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4F3FB', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, alignItems: 'center', elevation: 3 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#E7E2FF', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  avatarText: { color: '#5B43D6', fontSize: 28, fontWeight: '800' },
  title: { color: '#25243A', fontSize: 25, fontWeight: '800' },
  name: { color: '#39364F', fontSize: 18, fontWeight: '700', marginTop: 14 },
  email: { color: '#777587', marginTop: 5 },
  info: { color: '#666579', textAlign: 'center', lineHeight: 22, marginTop: 20 },
  button: { backgroundColor: '#B42332', padding: 14, borderRadius: 11, alignItems: 'center', width: '100%', marginTop: 22 },
  buttonText: { color: '#FFFFFF', fontWeight: '800' }
});