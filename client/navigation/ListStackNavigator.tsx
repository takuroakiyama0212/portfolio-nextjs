import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ListScreen from "@/screens/ListScreen";
import LocationDetailsScreen from "@/screens/LocationDetailsScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type ListStackParamList = {
  List: undefined;
  LocationDetails: { spotId: string };
};

const Stack = createNativeStackNavigator<ListStackParamList>();

export default function ListStackNavigator() {
  const screenOptions = useScreenOptions({ transparent: false });

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="List"
        component={ListScreen}
        options={{
          headerTitle: "Nearby Spots",
        }}
      />
      <Stack.Screen
        name="LocationDetails"
        component={LocationDetailsScreen}
        options={{
          headerTitle: "Details",
        }}
      />
    </Stack.Navigator>
  );
}
