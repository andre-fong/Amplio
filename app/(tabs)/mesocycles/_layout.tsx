import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { Stack } from "expo-router";
import Colors from "@/constants/colors";

export default function MesocycleLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.secondary.main }}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="newPlanned"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({});
