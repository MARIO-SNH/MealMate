import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { colors, shadow } from "../theme";
import MealCard from "../components/MealCard";
import { useMeals } from "../context/MealContext";
import { useAuth } from "../context/AuthContext";
import { getTodayName, getTodayMenu } from "../data/campusData";

export default function HomeScreen({ navigation }: any) {
  const { currentUser } = useAuth();
  const { meals, joinMeal, leaveMeal, deleteMeal, joinedMealIds, friendUids } =
    useMeals();

  const [feedType, setFeedType] = useState("Friends");
  const [menuVisible, setMenuVisible] = useState(false);

  const isExplore = feedType === "Explore";
  const accentColor = isExplore ? colors.oliveGreen : colors.terracotta;
  const todayMenu = getTodayMenu();

  const getMealKey = (meal: any) => meal.firebaseId || String(meal.id);

  const openMealDetails = (meal: any) => {
    navigation.navigate("MealDetails", {
      meal,
      alreadyJoined: joinedMealIds.includes(getMealKey(meal)),
    });
  };

  const displayedMeals =
    feedType === "Friends"
      ? meals.filter(
          (meal: any) =>
            meal.visibility === "Friends" &&
            (friendUids.includes(meal.creatorUid) ||
              meal.creatorUid === currentUser?.uid)
        )
      : meals.filter((meal: any) => meal.visibility !== "Friends");

  const MenuSection = ({ title, items }: any) => (
    <View style={{ marginTop: 18 }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "800",
          color: colors.oliveGreen,
          marginBottom: 8,
        }}
      >
        {title}
      </Text>

      {items.map((item: string, index: number) => (
        <Text
          key={index}
          style={{
            color: colors.text,
            fontSize: 15,
            marginBottom: 5,
            lineHeight: 21,
          }}
        >
          • {item}
        </Text>
      ))}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            marginTop: 60,
            marginHorizontal: 20,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 32,
              fontWeight: "800",
              color: colors.oliveGreen,
            }}
          >
            MealMate
          </Text>

          <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
            <Text style={{ fontSize: 28 }}>🔔</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ marginHorizontal: 20, marginTop: 8, color: colors.muted }}>
          Mahindra University meals, menus, and friends.
        </Text>

        <TouchableOpacity
          onPress={() => setMenuVisible(true)}
          style={{
            backgroundColor: colors.white,
            marginHorizontal: 20,
            marginTop: 22,
            borderRadius: 26,
            padding: 20,
            ...shadow,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "800",
              color: colors.oliveGreen,
            }}
          >
            🍽 Today’s Mess Menu
          </Text>

          <Text style={{ color: colors.muted, marginTop: 6 }}>
            {getTodayName()} • IT Mess • Main Mess • Girls Mess
          </Text>

          <Text
            style={{
              color: colors.terracotta,
              fontWeight: "800",
              marginTop: 14,
              fontSize: 16,
            }}
          >
            Tap to view full menu →
          </Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row", marginTop: 24, marginHorizontal: 20 }}>
          <TouchableOpacity
            onPress={() => setFeedType("Friends")}
            style={{
              backgroundColor: !isExplore ? colors.terracotta : colors.white,
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 20,
              marginRight: 10,
            }}
          >
            <Text
              style={{
                color: !isExplore ? "white" : colors.text,
                fontWeight: "700",
              }}
            >
              👥 Friends
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFeedType("Explore")}
            style={{
              backgroundColor: isExplore ? colors.oliveGreen : colors.white,
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                color: isExplore ? "white" : colors.text,
                fontWeight: "700",
              }}
            >
              🌎 Explore
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          style={{
            marginTop: 30,
            marginLeft: 20,
            fontSize: 20,
            fontWeight: "800",
            color: colors.text,
          }}
        >
          {isExplore ? "Public Meals" : "Friends Meals"}
        </Text>

        <View style={{ padding: 20, paddingBottom: 120 }}>
          {displayedMeals.length === 0 ? (
            <View
              style={{
                backgroundColor: colors.white,
                borderRadius: 24,
                padding: 20,
                ...shadow,
              }}
            >
              <Text style={{ color: colors.text, fontWeight: "800" }}>
                No meals here yet
              </Text>
              <Text style={{ color: colors.muted, marginTop: 6 }}>
                {isExplore
                  ? "Create a public meal to start exploring."
                  : "Add friends or create a friends-only meal."}
              </Text>
            </View>
          ) : (
            displayedMeals.map((meal: any) => (
              <MealCard
                key={getMealKey(meal)}
                meal={meal}
                onJoin={joinMeal}
                onLeave={leaveMeal}
                onDelete={deleteMeal}
                alreadyJoined={joinedMealIds.includes(getMealKey(meal))}
                openMealDetails={openMealDetails}
              />
            ))
          )}
        </View>
      </ScrollView>

      <Modal visible={menuVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.35)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: colors.cream,
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              padding: 24,
              maxHeight: "85%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "800",
                    color: colors.oliveGreen,
                  }}
                >
                  Today’s Menu
                </Text>
                <Text style={{ color: colors.muted, marginTop: 4 }}>
                  {getTodayName()} • All Messes
                </Text>
              </View>

              <TouchableOpacity onPress={() => setMenuVisible(false)}>
                <Text style={{ fontSize: 26 }}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <MenuSection title="Breakfast" items={todayMenu.breakfast} />
              <MenuSection title="Lunch" items={todayMenu.lunch} />
              <MenuSection title="Snacks" items={todayMenu.snacks} />
              <MenuSection title="Dinner" items={todayMenu.dinner} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 90,
          backgroundColor: colors.white,
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
      >
        <TouchableOpacity>
          <Text style={{ fontSize: 24, textAlign: "center" }}>🏠</Text>
          <Text style={{ color: colors.terracotta, fontWeight: "700" }}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Friends")}>
          <Text style={{ fontSize: 24, textAlign: "center" }}>👥</Text>
          <Text>Friends</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("CreateMeal")}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: colors.oliveGreen,
            justifyContent: "center",
            alignItems: "center",
            marginTop: -25,
          }}
        >
          <Text style={{ color: "white", fontSize: 32 }}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Reviews")}>
          <Text style={{ fontSize: 24, textAlign: "center" }}>⭐</Text>
          <Text>Reviews</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Text style={{ fontSize: 24, textAlign: "center" }}>👤</Text>
          <Text>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}