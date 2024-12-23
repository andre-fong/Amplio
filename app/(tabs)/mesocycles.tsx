import { FlatList, StyleSheet, View } from "react-native";
import { Appbar, FAB, Portal, Text } from "react-native-paper";
import Colors from "@/constants/colors";
import { useState } from "react";
import MesocycleCard from "@/components/mesocycleCard";

const mockMesocycles: Mesocycle[] = [
  {
    id: "1",
    name: "Mesocycle 1",
    notes: "This is a test mesocycle.",
    startDate: "2021-01-01",
    endDate: "2021-01-31",
    type: "planned",
    numMicrocycles: 4,
    numSessionsPerMicrocycle: 3,
    percentFinished: 0,
  },
  {
    id: "2",
    name: "Mesocycle 2",
    startDate: "2021-02-01",
    type: "custom",
    numMicrocycles: 4,
  },
  {
    id: "3",
    name: "Mesocycle 3",
    startDate: "2021-03-01",
    endDate: "2021-03-31",
    type: "planned",
    numMicrocycles: 4,
    numSessionsPerMicrocycle: 3,
    percentFinished: 100,
  },
];

function Mesocycles() {
  const [FABOpen, setFABOpen] = useState(false);

  return (
    <Portal.Host>
      <Appbar.Header
        style={{ height: 70, backgroundColor: Colors.secondary.dark }}
      >
        <Appbar.Content
          title={
            <Text
              style={styles.headerTitle}
              variant="titleLarge"
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              Mesocycles
            </Text>
          }
        />
      </Appbar.Header>

      <View style={styles.container}>
        <FlatList
          style={{ paddingHorizontal: 10 }}
          ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
          data={mockMesocycles}
          keyExtractor={(item) => item.id}
          renderItem={({ item: meso }) => <MesocycleCard data={meso} />}
        />
      </View>

      <Portal>
        <FAB.Group
          theme={{ roundness: 3 }}
          open={FABOpen}
          visible
          icon={FABOpen ? "close" : "plus"}
          actions={[
            {
              icon: "calendar-month",
              label: "Plan mesocycle",
              onPress: () => {},
              size: "medium",
              labelStyle: { fontWeight: "bold" },
            },
            {
              icon: "pencil",
              label: "Start from scratch",
              onPress: () => {},
              size: "medium",
            },
          ]}
          onStateChange={({ open }) => setFABOpen(open)}
        />
      </Portal>
    </Portal.Host>
  );
}

export default Mesocycles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary.main,
    paddingVertical: 30,
  },
  headerTitle: {
    paddingLeft: 5,
    fontWeight: "bold",
  },
});
