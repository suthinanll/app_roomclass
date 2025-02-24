import { createStackNavigator } from "@react-navigation/stack";
import { auth } from "../firebase/firebaseConfig";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import RegisterScreen from "../screens/RegisterScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import AddClass from "../screens/AddClass";
import QRScannerScreen from "../screens/QRScannerScreen";
import JoinClassForm from "../screens/JoinClassForm";

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
          headerTitleAlign: "center",
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="Edit"
        component={EditProfileScreen}
        options={{
          headerTitleAlign: "center",
          headerBackTitle: "", // ซ่อนชื่อปุ่ม Back

        }}
      />
      <Stack.Screen
        name="Addclass"
        component={AddClass}
        options={{
          headerTitle: "Add Class",
          headerTitleAlign: "center",
          headerBackTitle: "", // ซ่อนชื่อปุ่ม Back
        }}
      />
      <Stack.Screen
        name="QRScan"
        component={QRScannerScreen}
        options={{
          headerTitleAlign: "center",
          headerBackTitle: "", // ซ่อนชื่อปุ่ม Back

        }}
      />
      <Stack.Screen
        name="JoinClassForm"
        component={JoinClassForm}
        options={{
          headerTitle: "Join Class",
          headerBackTitle: "", // ซ่อนชื่อปุ่ม Back
        }}
      />
    </Stack.Navigator>
  );
}
