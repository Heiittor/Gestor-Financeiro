import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { colors } from "../constants/colors";
import { api, setAuthToken } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha e-mail e senha.");
      return;
    }

    setLoading(true);
    try {
      let result;
      if (isRegister) {
        if (!name) {
          Alert.alert("Erro", "Preencha seu nome.");
          setLoading(false);
          return;
        }
        result = await api.register({ name, email, password });
      } else {
        result = await api.login({ email, password });
      }

      setAuthToken(result.token);
      global.loggedUser = result.user.name;
      router.replace("/(tabs)");
    } catch (e) {
      Alert.alert("Erro", e.message?.includes("401") ? "E-mail ou senha inválidos." : e.message ?? "Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.card}>
        <Text style={styles.title}>💰 Gestão Financeira</Text>
        <Text style={styles.subtitle}>
          {isRegister ? "Crie sua conta" : "Faça login para continuar"}
        </Text>

        {isRegister && (
          <>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Seu nome completo"
              value={name}
              onChangeText={setName}
            />
          </>
        )}

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="seu@email.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Mínimo 6 caracteres"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Aguarde..." : isRegister ? "Criar conta" : "Entrar"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsRegister(!isRegister)} style={styles.switchBtn}>
          <Text style={styles.switchText}>
            {isRegister ? "Já tem conta? Faça login" : "Não tem conta? Cadastre-se"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#fafafa",
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  switchBtn: {
    marginTop: 16,
    alignItems: "center",
  },
  switchText: {
    color: colors.primary,
    fontSize: 14,
  },
});