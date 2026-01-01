import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MapScreen from "@/screens/MapScreen";
import LocationDetailsScreen from "@/screens/LocationDetailsScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type MapStackParamList = {
  Map: undefined;
  LocationDetails: { spotId: string };
};

const Stack = createNativeStackNavigator<MapStackParamList>();

export default function MapStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="LocationDetails"
        component={LocationDetailsScreen}
        options={{
          headerTitle: "Spot details",
        }}
      />
    </Stack.Navigator>
  );
}
