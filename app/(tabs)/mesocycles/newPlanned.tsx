import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  TextInput as TextInputRN,
} from "react-native";
import {
  Appbar,
  Button,
  Divider,
  Icon,
  IconButton,
  Menu,
  Modal,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import Colors from "@/constants/colors";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import ExerciseSelectBottomSheet from "@/components/exerciseSelectBottomSheet";
import MuscleSelectBottomSheet from "@/components/muscleSelectBottomSheet";

export default function NewPlannedMesocycle() {
  const router = useRouter();

  const [mesocycleTitle, setMesocycleTitle] = useState("");
  const [mesocycleNotes, setMesocycleNotes] = useState("");
  const [mesocycleNotesSaved, setMesocycleNotesSaved] = useState("");
  const [mesocycleOptionsOpen, setMesocycleOptionsOpen] = useState(false);
  const [mesocycleNotesOpen, setMesocycleNotesOpen] = useState(false);

  const mesoNotesRef = useRef<TextInputRN | null>(null);

  useEffect(() => {
    setTimeout(() => {
      if (mesocycleNotesOpen && mesoNotesRef.current) {
        mesoNotesRef.current?.focus();
      }
    }, 150);
  }, [mesocycleNotesOpen]);

  function handleMesoNotesCancel() {
    setMesocycleNotes(mesocycleNotesSaved);
    setMesocycleNotesOpen(false);
  }

  function handleMesoNotesSave() {
    setMesocycleNotesSaved(mesocycleNotes);
    setMesocycleNotesOpen(false);
  }

  function handleMesoNotesClear() {
    setMesocycleNotes("");
    if (mesoNotesRef.current) {
      mesoNotesRef.current?.clear();
    }
  }

  const [muscleGroupListOpen, setMuscleGroupListOpen] = useState(false);
  const [exercisesListOpen, setExercisesListOpen] = useState(false);

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

      <ScrollView style={styles.container}>
        <View style={styles.mesoMainInfo}>
          <View style={styles.mesoInfoTopRow}>
            <View style={styles.mesoName}>
              <TextInput
                value={mesocycleTitle}
                onChangeText={setMesocycleTitle}
                placeholder="Untitled Mesocycle"
              />
            </View>

            <View style={styles.mesoInfoTopButtons}>
              <Menu
                visible={mesocycleOptionsOpen}
                onDismiss={() => setMesocycleOptionsOpen(false)}
                anchor={
                  <IconButton
                    icon="dots-vertical"
                    size={32}
                    onPress={() => {
                      setMesocycleOptionsOpen(true);
                    }}
                    style={{ marginTop: -2, marginRight: -5 }}
                  />
                }
                anchorPosition="bottom"
                mode="elevated"
                elevation={5}
              >
                {/* <Menu.Item
                  leadingIcon="tag"
                  onPress={() => {}}
                  title="Change session name"
                />
                <Divider
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                  bold
                /> */}
                <Menu.Item
                  leadingIcon={({ size }) => (
                    <Icon
                      source="delete"
                      color={Colors.primary.light}
                      size={size}
                    />
                  )}
                  onPress={() => {}}
                  title="Delete mesocycle"
                  titleStyle={{
                    color: Colors.primary.light,
                    filter: "brightness(2)",
                  }}
                />
              </Menu>
            </View>
          </View>

          <Pressable
            style={styles.mesoInfoNotes}
            onPress={() => {
              setMesocycleNotesOpen(true);
            }}
          >
            <Icon source="pencil" size={24} color={Colors.accent.main} />
            <Text
              variant="bodySmall"
              style={{
                color: Colors.accent.light,
                flex: 1,
                flexWrap: "wrap",
              }}
            >
              {mesocycleNotesSaved ? (
                mesocycleNotesSaved
              ) : (
                <Text
                  variant="bodySmall"
                  style={{ color: Colors.accent.dark, fontStyle: "italic" }}
                >
                  Add notes...
                </Text>
              )}
            </Text>
          </Pressable>
        </View>

        <View style={styles.sessionContainer}>
          <View style={styles.mesoInfoTopRow}>
            <View style={styles.sessionName}>
              <TextInput
                style={{ height: 42 }}
                contentStyle={{ fontSize: 14 }}
                // value={mesocycleTitle}
                // onChangeText={setMesocycleTitle}
                // placeholder="Untitled Mesocycle"
              />
            </View>

            <IconButton
              style={{ filter: "brightness(2)" }}
              icon={() => (
                <Icon source="delete" color={Colors.primary.light} size={24} />
              )}
              onPress={() => {}}
            />
          </View>

          <Button
            style={{ marginTop: 10 }}
            labelStyle={{ fontSize: 13, color: Colors.primary.light }}
            onPress={() => {
              setMuscleGroupListOpen(true);
            }}
            icon={() => (
              <Icon source="plus" size={24} color={Colors.primary.light} />
            )}
          >
            ADD A MUSCLE GROUP
          </Button>
        </View>

        <View style={{ margin: 10, height: 50, marginBottom: 30 }}>
          <Button
            style={styles.addSessionButton}
            contentStyle={{ height: "100%" }}
            icon={() => <Icon source="plus" size={24} color="darkgray" />}
            labelStyle={{ color: "darkgray" }}
            onPress={() => {}}
            rippleColor="#424242"
          >
            ADD SESSION
          </Button>
        </View>
      </ScrollView>

      <MuscleSelectBottomSheet
        open={muscleGroupListOpen}
        setOpen={setMuscleGroupListOpen}
        onMuscleGroupSelect={() => {}}
      />

      <ExerciseSelectBottomSheet
        open={exercisesListOpen}
        setOpen={setExercisesListOpen}
        onExerciseSelect={() => {}}
      />

      <Portal>
        <Modal
          visible={mesocycleNotesOpen}
          onDismiss={handleMesoNotesCancel}
          contentContainerStyle={{
            backgroundColor: "rgb(65, 65, 65)",
            padding: 20,
            margin: 20,
            borderRadius: 3,
          }}
        >
          <Text variant="titleMedium" style={{ marginBottom: 20 }}>
            {!mesocycleNotesSaved ? "Add session note" : "Edit session note"}
          </Text>

          <TextInput
            label="Session notes"
            defaultValue={mesocycleNotes}
            ref={mesoNotesRef}
            onChangeText={setMesocycleNotes}
            multiline
            right={
              <TextInput.Icon
                icon="close"
                size={20}
                onPress={handleMesoNotesClear}
              />
            }
            numberOfLines={4}
            contentStyle={{ marginVertical: 5 }}
            theme={{ colors: { surfaceVariant: Colors.secondary.light } }}
          />

          <View style={styles.mesoNotesButtons}>
            <Button
              labelStyle={{ color: Colors.accent.main }}
              onPress={handleMesoNotesCancel}
            >
              Cancel
            </Button>
            <Button
              labelStyle={{ color: "black" }}
              contentStyle={{ backgroundColor: Colors.accent.dark }}
              mode="contained"
              onPress={handleMesoNotesSave}
            >
              Save
            </Button>
          </View>
        </Modal>
      </Portal>
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
  mesoMainInfo: {
    margin: 10,
    backgroundColor: Colors.secondary.light,
    padding: 15,
    borderRadius: 3,
  },
  mesoName: {
    flex: 1,
  },
  mesoInfoTopRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    marginBottom: 8,
  },
  mesoInfoTopButtons: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  mesoInfoNotes: {
    marginVertical: 12,
    padding: 7,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.accent.dark,
  },
  mesoNotesButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 15,
  },

  sessionContainer: {
    margin: 10,
    backgroundColor: Colors.secondary.light,
    padding: 15,
    borderRadius: 3,
  },
  sessionName: {
    flex: 0.8,
  },
  addSessionButton: {
    margin: "auto",
    width: "100%",
    backgroundColor: Colors.secondary.light,
    borderRadius: 3,
  },
});
