import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen() {
  const { signIn } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // useEffect demonstra um efeito executado quando a tela é montada.
  useEffect(() => {
    console.log('Tela de Login montada');
    return () => console.log('Tela de Login desmontada');
  }, []);

  function handleLogin() {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Campos obrigatórios', 'Informe seu nome e e-mail para continuar.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      Alert.alert('E-mail inválido', 'Digite um endereço de e-mail válido.');
      return;
    }
    // A autenticação é demonstrativa: não consulta servidor nem valida senha.
    signIn(name, email);
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.logo}>StateFlow</Text>
        <Text style={styles.title}>Bem-vindo!</Text>
        <Text style={styles.subtitle}>Entre para acessar seu painel de demonstração.</Text>
        <Text style={styles.label}>Nome</Text>
        <TextInput value={name} onChangeText={setName} placeholder="Seu nome" style={styles.input} autoCapitalize="words" />
        <Text style={styles.label}>E-mail</Text>
        <TextInput value={email} onChangeText={setEmail} placeholder="voce@exemplo.com" style={styles.input} keyboardType="email-address" autoCapitalize="none" />
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar no aplicativo</Text>
        </Pressable>
        <Text style={styles.note}>Projeto acadêmico: login ilustrativo, sem autenticação real.</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4F3FB', justifyContent: 'center', padding: 22 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, elevation: 3 },
  logo: { color: '#5B43D6', fontSize: 18, fontWeight: '800', marginBottom: 20 },
  title: { color: '#202033', fontSize: 29, fontWeight: '800' },
  subtitle: { color: '#6C6B7A', marginTop: 8, marginBottom: 24, lineHeight: 21 },
  label: { color: '#343348', fontWeight: '700', marginBottom: 7, marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#DAD8E8', borderRadius: 11, padding: 13, backgroundColor: '#FFFFFF' },
  button: { backgroundColor: '#5B43D6', borderRadius: 11, padding: 15, alignItems: 'center', marginTop: 24 },
  buttonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
  note: { color: '#777587', fontSize: 11, marginTop: 16, lineHeight: 16 }
});