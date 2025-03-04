import { createStackNavigator } from "@react-navigation/stack";
import { auth } from "../firebase/firebaseConfig";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import RegisterScreen from "../screens/RegisterScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import AddClass from "../screens/AddClass";
import QRScannerScreen from "../screens/QRScannerScreen";
import JoinClassForm from "../screens/JoinClassForm";
import Checkin from "../screens/Checkin"
import Checkclass from "../screens/Checkclass"
import QuestionScreen from "../screens/QuestionScreen"



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
          headerTitleAlign: "center",
          headerBackTitle: "", // ซ่อนชื่อปุ่ม Back
        }}
      />

      <Stack.Screen
        name="Checkin"
        component={Checkin}
        options={{
          headerTitle: "Cehckin",
          headerTitleAlign: "center",
          headerBackTitle: "", // ซ่อนชื่อปุ่ม Back
        }}
      />
      <Stack.Screen
        name="Checkclass"
        component={Checkclass}
        options={{
          headerTitle: "Checkclass",
          headerTitleAlign: "center",
          headerBackTitle: "", // ซ่อนชื่อปุ่ม Back
        }}
      />

      <Stack.Screen
        name="QA"
        component={QuestionScreen}
        options={{
          headerTitle: "Question",
          headerTitleAlign: "center",
          headerBackTitle: "", // ซ่อนชื่อปุ่ม Back
        }}
      />
    </Stack.Navigator>
  );
}
