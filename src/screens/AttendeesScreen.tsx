import { ScrollView, Text, TouchableOpacity, View, Image } from "react-native";
import { colors, shadow } from "../theme";

export default function AttendeesScreen({ navigation, route }: any) {
  const attendeesPhotos = route?.params?.attendeesPhotos || [];
  const attendeesList = route?.params?.attendeesList || [];

  const attendees =
    attendeesPhotos.length > 0
      ? attendeesPhotos
      : attendeesList.map((name: string, index: number) => ({
          uid: String(index),
          name,
          photo: "",
        }));

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.cream }}
      contentContainerStyle={{ padding: 24, paddingTop: 60, paddingBottom: 120 }}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={{ color: colors.oliveGreen, fontSize: 16 }}>← Back</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 34, fontWeight: "800", color: colors.oliveGreen, marginTop: 20 }}>
        People Going
      </Text>

      <Text style={{ color: colors.muted, marginTop: 8, marginBottom: 18 }}>
        Students joining this meal.
      </Text>

      {attendees.length === 0 ? (
        <View style={{ backgroundColor: colors.white, borderRadius: 22, padding: 20, marginTop: 14, ...shadow }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text }}>
            No one has joined yet.
          </Text>

          <Text style={{ color: colors.muted, marginTop: 6 }}>
            Be the first person to join this meal.
          </Text>
        </View>
      ) : (
        attendees.map((person: any, index: number) => (
          <View
            key={person.uid || index}
            style={{
              backgroundColor: colors.white,
              borderRadius: 22,
              padding: 18,
              marginTop: 14,
              flexDirection: "row",
              alignItems: "center",
              ...shadow,
            }}
          >
            {person.photo ? (
              <Image
                source={{ uri: person.photo }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  marginRight: 15,
                  backgroundColor: colors.cream,
                }}
              />
            ) : (
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  marginRight: 15,
                  backgroundColor: colors.dustyRose,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 26 }}>👤</Text>
              </View>
            )}

            <View>
              <Text style={{ fontSize: 18, fontWeight: "800", color: colors.text }}>
                {person.name || "Student"}
              </Text>

              <Text style={{ color: colors.muted, marginTop: 3 }}>
                Going to this meal
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}