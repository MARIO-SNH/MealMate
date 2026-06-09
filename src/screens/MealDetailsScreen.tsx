import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from "react-native";
import { colors, shadow } from "../theme";
import { useAuth } from "../context/AuthContext";
import { useMeals } from "../context/MealContext";

export default function MealDetailsScreen({ navigation, route }: any) {
  const { currentUser } = useAuth();
  const { joinMeal, leaveMeal, deleteMeal, joinedMealIds } = useMeals();

  const meal = route?.params?.meal;

  if (!meal) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.cream, justifyContent: "center", alignItems: "center", padding: 24 }}>
        <Text style={{ fontSize: 22, fontWeight: "800", color: colors.text }}>Meal not found</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Home")} style={{ marginTop: 20 }}>
          <Text style={{ color: colors.oliveGreen }}>Go Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const mealKey = meal.firebaseId || String(meal.id);
  const isOwnMeal = meal.creatorUid === currentUser?.uid;
  const alreadyJoined = joinedMealIds.includes(mealKey);
  const attendeesPhotos = meal.attendeesPhotos || [];
  const attendeesList = meal.attendeesList || [];

  const confirmDelete = () => {
    Alert.alert("Delete Meal", "Are you sure you want to delete this meal?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteMeal(meal);
          navigation.navigate("Home");
        },
      },
    ]);
  };

  const confirmLeave = () => {
    Alert.alert("Leave Meal", "Are you sure you want to leave this meal?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Leave",
        style: "destructive",
        onPress: async () => {
          await leaveMeal(meal);
          navigation.navigate("Home");
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.cream }}
      contentContainerStyle={{ padding: 24, paddingTop: 60, paddingBottom: 120 }}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={{ fontSize: 16, color: colors.oliveGreen }}>← Back</Text>
      </TouchableOpacity>

      <View style={{ backgroundColor: colors.white, borderRadius: 28, padding: 22, marginTop: 25, ...shadow }}>
        {meal.creatorPhoto || meal.profilePhoto ? (
          <Image
            source={{ uri: meal.creatorPhoto || meal.profilePhoto }}
            style={{ width: 86, height: 86, borderRadius: 43, marginBottom: 12 }}
          />
        ) : (
          <Text style={{ fontSize: 60 }}>👤</Text>
        )}

        <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text }}>
          {isOwnMeal ? "You" : meal.creatorName || meal.name || "Student"}
        </Text>

        <Text style={{ color: colors.muted }}>
          {isOwnMeal ? "Your meal post" : "Mahindra University Student"}
        </Text>

        <Text style={{ fontSize: 34, fontWeight: "800", color: colors.oliveGreen, marginTop: 25 }}>
          {meal.location}
        </Text>

        <Text style={{ fontSize: 17, marginTop: 6, color: colors.text }}>
          {meal.mealType} • Today • {meal.time}
        </Text>

        <View style={{ flexDirection: "row", marginTop: 16, flexWrap: "wrap" }}>
          <Text style={{ backgroundColor: colors.peachCream, padding: 10, borderRadius: 16, marginRight: 8, marginBottom: 8 }}>
            {meal.vibe}
          </Text>

          <Text style={{ backgroundColor: colors.peachCream, padding: 10, borderRadius: 16, marginBottom: 8 }}>
            {meal.mood}
          </Text>
        </View>

        <Text style={{ marginTop: 20, fontWeight: "700", fontSize: 18 }}>
          Going
        </Text>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Attendees", {
              attendeesList,
              attendeesPhotos,
            })
          }
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
            {attendeesPhotos.slice(0, 4).map((person: any, index: number) =>
              person.photo ? (
                <Image
                  key={`${person.uid}-${index}`}
                  source={{ uri: person.photo }}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    marginRight: -6,
                    borderWidth: 2,
                    borderColor: colors.white,
                  }}
                />
              ) : (
                <View
                  key={`${person.uid}-${index}`}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    marginRight: -6,
                    borderWidth: 2,
                    borderColor: colors.white,
                    backgroundColor: colors.dustyRose,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>👤</Text>
                </View>
              )
            )}

            <Text style={{ marginLeft: attendeesPhotos.length > 0 ? 14 : 0, fontSize: 24, color: colors.terracotta, fontWeight: "800" }}>
              {meal.attendees || 0} going
            </Text>
          </View>

          <Text style={{ color: colors.muted, marginTop: 6 }}>Tap to view attendees</Text>
        </TouchableOpacity>

        <Text style={{ marginTop: 24, fontWeight: "700", fontSize: 18 }}>About</Text>

        <Text style={{ marginTop: 8, color: colors.text, lineHeight: 22 }}>
          {isOwnMeal
            ? `You are heading to ${meal.location}. Friends can join your meal plan.`
            : `${meal.creatorName || meal.name || "Someone"} is heading to ${meal.location}. Join for a casual meal and meet new people!`}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("MealChat", { meal, attendeesList })}
        style={{ backgroundColor: colors.oliveGreen, borderRadius: 20, paddingVertical: 17, alignItems: "center", marginTop: 24, ...shadow }}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>Open Meal Chat</Text>
      </TouchableOpacity>

      {isOwnMeal ? (
        <TouchableOpacity
          onPress={confirmDelete}
          style={{ backgroundColor: "#E57373", borderRadius: 20, paddingVertical: 17, alignItems: "center", marginTop: 12, ...shadow }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>Delete Meal</Text>
        </TouchableOpacity>
      ) : alreadyJoined ? (
        <TouchableOpacity
          onPress={confirmLeave}
          style={{ backgroundColor: colors.sageFern, borderRadius: 20, paddingVertical: 17, alignItems: "center", marginTop: 12, ...shadow }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>Leave Meal</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={async () => {
            await joinMeal(meal);
            navigation.navigate("Home");
          }}
          style={{ backgroundColor: colors.terracotta, borderRadius: 20, paddingVertical: 17, alignItems: "center", marginTop: 12, ...shadow }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>Join Meal</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}