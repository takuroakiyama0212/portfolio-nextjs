import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddSpotScreen from "@/screens/AddSpotScreen";
import AddSpotLoginScreen from "@/screens/AddSpotLoginScreen";
import { useAuth } from "@/context/AuthContext";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type AddSpotStackParamList = {
  AddSpotLogin: undefined;
  AddSpot: undefined;
};

const Stack = createNativeStackNavigator<AddSpotStackParamList>();

export default function AddSpotStackNavigator() {
  const screenOptions = useScreenOptions();
  const { isReady, isAuthenticated } = useAuth();

  if (!isReady) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {!isAuthenticated ? (
        <Stack.Screen
          name="AddSpotLogin"
          component={AddSpotLoginScreen}
          options={{
            headerTitle: "Login",
          }}
        />
      ) : (
        <Stack.Screen
          name="AddSpot"
          component={AddSpotScreen}
          options={{
            headerTitle: "Add a spot",
          }}
        />
      )}
    </Stack.Navigator>
  );
}

