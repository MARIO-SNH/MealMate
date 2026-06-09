import { useState } from "react";
import {
  Text,
  TouchableOpacity,
  ScrollView,
  View,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { colors, shadow } from "../theme";
import { useMeals } from "../context/MealContext";
import { useAuth } from "../context/AuthContext";
import {
  CAMPUS_LOCATIONS,
  MEAL_TYPES,
  VIBE_OPTIONS,
} from "../data/campusData";

export default function CreateMealScreen({ navigation }: any) {
  const { addMeal } = useMeals();
  const { currentProfile } = useAuth();

  const [location, setLocation] = useState("Main Mess");
  const [mealType, setMealType] = useState("Lunch");
  const [visibility, setVisibility] = useState("Friends");
  const [vibe, setVibe] = useState("Social");
  const [mood, setMood] = useState("Open to New People");

  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("30");
  const [period, setPeriod] = useState("PM");

  const [openDropdown, setOpenDropdown] = useState("");

  const time = `${hour.padStart(2, "0")}:${minute.padStart(2, "0")} ${period}`;

  const DropdownField = ({ label, value, options, field }: any) => (
    <View style={{ marginBottom: 18 }}>
      <Text style={{ fontWeight: "800", color: colors.text, marginBottom: 8 }}>
        {label}
      </Text>

      <TouchableOpacity
        onPress={() => setOpenDropdown(field)}
        style={{
          backgroundColor: colors.cream,
          borderRadius: 16,
          padding: 15,
          borderWidth: 1,
          borderColor: colors.dustyRose,
        }}
      >
        <Text style={{ color: colors.text, fontWeight: "700" }}>{value} ▼</Text>
      </TouchableOpacity>

      <Modal visible={openDropdown === field} transparent animationType="fade">
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setOpenDropdown("")}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.25)",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <View
            style={{
              backgroundColor: colors.white,
              borderRadius: 24,
              padding: 18,
              maxHeight: "75%",
              ...shadow,
            }}
          >
            <Text
              style={{
                fontSize: 22,
                fontWeight: "800",
                color: colors.oliveGreen,
                marginBottom: 12,
              }}
            >
              Select {label}
            </Text>

            <ScrollView>
              {options.map((item: string) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    if (field === "location") setLocation(item);
                    if (field === "mealType") setMealType(item);
                    if (field === "vibe") setVibe(item);
                    setOpenDropdown("");
                  }}
                  style={{
                    paddingVertical: 14,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.cream,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: value === item ? "800" : "500",
                      color: value === item ? colors.terracotta : colors.text,
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );

  const ToggleButton = ({ label, selected, onPress }: any) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        backgroundColor: selected ? colors.terracotta : colors.cream,
        paddingVertical: 12,
        borderRadius: 14,
        alignItems: "center",
        marginRight: 8,
      }}
    >
      <Text
        style={{
          color: selected ? "white" : colors.text,
          fontWeight: "800",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const postMeal = async () => {
    const numericHour = Number(hour);
    const numericMinute = Number(minute);

    if (!currentProfile) {
      Alert.alert("Login required", "Please log in again.");
      return;
    }

    if (
      !hour ||
      !minute ||
      numericHour < 1 ||
      numericHour > 12 ||
      numericMinute < 0 ||
      numericMinute > 59
    ) {
      Alert.alert("Invalid time", "Please enter a valid time like 12:30.");
      return;
    }

    await addMeal({
      id: Date.now(),
      location,
      mealType,
      time,
      visibility,
      vibe,
      mood,
    });

    navigation.navigate("Home");
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.cream }}
      contentContainerStyle={{ padding: 24, paddingTop: 60, paddingBottom: 120 }}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={{ fontSize: 16, color: colors.oliveGreen, marginBottom: 20 }}>
          ← Back
        </Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 34, fontWeight: "800", color: colors.oliveGreen }}>
        Create Meal
      </Text>

      <Text style={{ marginTop: 8, fontSize: 16, color: colors.muted }}>
        Set your meal plan in a few clean taps.
      </Text>

      <View
        style={{
          backgroundColor: colors.white,
          borderRadius: 28,
          padding: 20,
          marginTop: 28,
          ...shadow,
        }}
      >
        <DropdownField label="Location" value={location} options={CAMPUS_LOCATIONS} field="location" />

        <DropdownField label="Meal Type" value={mealType} options={MEAL_TYPES} field="mealType" />

        <Text style={{ fontWeight: "800", color: colors.text, marginBottom: 8 }}>
          Time
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 18 }}>
          <TextInput
            value={hour}
            onChangeText={(text) => setHour(text.replace(/[^0-9]/g, "").slice(0, 2))}
            keyboardType="number-pad"
            placeholder="HH"
            style={{
              backgroundColor: colors.cream,
              borderRadius: 16,
              padding: 15,
              width: 70,
              textAlign: "center",
              fontWeight: "800",
              borderWidth: 1,
              borderColor: colors.dustyRose,
            }}
          />

          <Text style={{ fontSize: 24, fontWeight: "800", marginHorizontal: 8 }}>
            :
          </Text>

          <TextInput
            value={minute}
            onChangeText={(text) => setMinute(text.replace(/[^0-9]/g, "").slice(0, 2))}
            keyboardType="number-pad"
            placeholder="MM"
            style={{
              backgroundColor: colors.cream,
              borderRadius: 16,
              padding: 15,
              width: 70,
              textAlign: "center",
              fontWeight: "800",
              borderWidth: 1,
              borderColor: colors.dustyRose,
            }}
          />

          <View
            style={{
              flexDirection: "row",
              marginLeft: 12,
              backgroundColor: colors.cream,
              borderRadius: 16,
              padding: 4,
            }}
          >
            {["AM", "PM"].map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setPeriod(item)}
                style={{
                  backgroundColor: period === item ? colors.terracotta : "transparent",
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{
                    color: period === item ? "white" : colors.text,
                    fontWeight: "800",
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <DropdownField label="Vibe" value={vibe} options={VIBE_OPTIONS} field="vibe" />

        <Text style={{ fontWeight: "800", color: colors.text, marginBottom: 8 }}>
          Visibility
        </Text>

        <View style={{ flexDirection: "row", marginBottom: 18 }}>
          <ToggleButton
            label="Friends"
            selected={visibility === "Friends"}
            onPress={() => setVisibility("Friends")}
          />
          <ToggleButton
            label="Campus Public"
            selected={visibility === "Campus Public"}
            onPress={() => setVisibility("Campus Public")}
          />
        </View>

        <Text style={{ fontWeight: "800", color: colors.text, marginBottom: 8 }}>
          Joining Preference
        </Text>

        <View style={{ flexDirection: "row" }}>
          <ToggleButton
            label="Friends Only"
            selected={mood === "Friends Only"}
            onPress={() => setMood("Friends Only")}
          />
          <ToggleButton
            label="Open"
            selected={mood === "Open to New People"}
            onPress={() => setMood("Open to New People")}
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={postMeal}
        style={{
          backgroundColor: colors.terracotta,
          paddingVertical: 17,
          borderRadius: 20,
          alignItems: "center",
          marginTop: 28,
          ...shadow,
        }}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "800" }}>
          Post Meal
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}