import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import { auth } from "../firebase/firebaseConfig";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import RegisterScreen from "../screens/RegisterScreen";

const Stack = createStackNavigator();

export default function AppNavigator({ navigation }) {
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.navigate("Login"); 
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ 
          headerShown: false, 
        }} 
      />

      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{ 
          headerShown: false, 
        }} 
      />
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          headerTitle: "หน้าหลัก",
          headerTitleAlign: "center",
          headerLeft: () => null, 
          headerRight: () => (
            <TouchableOpacity style={{ marginRight: 10 }} onPress={handleLogout}>
              <Button mode="outlined">Logout</Button>
            </TouchableOpacity>
          ),
        }} 
      />
    </Stack.Navigator>
  );
}
