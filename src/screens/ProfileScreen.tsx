import { useEffect, useState } from "react";
import {
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { colors, shadow } from "../theme";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen({ navigation }: any) {
  const { currentUser, currentProfile, setCurrentProfile, logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(currentProfile?.name || "");
  const [email, setEmail] = useState(currentProfile?.email || "");
  const [major, setMajor] = useState(currentProfile?.major || "");
  const [year, setYear] = useState(currentProfile?.year || "");
  const [bio, setBio] = useState(currentProfile?.bio || "");
  const [profilePhoto, setProfilePhoto] = useState(currentProfile?.profilePhoto || "");

  const [createdMeals, setCreatedMeals] = useState<any[]>([]);
  const [joinedMeals, setJoinedMeals] = useState<any[]>([]);

  const loadMealHistory = async () => {
    if (!currentUser?.uid) return;

    const snapshot = await getDocs(collection(db, "meals"));
    const meals = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as any[];

    setCreatedMeals(meals.filter((meal) => meal.creatorUid === currentUser.uid));
    setJoinedMeals(meals.filter((meal) => (meal.attendeesUids || []).includes(currentUser.uid)));
  };

  useEffect(() => {
    if (currentProfile) {
      setName(currentProfile.name || "");
      setEmail(currentProfile.email || "");
      setMajor(currentProfile.major || "");
      setYear(currentProfile.year || "");
      setBio(currentProfile.bio || "");
      setProfilePhoto(currentProfile.profilePhoto || "");
      loadMealHistory();
    }
  }, [currentProfile]);

  const pickProfilePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission needed", "Please allow photo access to choose a profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.4,
      base64: true,
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    if (!asset.base64) {
      Alert.alert("Error", "Could not read image.");
      return;
    }

    const base64Image = `data:image/jpeg;base64,${asset.base64}`;
    setProfilePhoto(base64Image);
  };

  const saveProfile = async () => {
    if (!currentUser?.uid) {
      Alert.alert("Error", "Logged-in user not found.");
      return;
    }

    setSaving(true);

    try {
      const updatedProfile = {
        ...currentProfile,
        name,
        major,
        year,
        bio,
        profilePhoto,
      };

      await updateDoc(doc(db, "users", currentUser.uid), {
        name,
        major,
        year,
        bio,
        profilePhoto,
      });

      setCurrentProfile(updatedProfile);
      setIsEditing(false);
      Alert.alert("Saved", "Your profile was updated.");
      loadMealHistory();
    } catch (error: any) {
      Alert.alert("Save failed", error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const MealHistoryCard = ({ meal }: any) => (
    <View style={{ backgroundColor: colors.white, borderRadius: 20, padding: 16, marginBottom: 12, ...shadow }}>
      <Text style={{ fontSize: 18, fontWeight: "800", color: colors.text }}>
        {meal.location}
      </Text>
      <Text style={{ color: colors.muted, marginTop: 4 }}>
        {meal.mealType || "Meal"} • {meal.time}
      </Text>
      <Text style={{ color: colors.terracotta, marginTop: 6, fontWeight: "800" }}>
        👥 {meal.attendees || 0} joining
      </Text>
    </View>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.cream }}
      contentContainerStyle={{ padding: 24, paddingTop: 60, paddingBottom: 120 }}
    >
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Text style={{ color: colors.oliveGreen, fontSize: 16 }}>← Home</Text>
      </TouchableOpacity>

      <View style={{ backgroundColor: colors.white, borderRadius: 30, padding: 24, alignItems: "center", marginTop: 22, ...shadow }}>
        {profilePhoto ? (
          <Image
            source={{ uri: profilePhoto }}
            style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 12 }}
          />
        ) : (
          <Text style={{ fontSize: 82 }}>👤</Text>
        )}

        {isEditing && (
          <TouchableOpacity
            onPress={pickProfilePhoto}
            style={{
              backgroundColor: colors.cream,
              paddingHorizontal: 18,
              paddingVertical: 10,
              borderRadius: 16,
              marginBottom: 12,
            }}
          >
            <Text style={{ color: colors.text, fontWeight: "800" }}>
              Choose Profile Photo
            </Text>
          </TouchableOpacity>
        )}

        {isEditing ? (
          <>
            <TextInput value={name} onChangeText={setName} placeholder="Name" style={{ backgroundColor: colors.cream, borderRadius: 16, padding: 14, marginTop: 12, width: "100%" }} />
            <TextInput value={major} onChangeText={setMajor} placeholder="Major" style={{ backgroundColor: colors.cream, borderRadius: 16, padding: 14, marginTop: 12, width: "100%" }} />
            <TextInput value={year} onChangeText={setYear} placeholder="Year" style={{ backgroundColor: colors.cream, borderRadius: 16, padding: 14, marginTop: 12, width: "100%" }} />
            <TextInput value={bio} onChangeText={setBio} placeholder="Bio" multiline style={{ backgroundColor: colors.cream, borderRadius: 16, padding: 14, marginTop: 12, width: "100%", minHeight: 90 }} />
          </>
        ) : (
          <>
            <Text style={{ fontSize: 28, fontWeight: "800", color: colors.oliveGreen, textAlign: "center" }}>
              {name || "Loading..."}
            </Text>
            <Text style={{ marginTop: 6, color: colors.muted, textAlign: "center" }}>
              {major || "Student"} • Class of {year || "2026"}
            </Text>
            <Text style={{ marginTop: 8, color: colors.muted, textAlign: "center" }}>
              {email}
            </Text>
            <Text style={{ marginTop: 14, textAlign: "center", color: colors.text, lineHeight: 22 }}>
              {bio || "Ready to meet new people over meals."}
            </Text>
          </>
        )}

        <TouchableOpacity
          onPress={isEditing ? saveProfile : () => setIsEditing(true)}
          disabled={saving}
          style={{ backgroundColor: colors.terracotta, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 18, marginTop: 20 }}
        >
          {saving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ color: "white", fontWeight: "700" }}>
              {isEditing ? "Save Profile" : "Edit Profile"}
            </Text>
          )}
        </TouchableOpacity>

        {isEditing && (
          <TouchableOpacity
            onPress={() => {
              setIsEditing(false);
              setName(currentProfile?.name || "");
              setMajor(currentProfile?.major || "");
              setYear(currentProfile?.year || "");
              setBio(currentProfile?.bio || "");
              setProfilePhoto(currentProfile?.profilePhoto || "");
            }}
            style={{ marginTop: 14 }}
          >
            <Text style={{ color: colors.muted }}>Cancel</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={handleLogout} style={{ marginTop: 18 }}>
          <Text style={{ color: colors.muted, fontWeight: "700" }}>Log out</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: "row", marginTop: 22, justifyContent: "space-between" }}>
        {[
          { number: String(createdMeals.length), label: "Created" },
          { number: String(joinedMeals.length), label: "Joined" },
          { number: "5", label: "Reviews" },
        ].map((stat) => (
          <View key={stat.label} style={{ backgroundColor: colors.white, borderRadius: 22, padding: 18, width: "31%", alignItems: "center", ...shadow }}>
            <Text style={{ fontSize: 24, fontWeight: "800", color: colors.oliveGreen }}>
              {stat.number}
            </Text>
            <Text style={{ color: colors.muted }}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <Text style={{ fontSize: 22, fontWeight: "800", color: colors.text, marginTop: 28, marginBottom: 12 }}>
        Your Created Meals
      </Text>

      {createdMeals.length === 0 ? (
        <Text style={{ color: colors.muted, marginBottom: 16 }}>No meals created yet.</Text>
      ) : (
        createdMeals.map((meal) => <MealHistoryCard key={meal.id} meal={meal} />)
      )}

      <Text style={{ fontSize: 22, fontWeight: "800", color: colors.text, marginTop: 20, marginBottom: 12 }}>
        Meals You Joined
      </Text>

      {joinedMeals.length === 0 ? (
        <Text style={{ color: colors.muted }}>No joined meals yet.</Text>
      ) : (
        joinedMeals.map((meal) => <MealHistoryCard key={meal.id} meal={meal} />)
      )}
    </ScrollView>
  );
}