import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SQLiteProvider } from "expo-sqlite";
import { ActivityIndicator, View, Text } from "react-native";
import { useState, useEffect } from "react";
import * as Db from "@/utils/db";

export default function RootLayout() {
  const [dbLoaded, setDbLoaded] = useState<boolean>(false);

  useEffect(() => {
    Db.loadDatabase()
      .then(() => {
        setDbLoaded(true);
      })
      .catch((e) => console.error("Error loading database:", e));
  }, []);

  if (!dbLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
        <Text>Loading database...</Text>
      </View>
    );
  }

  return (
    <SQLiteProvider databaseName="todos.db">
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerTitle: "Simple To-Do List",
            headerTitleAlign: "center",
          }}
        />
      </SafeAreaProvider>
    </SQLiteProvider>
  );
}
