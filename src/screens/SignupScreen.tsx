import { useState } from "react";
import { Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from "react-native";
import { doc, setDoc } from "firebase/firestore";
import { db, firebaseConfig } from "../services/firebase";
import { colors, shadow } from "../theme";
import { useAuth } from "../context/AuthContext";

export default function SignupScreen({ navigation }: any) {
  const { saveSession } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [major, setMajor] = useState("");
  const [year, setYear] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const createAccount = async () => {
    try {
      if (!name || !email || !password) {
        Alert.alert("Missing info", "Please enter name, email, and password.");
        return;
      }

      setLoading(true);

      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseConfig.apiKey}`,
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
        Alert.alert("Signup failed", data.error?.message || "Please try again.");
        return;
      }

      const newProfile = {
        uid: data.localId,
        name,
        email: email.trim(),
        major: major || "Computer Science",
        year: year || "2026",
        bio: "Ready to meet new people over meals.",
        profilePhoto: "",
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", data.localId), newProfile);

      await saveSession({
        ...data,
        email: email.trim(),
      });
    } catch (error: any) {
      Alert.alert("Signup failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.cream }} contentContainerStyle={{ padding: 26, paddingTop: 70 }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={{ color: colors.oliveGreen, fontSize: 16 }}>← Back</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 38, fontWeight: "800", color: colors.oliveGreen, marginTop: 30 }}>Create account</Text>

      <Text style={{ marginTop: 8, fontSize: 16, color: colors.muted }}>
        Join MealMate with your university email.
      </Text>

      <TextInput value={name} onChangeText={setName} placeholder="Full Name" style={{ backgroundColor: colors.white, borderRadius: 16, padding: 16, marginTop: 30, borderWidth: 1, borderColor: colors.dustyRose }} />
      <TextInput value={email} onChangeText={setEmail} placeholder="University Email" autoCapitalize="none" keyboardType="email-address" style={{ backgroundColor: colors.white, borderRadius: 16, padding: 16, marginTop: 14, borderWidth: 1, borderColor: colors.dustyRose }} />
      <TextInput value={major} onChangeText={setMajor} placeholder="Major" style={{ backgroundColor: colors.white, borderRadius: 16, padding: 16, marginTop: 14, borderWidth: 1, borderColor: colors.dustyRose }} />
      <TextInput value={year} onChangeText={setYear} placeholder="Year, ex: 2026" style={{ backgroundColor: colors.white, borderRadius: 16, padding: 16, marginTop: 14, borderWidth: 1, borderColor: colors.dustyRose }} />
      <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry style={{ backgroundColor: colors.white, borderRadius: 16, padding: 16, marginTop: 14, borderWidth: 1, borderColor: colors.dustyRose }} />

      <TouchableOpacity
        onPress={createAccount}
        disabled={loading}
        style={{ marginTop: 26, backgroundColor: colors.terracotta, paddingVertical: 16, borderRadius: 18, alignItems: "center", ...shadow }}
      >
        {loading ? <ActivityIndicator color="white" /> : <Text style={{ color: "white", fontWeight: "800", fontSize: 16 }}>Create Account</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}