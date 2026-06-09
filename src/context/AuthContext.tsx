import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: any) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentProfile, setCurrentProfile] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const loadProfile = async (uid: string) => {
    const profileSnap = await getDoc(doc(db, "users", uid));

    if (profileSnap.exists()) {
      const profile = { id: profileSnap.id, ...profileSnap.data() };
      setCurrentProfile(profile);
      return profile;
    }

    return null;
  };

  const saveSession = async (authData: any) => {
    const user = {
      uid: authData.localId,
      email: authData.email,
      idToken: authData.idToken,
    };

    setCurrentUser(user);
    await AsyncStorage.setItem("mealMateUser", JSON.stringify(user));
    await loadProfile(authData.localId);
  };

  const restoreSession = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("mealMateUser");

      if (storedUser) {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        await loadProfile(user.uid);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("mealMateUser");
    setCurrentUser(null);
    setCurrentProfile(null);
  };

  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentProfile,
        setCurrentProfile,
        saveSession,
        loadProfile,
        logout,
        authLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}