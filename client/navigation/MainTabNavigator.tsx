import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Platform, StyleSheet } from "react-native";
import MapStackNavigator from "@/navigation/MapStackNavigator";
import ListStackNavigator from "@/navigation/ListStackNavigator";
import AddSpotStackNavigator from "@/navigation/AddSpotStackNavigator";
import { useTheme } from "@/hooks/useTheme";

export type MainTabParamList = {
  MapTab: undefined;
  AddSpotTab: undefined;
  ListTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="MapTab"
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: Platform.select({
            ios: "transparent",
            android: theme.backgroundRoot,
          }),
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={100}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : null,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="MapTab"
        component={MapStackNavigator}
        options={{
          title: "Map",
          tabBarIcon: ({ color, size }) => (
            <Feather name="map-pin" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AddSpotTab"
        component={AddSpotStackNavigator}
        options={{
          title: "Add Spot",
          tabBarIcon: ({ color, size }) => (
            <Feather name="plus-circle" size={size + 4} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="ListTab"
        component={ListStackNavigator}
        options={{
          title: "List",
          tabBarIcon: ({ color, size }) => (
            <Feather name="list" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
