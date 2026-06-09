import { Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../services/firebase";
import { colors, shadow } from "../theme";

const demoMeals = [
  {
    name: "Sarah",
    email: "sarah@uc.edu",
    location: "CenterCourt",
    mealType: "Lunch",
    time: "12:30 PM",
    attendees: 3,
    mood: "Open to New People",
    visibility: "Campus Public",
    attendeesList: ["Maya", "Aarav", "Riya"],
  },
  {
    name: "Alex",
    email: "alex@uc.edu",
    location: "MarketPointe",
    mealType: "Dinner",
    time: "6:00 PM",
    attendees: 2,
    mood: "Friends Only",
    visibility: "Friends",
    attendeesList: ["Kabir", "Sam"],
  },
  {
    name: "Maya",
    email: "maya@uc.edu",
    location: "Northside Café",
    mealType: "Study Meal",
    time: "1:00 PM",
    attendees: 2,
    mood: "Study",
    visibility: "Campus Public",
    attendeesList: ["Riya", "Sam"],
  },
];

export default function AdminSeedScreen({ navigation }: any) {
  const seedMeals = async () => {
    for (const meal of demoMeals) {
      await addDoc(collection(db, "meals"), {
        ...meal,
        createdAt: new Date().toISOString(),
      });
    }

    Alert.alert("Done", "Demo meals added to Firestore.");
    navigation.navigate("Home");
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.cream }} contentContainerStyle={{ padding: 24, paddingTop: 80 }}>
      <Text style={{ fontSize: 34, fontWeight: "800", color: colors.oliveGreen }}>
        Seed Demo Meals
      </Text>

      <Text style={{ marginTop: 10, color: colors.muted }}>
        This adds Sarah, Alex, and Maya meals into Firestore.
      </Text>

      <TouchableOpacity
        onPress={seedMeals}
        style={{ backgroundColor: colors.terracotta, padding: 18, borderRadius: 20, alignItems: "center", marginTop: 30, ...shadow }}
      >
        <Text style={{ color: "white", fontWeight: "800" }}>Add Demo Meals</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Home")} style={{ marginTop: 20 }}>
        <Text style={{ color: colors.oliveGreen }}>Back Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}