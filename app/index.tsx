import { Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <ActivityIndicator animating={true} />
    </View>
  );
}
