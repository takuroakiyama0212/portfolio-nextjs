import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "@/navigation/MainTabNavigator";
import AddSpotScreen from "@/screens/AddSpotScreen";
import SettingsScreen from "@/screens/SettingsScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type RootStackParamList = {
  Main: undefined;
  AddSpot: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddSpot"
        component={AddSpotScreen}
        options={{
          presentation: "modal",
          headerTitle: "Add a spot",
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          presentation: "modal",
          headerTitle: "Settings",
        }}
      />
    </Stack.Navigator>
  );
}
