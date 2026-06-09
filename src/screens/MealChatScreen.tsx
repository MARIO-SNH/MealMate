import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { colors, shadow } from "../theme";
import { useAuth } from "../context/AuthContext";

export default function MealChatScreen({ navigation, route }: any) {
  const { currentUser, currentProfile } = useAuth();

  const meal = route?.params?.meal;
  const attendeesList = route?.params?.attendeesList || meal?.attendeesList || [];
  const mealId = meal?.firebaseId || String(meal?.id || meal?.location);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (!mealId) return;

    const messagesQuery = query(
      collection(db, "meals", mealId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const firebaseMessages = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      setMessages(firebaseMessages);
    });

    return () => unsubscribe();
  }, [mealId]);

  const sendMessage = async () => {
    if (!message.trim() || !currentUser || !currentProfile) return;

    await addDoc(collection(db, "meals", mealId, "messages"), {
      senderUid: currentUser.uid,
      senderName: currentProfile.name,
      senderPhoto: currentProfile.profilePhoto || "",
      text: message.trim(),
      createdAt: new Date().toISOString(),
    });

    if (meal?.creatorUid && meal.creatorUid !== currentUser.uid) {
      await addDoc(collection(db, "notifications"), {
        toUid: meal.creatorUid,
        fromUid: currentUser.uid,
        fromName: currentProfile.name,
        fromPhoto: currentProfile.profilePhoto || "",
        title: `${currentProfile.name} messaged your meal`,
        detail: message.trim(),
        icon: "💬",
        createdAt: new Date().toISOString(),
      });
    }

    setMessage("");
  };

  const Avatar = ({ photo, mine }: any) => {
    if (photo) {
      return (
        <Image
          source={{ uri: photo }}
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            marginRight: mine ? 0 : 8,
            marginLeft: mine ? 8 : 0,
            backgroundColor: colors.cream,
          }}
        />
      );
    }

    return (
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 17,
          marginRight: mine ? 0 : 8,
          marginLeft: mine ? 8 : 0,
          backgroundColor: colors.dustyRose,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>👤</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.cream }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={{ flex: 1, padding: 20, paddingTop: 60 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 16, color: colors.oliveGreen }}>← Back</Text>
        </TouchableOpacity>

        <View style={{ backgroundColor: colors.white, borderRadius: 26, padding: 18, marginTop: 20, ...shadow }}>
          <Text style={{ fontSize: 26, fontWeight: "800", color: colors.oliveGreen }}>
            {meal?.location || "Meal"} Chat
          </Text>

          <Text style={{ color: colors.muted, marginTop: 6 }}>
            {meal?.mealType || "Lunch"} • {meal?.time || ""}
          </Text>

          <Text style={{ color: colors.muted, marginTop: 6 }}>
            👥 {(attendeesList?.length || 0) + 1} people in chat
          </Text>
        </View>

        <ScrollView style={{ flex: 1, marginTop: 20 }} showsVerticalScrollIndicator={false}>
          {messages.length === 0 && (
            <View style={{ backgroundColor: colors.white, borderRadius: 20, padding: 16, ...shadow }}>
              <Text style={{ color: colors.muted }}>
                No messages yet. Start the meal chat.
              </Text>
            </View>
          )}

          {messages.map((item) => {
            const mine = item.senderUid === currentUser?.uid;

            return (
              <View
                key={item.id}
                style={{
                  flexDirection: "row",
                  justifyContent: mine ? "flex-end" : "flex-start",
                  alignItems: "flex-end",
                  marginBottom: 12,
                }}
              >
                {!mine && <Avatar photo={item.senderPhoto} mine={false} />}

                <View
                  style={{
                    backgroundColor: mine ? colors.terracotta : colors.white,
                    padding: 14,
                    borderRadius: 20,
                    maxWidth: "78%",
                    ...shadow,
                  }}
                >
                  {!mine && (
                    <Text style={{ fontWeight: "800", color: colors.oliveGreen, marginBottom: 4 }}>
                      {item.senderName || "Student"}
                    </Text>
                  )}

                  <Text style={{ color: mine ? "white" : colors.text, lineHeight: 20 }}>
                    {item.text}
                  </Text>
                </View>

                {mine && <Avatar photo={currentProfile?.profilePhoto} mine />}
              </View>
            );
          })}
        </ScrollView>

        <View style={{ flexDirection: "row", backgroundColor: colors.white, borderRadius: 24, padding: 8, alignItems: "center", marginBottom: 10, ...shadow }}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Message the meal group..."
            style={{ flex: 1, paddingHorizontal: 14, paddingVertical: 12, color: colors.text }}
          />

          <TouchableOpacity
            onPress={sendMessage}
            style={{ backgroundColor: colors.terracotta, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 18 }}
          >
            <Text style={{ color: "white", fontWeight: "800" }}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}