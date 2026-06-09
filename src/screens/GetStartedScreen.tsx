import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { colors, shadow } from "../theme";

export default function GetStartedScreen({ navigation }: any) {
  return (
    <ImageBackground
      source={require("../../assets/getstarted.png")}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <View
        style={{
          position: "absolute",
          bottom: 70,
          left: 30,
          right: 30,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("Signup")}
          style={{
            backgroundColor: colors.terracotta,
            paddingVertical: 17,
            borderRadius: 20,
            alignItems: "center",
            ...shadow,
          }}
        >
          <Text style={{ color: "white", fontSize: 18, fontWeight: "800" }}>
            Get Started
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={{
            backgroundColor: "rgba(255,255,255,0.92)",
            paddingVertical: 17,
            borderRadius: 20,
            alignItems: "center",
            marginTop: 18,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.8)",
            ...shadow,
          }}
        >
          <Text style={{ color: colors.oliveGreen, fontSize: 17, fontWeight: "800" }}>
            Sign in with University Email
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}