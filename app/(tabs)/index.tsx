import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Appbar } from "react-native-paper";
import Colors from "@/constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";

const mockData = {
  mesoName: "Meso 1",
  microNum: 1,
  dayNum: 3,
  sessionName: "Push",
  deload: false,
  current: false,
  muscleGroups: ["Chest", "Triceps", "Shoulders"],
  sessionDate: "2021-09-01",
};

const Logs = () => {
  return (
    <>
      <Appbar.Header
        style={{ height: 80, backgroundColor: Colors.secondary.dark }}
      >
        {/* <Appbar.BackAction onPress={() => {}} /> */}
        <Appbar.Content title="Logs" style={{ display: "none" }} />
        <View style={styles.headerTitleSubtitle}>
          <Pressable onPress={() => {}}>
            <Text style={styles.headerTitle}>{mockData.mesoName}</Text>
          </Pressable>
          <Text style={styles.headerSubtitle}>
            Microcycle #{mockData.microNum}, Day {mockData.dayNum}
          </Text>
        </View>
        <Appbar.Action icon="dots-vertical" onPress={() => {}} />
      </Appbar.Header>

      <SafeAreaView style={styles.main}>
        <ScrollView>
          <Text>Hello</Text>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Logs;

const styles = StyleSheet.create({
  headerTitleSubtitle: {
    flex: 1,
    paddingLeft: 20,
  },
  headerTitle: {
    fontSize: 20,
    color: "white",
    fontWeight: "600",
    marginBottom: 3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "white",
    opacity: 0.8,
  },

  main: {
    backgroundColor: Colors.secondary.main,
    height: "100%",
  },
});
