import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import {
  Appbar,
  Button,
  Dialog,
  FAB,
  Icon,
  Portal,
  Searchbar,
  Text,
} from "react-native-paper";
import Colors from "@/constants/colors";
import { useCallback, useState } from "react";
import MesocycleCard from "@/components/mesocycleCard";
import { useFocusEffect, useRouter } from "expo-router";
import useMesocycles from "@/hooks/useMesocycles";

// TODO: Use ISO date strings
const mockMesocycles: Mesocycle[] = [
  {
    id: 1,
    name: "Mesocycle 1",
    notes: "This is a test mesocycle.",
    startDate: "2024-01-02",
    endDate: "2024-01-31",
    type: "planned",
    numMicrocycles: 4,
    numSessionsPerMicrocycle: 3,
    percentFinished: 10,
  },
  {
    id: 2,
    name: "Mesocycle 2",
    startDate: "2021-02-01",
    type: "custom",
    numMicrocycles: 4,
  },
  {
    id: 3,
    name: "Mesocycle 3",
    startDate: "2021-03-01",
    endDate: "2021-03-31",
    type: "planned",
    numMicrocycles: 4,
    numSessionsPerMicrocycle: 3,
    percentFinished: 100,
  },
  {
    id: 4,
    name: "Mesocycle 4",
    startDate: "2021-03-01",
    endDate: "2021-03-31",
    type: "custom",
    numMicrocycles: 4,
  },
];

function Mesocycles() {
  const [FABOpen, setFABOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<null | number>(null);

  const { mesocycles, loading, refresh } = useMesocycles({ searchQuery });

  useFocusEffect(
    useCallback(() => {
      console.log("refreshing");
      refresh();
    }, [refresh])
  );
  const router = useRouter();

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
        <View
          style={{
            marginTop: -10,
            paddingHorizontal: 20,
            paddingBottom: 15,
            backgroundColor: Colors.secondary.dark,
          }}
        >
          <Searchbar
            theme={{ colors: { onSurface: "rgb(137, 124, 121)" } }}
            placeholder="Search your mesocycles"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <FlatList
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingTop: 10,
            paddingBottom: 80,
          }}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          refreshControl={
            <RefreshControl
              refreshing={loading}
              colors={[Colors.primary.light, Colors.secondary.dark]}
              progressBackgroundColor={Colors.secondary.main}
              onRefresh={refresh}
            />
          }
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          data={mesocycles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item: meso }) => (
            <MesocycleCard data={meso} onDelete={setDeleteDialogOpen} />
          )}
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
              label: "Plan a mesocycle",
              onPress: () => {
                router.push("/(tabs)/mesocycles/newPlanned");
              },
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

        <Dialog
          visible={deleteDialogOpen !== null}
          onDismiss={() => setDeleteDialogOpen(null)}
          style={{
            // backgroundColor: "rgb(65, 65, 65)",
            backgroundColor: Colors.secondary.dark,
          }}
        >
          <Dialog.Title>Delete Mesocycle</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete "
              <Text style={{ fontWeight: "bold" }}>
                {mesocycles.find((m) => m.id === deleteDialogOpen)?.name}
              </Text>
              " and all of its data?
            </Text>
            <View
              style={{
                marginTop: 18,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                padding: 7,
                borderRadius: 3,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: "gray",
              }}
            >
              <Icon source="alert-circle" size={20} color="darkgray" />
              <Text variant="bodySmall" style={{ color: "darkgray" }}>
                This action cannot be reversed.
              </Text>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              labelStyle={{ fontSize: 13, color: Colors.primary.light }}
              onPress={() => setDeleteDialogOpen(null)}
            >
              Cancel
            </Button>
            <Button
              labelStyle={{ fontSize: 13, color: Colors.primary.light }}
              onPress={() => setDeleteDialogOpen(null)}
            >
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Portal.Host>
  );
}

export default Mesocycles;

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
