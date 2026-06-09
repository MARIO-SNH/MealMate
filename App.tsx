import AppNavigator from "./src/navigation/AppNavigator";
import { MealProvider } from "./src/context/MealContext";
import { AuthProvider } from "./src/context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <MealProvider>
        <AppNavigator />
      </MealProvider>
    </AuthProvider>
  );
}