import { StyleSheet, View } from "react-native";
import { Appbar, Portal, Text } from "react-native-paper";
import Colors from "@/constants/colors";
import { useRouter } from "expo-router";

export default function NewPlannedMesocycle() {
  const router = useRouter();

  return (
    <Portal.Host>
      <Appbar.Header
        style={{ height: 70, backgroundColor: Colors.secondary.dark }}
      >
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content
          title={
            <Text
              style={styles.headerTitle}
              variant="titleLarge"
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              Plan a Mesocycle
            </Text>
          }
        />
      </Appbar.Header>

      <View style={styles.container}></View>
    </Portal.Host>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary.main,
  },
  headerTitle: {
    paddingLeft: 5,
    fontWeight: "bold",
  },
});
