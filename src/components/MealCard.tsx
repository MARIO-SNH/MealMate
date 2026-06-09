import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { colors, shadow } from "../theme";
import { useAuth } from "../context/AuthContext";

export default function MealCard({
  meal,
  onJoin,
  onLeave,
  alreadyJoined,
  openMealDetails,
}: any) {
  const { currentUser } = useAuth();

  const isOwnMeal = meal.creatorUid === currentUser?.uid;
  const photo = meal.creatorPhoto || meal.profilePhoto || "";

  const confirmLeave = () => {
    Alert.alert("Leave Meal", "Are you sure you want to leave this meal?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Leave",
        style: "destructive",
        onPress: () => onLeave(meal),
      },
    ]);
  };

  return (
    <TouchableOpacity
      onPress={() => openMealDetails(meal)}
      style={{
        backgroundColor: colors.white,
        borderRadius: 24,
        padding: 18,
        marginBottom: 16,
        ...shadow,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        {photo ? (
          <Image
            source={{ uri: photo }}
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              marginRight: 14,
              backgroundColor: colors.cream,
            }}
          />
        ) : (
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              marginRight: 14,
              backgroundColor: colors.dustyRose,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 28 }}>👤</Text>
          </View>
        )}

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, color: colors.muted }}>
            {isOwnMeal
              ? "You are heading to"
              : `${meal.creatorName || meal.name || "Someone"} is heading to`}
          </Text>

          <Text style={{ fontSize: 22, fontWeight: "800", color: colors.text }}>
            {meal.location}
          </Text>

          <Text style={{ marginTop: 4, color: colors.text }}>
            {meal.mealType} • {meal.time}
          </Text>

          <Text
            style={{
              alignSelf: "flex-start",
              backgroundColor: colors.peachCream,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 14,
              marginTop: 10,
              color: colors.text,
            }}
          >
            {meal.vibe || meal.mood}
          </Text>
        </View>
      </View>

      <TouchableOpacity onPress={() => openMealDetails(meal)} style={{ marginTop: 14 }}>
        <Text style={{ color: colors.terracotta, fontWeight: "800" }}>
          👥 {meal.attendees || 0} joining • Tap to view
        </Text>
      </TouchableOpacity>

      <View style={{ alignItems: "flex-end", marginTop: 14 }}>
        {isOwnMeal ? (
          <View
            style={{
              backgroundColor: colors.sageFern,
              paddingHorizontal: 22,
              paddingVertical: 10,
              borderRadius: 16,
            }}
          >
            <Text style={{ color: "white", fontWeight: "800" }}>Your Meal</Text>
          </View>
        ) : alreadyJoined ? (
          <TouchableOpacity
            onPress={confirmLeave}
            style={{
              backgroundColor: colors.sageFern,
              paddingHorizontal: 22,
              paddingVertical: 10,
              borderRadius: 16,
            }}
          >
            <Text style={{ color: "white", fontWeight: "800" }}>Leave Meal</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={(event) => {
              event.stopPropagation();
              onJoin(meal);
            }}
            style={{
              backgroundColor: colors.terracotta,
              paddingHorizontal: 22,
              paddingVertical: 10,
              borderRadius: 16,
            }}
          >
            <Text style={{ color: "white", fontWeight: "800" }}>Join</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}