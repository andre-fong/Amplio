import { Image, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function MesocycleListEmpty() {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/adaptive-icon.png")}
        style={styles.image}
      />
      <Text style={styles.title} variant="titleLarge">
        A place for your training plans
      </Text>
      <Text style={styles.subtitle} variant="titleSmall">
        Tap the + button to create a new mesocycle or plan your training
        week-by-week.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 80,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  title: {
    marginTop: -10,
    marginBottom: 20,
    paddingHorizontal: 20,
    textAlign: "center",
  },
  subtitle: {
    color: "darkgray",
    paddingHorizontal: 20,
    textAlign: "center",
    lineHeight: 25,
  },
});
