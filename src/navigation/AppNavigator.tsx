import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import GetStartedScreen from "../screens/GetStartedScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import HomeScreen from "../screens/HomeScreen";
import CreateMealScreen from "../screens/CreateMealScreen";
import FriendsScreen from "../screens/FriendsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import MealDetailsScreen from "../screens/MealDetailsScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import ReviewsScreen from "../screens/ReviewsScreen";
import AttendeesScreen from "../screens/AttendeesScreen";
import MealChatScreen from "../screens/MealChatScreen";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { currentUser, authLoading } = useAuth();

  if (authLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.cream, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.terracotta} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!currentUser ? (
          <>
            <Stack.Screen name="GetStarted" component={GetStartedScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="CreateMeal" component={CreateMealScreen} />
            <Stack.Screen name="Friends" component={FriendsScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="MealDetails" component={MealDetailsScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="Reviews" component={ReviewsScreen} />
            <Stack.Screen name="Attendees" component={AttendeesScreen} />
            <Stack.Screen name="MealChat" component={MealChatScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}