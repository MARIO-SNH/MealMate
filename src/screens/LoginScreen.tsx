import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { colors, shadow } from "../theme";
import { firebaseConfig } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen({ navigation }: any) {
  const { saveSession } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      if (!email || !password) {
        Alert.alert("Missing info", "Please enter email and password.");
        return;
      }

      setLoading(true);

      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            password,
            returnSecureToken: true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Login failed", data.error?.message || "Please try again.");
        return;
      }

      await saveSession(data);
    } catch (error: any) {
      Alert.alert("Login failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream, padding: 26, justifyContent: "center" }}>
      <Text style={{ fontSize: 38, fontWeight: "800", color: colors.oliveGreen }}>Welcome back</Text>

      <Text style={{ marginTop: 8, fontSize: 16, color: colors.muted }}>
        Sign in to find your next meal buddy.
      </Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="University Email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ backgroundColor: colors.white, borderRadius: 16, padding: 16, marginTop: 34, borderWidth: 1, borderColor: colors.dustyRose }}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={{ backgroundColor: colors.white, borderRadius: 16, padding: 16, marginTop: 14, borderWidth: 1, borderColor: colors.dustyRose }}
      />

      <TouchableOpacity
        onPress={login}
        disabled={loading}
        style={{ marginTop: 26, backgroundColor: colors.terracotta, paddingVertical: 16, borderRadius: 18, alignItems: "center", ...shadow }}
      >
        {loading ? <ActivityIndicator color="white" /> : <Text style={{ color: "white", fontWeight: "800", fontSize: 16 }}>Continue</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={{ textAlign: "center", marginTop: 22, color: colors.oliveGreen }}>
          New here? Create an account
        </Text>
      </TouchableOpacity>
    </View>
  );
}