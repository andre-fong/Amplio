import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Colors from "@/constants/colors";

export default function Me() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.secondary.main,
      }}
    >
      <Text variant="titleLarge" style={{ marginBottom: 20 }}>
        Your profile is coming soon!
      </Text>
      <Text>Drop a message on Discord (@mandree) for ideas.</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
