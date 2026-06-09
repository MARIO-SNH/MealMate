import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../services/firebase";
import { colors, shadow } from "../theme";
import { useAuth } from "../context/AuthContext";

export default function NotificationsScreen({ navigation }: any) {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);

  const isWithin7Days = (createdAt: string) => {
    if (!createdAt) return false;
    const created = new Date(createdAt).getTime();
    const days = (Date.now() - created) / (1000 * 60 * 60 * 24);
    return days < 7;
  };

  useEffect(() => {
    const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allNotifications = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      const filtered = allNotifications.filter(
        (item: any) =>
          (!item.toUid || item.toUid === currentUser?.uid) &&
          isWithin7Days(item.createdAt)
      );

      setNotifications(filtered);
    });

    return () => unsubscribe();
  }, [currentUser?.uid]);

  const NotificationAvatar = ({ item }: any) => {
    if (item.fromPhoto) {
      return (
        <Image
          source={{ uri: item.fromPhoto }}
          style={{
            width: 46,
            height: 46,
            borderRadius: 23,
            marginRight: 14,
            backgroundColor: colors.cream,
          }}
        />
      );
    }

    return (
      <View
        style={{
          width: 46,
          height: 46,
          borderRadius: 23,
          marginRight: 14,
          backgroundColor: colors.dustyRose,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 24 }}>{item.icon || "🔔"}</Text>
      </View>
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.cream }}
      contentContainerStyle={{ padding: 24, paddingTop: 60, paddingBottom: 120 }}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={{ fontSize: 16, color: colors.oliveGreen }}>← Back</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 34, fontWeight: "800", color: colors.oliveGreen, marginTop: 20 }}>
        Notifications
      </Text>

      <Text style={{ color: colors.muted, marginTop: 8, marginBottom: 18 }}>
        Notifications stay here for 7 days.
      </Text>

      {notifications.length === 0 ? (
        <View style={{ backgroundColor: colors.white, borderRadius: 24, padding: 20, ...shadow }}>
          <Text style={{ fontSize: 18, fontWeight: "800", color: colors.text }}>
            No notifications yet
          </Text>
          <Text style={{ color: colors.muted, marginTop: 6 }}>
            Meal, friend, and chat updates will appear here.
          </Text>
        </View>
      ) : (
        notifications.map((item) => (
          <View
            key={item.id}
            style={{
              backgroundColor: colors.white,
              borderRadius: 24,
              padding: 18,
              marginBottom: 16,
              flexDirection: "row",
              ...shadow,
            }}
          >
            <NotificationAvatar item={item} />

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "800", color: colors.text }}>
                {item.title}
              </Text>
              <Text style={{ marginTop: 4, color: colors.muted }}>
                {item.detail}
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}