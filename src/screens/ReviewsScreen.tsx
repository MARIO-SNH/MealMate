import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  TextInput,
} from "react-native";
import { addDoc, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../services/firebase";
import { colors, shadow } from "../theme";
import { useAuth } from "../context/AuthContext";
import { CAMPUS_LOCATIONS } from "../data/campusData";

export default function ReviewsScreen({ navigation }: any) {
  const { currentUser, currentProfile } = useAuth();

  const [reviews, setReviews] = useState<any[]>([]);
  const [tab, setTab] = useState("Today");
  const [reviewType, setReviewType] = useState("daily");

  const [place, setPlace] = useState("Main Mess");
  const [item, setItem] = useState("");
  const [rating, setRating] = useState(0);
  const [note, setNote] = useState("");

  const [openDropdown, setOpenDropdown] = useState("");

  const isWithin24Hours = (createdAt: string) => {
    if (!createdAt) return false;
    const hours = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
    return hours < 24;
  };

  useEffect(() => {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firebaseReviews = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      setReviews(firebaseReviews);
    });

    return () => unsubscribe();
  }, []);

  const dailyReviews = reviews.filter(
    (review) => (review.type || "longTerm") === "daily" && isWithin24Hours(review.createdAt)
  );

  const longTermReviews = reviews.filter(
    (review) => (review.type || "longTerm") === "longTerm"
  );

  const activeReviews = tab === "Today" ? dailyReviews : longTermReviews;

  const addReview = async () => {
    if (!place || !item || rating === 0 || !note) {
      Alert.alert("Missing info", "Choose a place, type the food item, choose a rating, and write a note.");
      return;
    }

    if (!currentUser || !currentProfile) {
      Alert.alert("Login required", "Please log in again.");
      return;
    }

    await addDoc(collection(db, "reviews"), {
      type: reviewType,
      place,
      item,
      rating,
      note,
      authorUid: currentUser.uid,
      authorName: currentProfile.name,
      authorPhoto: currentProfile.profilePhoto || "",
      createdAt: new Date().toISOString(),
      expiresAt:
        reviewType === "daily"
          ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          : null,
    });

    setItem("");
    setRating(0);
    setNote("");

    Alert.alert("Saved", reviewType === "daily" ? "Daily review added." : "Long-term review added.");
  };

  const averageRating =
    longTermReviews.length === 0
      ? "0.0"
      : (
          longTermReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
          longTermReviews.length
        ).toFixed(1);

  const leaderboard = Object.values(
    longTermReviews.reduce((acc: any, review: any) => {
      const key = review.place || "Unknown";

      if (!acc[key]) {
        acc[key] = { place: key, total: 0, count: 0 };
      }

      acc[key].total += Number(review.rating || 0);
      acc[key].count += 1;

      return acc;
    }, {})
  )
    .map((hall: any) => ({
      place: hall.place,
      average: hall.count === 0 ? 0 : hall.total / hall.count,
      count: hall.count,
    }))
    .sort((a: any, b: any) => b.average - a.average);

  const Stars = ({ value, onPress }: any) => (
    <View style={{ flexDirection: "row", marginBottom: 12 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => onPress && onPress(star)}>
          <Text style={{ fontSize: 32, marginRight: 4 }}>
            {star <= value ? "⭐" : "☆"}
          </Text>
        </TouchableOpacity>
      ))}
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
      <Text style={{ color: selected ? "white" : colors.text, fontWeight: "800" }}>
        {label}
      </Text>
    </TouchableOpacity>
  );

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
            <Text style={{ fontSize: 22, fontWeight: "800", color: colors.oliveGreen, marginBottom: 12 }}>
              Select {label}
            </Text>

            <ScrollView>
              {options.map((option: string) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => {
                    if (field === "place") setPlace(option);
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
                      fontWeight: value === option ? "800" : "500",
                      color: value === option ? colors.terracotta : colors.text,
                    }}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );

  const ReviewCard = ({ review }: any) => (
    <View style={{ backgroundColor: colors.white, borderRadius: 26, padding: 20, marginBottom: 16, ...shadow }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        {review.authorPhoto ? (
          <Image
            source={{ uri: review.authorPhoto }}
            style={{ width: 38, height: 38, borderRadius: 19, marginRight: 10, backgroundColor: colors.cream }}
          />
        ) : (
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              marginRight: 10,
              backgroundColor: colors.dustyRose,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>👤</Text>
          </View>
        )}

        <View>
          <Text style={{ fontWeight: "800", color: colors.text }}>
            {review.authorName || "Student"}
          </Text>
          <Text style={{ color: colors.muted, fontSize: 12 }}>
            {review.type === "daily" ? "Today’s review" : "Long-term review"}
          </Text>
        </View>
      </View>

      <Text style={{ fontSize: 24, fontWeight: "800", color: colors.text }}>
        {review.place}
      </Text>

      <View style={{ marginTop: 8 }}>
        <Stars value={Number(review.rating || 0)} />
      </View>

      <Text style={{ marginTop: 4, fontWeight: "700" }}>
        {review.item}
      </Text>

      <Text style={{ color: colors.muted, marginTop: 4 }}>
        {review.note}
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

      <Text style={{ fontSize: 34, fontWeight: "800", color: colors.oliveGreen, marginTop: 18 }}>
        Dining Reviews
      </Text>

      <Text style={{ color: colors.muted, marginTop: 8, marginBottom: 18 }}>
        Daily food feedback and long-term campus dining ratings.
      </Text>

      <View style={{ flexDirection: "row", marginBottom: 18 }}>
        <ToggleButton
          label="Today"
          selected={tab === "Today"}
          onPress={() => setTab("Today")}
        />
        <ToggleButton
          label="Ratings"
          selected={tab === "LongTerm"}
          onPress={() => setTab("LongTerm")}
        />
      </View>

      {tab === "LongTerm" && (
        <>
          <View style={{ backgroundColor: colors.terracotta, borderRadius: 26, padding: 20, marginBottom: 20, ...shadow }}>
            <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>
              Overall Long-Term Rating
            </Text>
            <Text style={{ color: "white", fontSize: 36, fontWeight: "800", marginTop: 6 }}>
              ⭐ {averageRating}
            </Text>
            <Text style={{ color: "white", marginTop: 4 }}>
              Based on {longTermReviews.length} long-term reviews
            </Text>
          </View>

          <View style={{ backgroundColor: colors.white, borderRadius: 26, padding: 20, marginBottom: 22, ...shadow }}>
            <Text style={{ fontSize: 22, fontWeight: "800", color: colors.text, marginBottom: 14 }}>
              Dining Hall Leaderboard
            </Text>

            {leaderboard.length === 0 ? (
              <Text style={{ color: colors.muted }}>
                Leaderboard will appear after long-term reviews are added.
              </Text>
            ) : (
              leaderboard.map((hall: any, index: number) => (
                <View
                  key={hall.place}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: colors.cream,
                    borderRadius: 18,
                    padding: 14,
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ fontSize: 22, fontWeight: "800", color: colors.oliveGreen, width: 38 }}>
                    #{index + 1}
                  </Text>

                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 17, fontWeight: "800", color: colors.text }}>
                      {hall.place}
                    </Text>
                    <Text style={{ color: colors.muted, marginTop: 3 }}>
                      {hall.count} review{hall.count === 1 ? "" : "s"}
                    </Text>
                  </View>

                  <Text style={{ fontSize: 18, fontWeight: "800", color: colors.terracotta }}>
                    ⭐ {hall.average.toFixed(1)}
                  </Text>
                </View>
              ))
            )}
          </View>
        </>
      )}

      <View style={{ backgroundColor: colors.white, borderRadius: 26, padding: 20, marginBottom: 22, ...shadow }}>
        <Text style={{ fontSize: 22, fontWeight: "800", color: colors.text, marginBottom: 14 }}>
          Write a Review
        </Text>

        <Text style={{ fontWeight: "800", color: colors.text, marginBottom: 8 }}>
          Review Type
        </Text>

        <View style={{ flexDirection: "row", marginBottom: 18 }}>
          <ToggleButton
            label="Daily"
            selected={reviewType === "daily"}
            onPress={() => setReviewType("daily")}
          />
          <ToggleButton
            label="Long-Term"
            selected={reviewType === "longTerm"}
            onPress={() => setReviewType("longTerm")}
          />
        </View>

        <DropdownField
          label="Place"
          value={place}
          options={CAMPUS_LOCATIONS}
          field="place"
        />

        <Text style={{ fontWeight: "800", color: colors.text, marginBottom: 8 }}>
          Food Item
        </Text>

        <TextInput
          value={item}
          onChangeText={setItem}
          placeholder="Type food item, ex: Paneer Biryani"
          style={{
            backgroundColor: colors.cream,
            borderRadius: 16,
            padding: 15,
            marginBottom: 18,
            borderWidth: 1,
            borderColor: colors.dustyRose,
            color: colors.text,
          }}
        />

        <Text style={{ fontWeight: "800", color: colors.text, marginBottom: 8 }}>
          Rating
        </Text>
        <Stars value={rating} onPress={setRating} />

        <Text style={{ fontWeight: "800", color: colors.text, marginBottom: 8 }}>
          Review
        </Text>

        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder={
            reviewType === "daily"
              ? "How was it today?"
              : "What should students know long-term?"
          }
          multiline
          style={{
            backgroundColor: colors.cream,
            borderRadius: 16,
            padding: 15,
            marginBottom: 18,
            borderWidth: 1,
            borderColor: colors.dustyRose,
            minHeight: 90,
            color: colors.text,
            textAlignVertical: "top",
          }}
        />

        <TouchableOpacity
          onPress={addReview}
          style={{
            backgroundColor: colors.terracotta,
            borderRadius: 18,
            paddingVertical: 14,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "800" }}>
            Post {reviewType === "daily" ? "Daily" : "Long-Term"} Review
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={{ fontSize: 22, fontWeight: "800", color: colors.text, marginBottom: 12 }}>
        {tab === "Today" ? "What’s Good Today" : "Long-Term Reviews"}
      </Text>

      {activeReviews.length === 0 ? (
        <View style={{ backgroundColor: colors.white, borderRadius: 24, padding: 20, ...shadow }}>
          <Text style={{ fontSize: 18, fontWeight: "800", color: colors.text }}>
            No reviews yet
          </Text>
          <Text style={{ color: colors.muted, marginTop: 6 }}>
            {tab === "Today"
              ? "Be the first to share what tastes good today."
              : "Be the first to add a long-term dining review."}
          </Text>
        </View>
      ) : (
        activeReviews.map((review) => <ReviewCard key={review.id} review={review} />)
      )}
    </ScrollView>
  );
}