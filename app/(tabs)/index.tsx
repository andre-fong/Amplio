import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  FlatList,
} from "react-native";
import {
  Appbar,
  Text,
  Button,
  IconButton,
  Menu,
  Divider,
  Icon,
  Chip,
  Portal,
  Modal,
  TextInput,
  Checkbox,
  Tooltip,
} from "react-native-paper";
import Colors from "@/constants/colors";
import { useState } from "react";

// TODO: Replace with real data
const mockData = {
  mesoName: "Chest Emphasis 2024",
  microNum: 1,
  dayNum: 3,
  sessionName: "Push",
  sessionNotes: "This was a great session, I felt strong and energized!",
  deload: false,
  current: true,
  muscles: ["Chest", "Triceps", "Shoulders", "Quads", "Calves", "Biceps"],
  sessionDate: "2021-09-01",
  plannedExercises: [
    {
      target: "Chest",
      notes: "Focus on the stretch at the bottom",
      name: "Bench Press",
      order: 1,
      equipment: "Barbell",
      plannedSets: [
        {
          id: 1,
          type: null,
          parentId: null,
          weight: 135,
          prevWeight: 135,
          reps: 10,
          prevReps: 9,
          logged: false,
          order: 1,
        },
        {
          id: 2,
          type: null,
          parentId: null,
          weight: 185,
          prevWeight: 185,
          reps: 3,
          prevReps: 3,
          logged: false,
          order: 2,
        },
        {
          id: 3,
          type: null,
          parentId: null,
          weight: 225,
          prevWeight: 215,
          reps: 1,
          prevReps: 1,
          logged: false,
          order: 3,
        },
      ],
    },
  ],
};

export default function Logs() {
  const [mesocycleOptionsOpen, setMesocycleOptionsOpen] = useState(false);
  const [sessionOptionsOpen, setSessionOptionsOpen] = useState(false);
  const [sessionNotesOpen, setSessionNotesOpen] = useState(false);
  // TODO: Replace with exercise id for which options are open
  const [selectedExerciseOptions, setSelectedExerciseOptions] = useState(false);
  // TODO: Replace with set id for which options are open
  const [selectedSetOptions, setSelectedSetOptions] = useState(false);

  const [sessionNotes, setSessionNotes] = useState(mockData.sessionNotes);
  const [sessionNotesEditValue, setSessionNotesEditValue] = useState(
    mockData.sessionNotes
  );
  const [sessionIsDeload, setSessionIsDeload] = useState(mockData.deload);

  function handleSessionNotesCancel() {
    setSessionNotesEditValue(sessionNotes);
    setSessionNotesOpen(false);
  }

  function handleSessionNotesSave() {
    setSessionNotes(sessionNotesEditValue);
    setSessionNotesOpen(false);
  }

  function handleDeloadToggle() {
    setSessionIsDeload((prev) => !prev);
    setSessionOptionsOpen(false);
  }

  return (
    <>
      <Appbar.Header
        style={{ height: 80, backgroundColor: Colors.secondary.dark }}
      >
        {/* <Appbar.BackAction onPress={() => {}} /> */}
        <Appbar.Content title="Logs" style={{ display: "none" }} />
        <View style={styles.headerTitleSubtitle}>
          <Pressable onPress={() => {}}>
            <Text
              style={styles.headerTitle}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {mockData.mesoName}
            </Text>
          </Pressable>
          <Text style={styles.headerSubtitle}>
            Microcycle #
            <Text style={styles.headerSubtitleBold}>{mockData.microNum}</Text>,
            Day <Text style={styles.headerSubtitleBold}>{mockData.dayNum}</Text>
          </Text>
        </View>
        <Menu
          visible={mesocycleOptionsOpen}
          onDismiss={() => setMesocycleOptionsOpen(false)}
          anchor={
            <Appbar.Action
              icon="dots-vertical"
              onPress={() => {
                setMesocycleOptionsOpen(true);
              }}
            />
          }
          anchorPosition="bottom"
          mode="elevated"
          elevation={5}
        >
          <Menu.Item
            leadingIcon="comment-processing"
            onPress={() => {}}
            title="Add mesocycle note"
          />
          <Menu.Item
            leadingIcon="pencil"
            onPress={() => {}}
            title="Change mesocycle name"
          />
          <Divider
            style={{
              marginTop: 10,
              marginBottom: 10,
            }}
            bold
          />
          <Menu.Item
            leadingIcon={({ size }) => (
              <Icon source="delete" color={Colors.primary.light} size={size} />
            )}
            onPress={() => {}}
            title="Delete mesocycle"
            titleStyle={{
              color: Colors.primary.light,
              filter: "brightness(2)",
            }}
          />
        </Menu>
      </Appbar.Header>

      {/* ///////////////////////// PAGE DESIGN BELOW /////////////////////////// */}

      <ScrollView style={styles.sessionContainer}>
        <View style={styles.sessionMainInfo}>
          <View style={styles.sessionInfoTopRow}>
            <View>
              <Text style={styles.sessionName} variant="headlineMedium">
                {mockData.sessionName}
                {sessionIsDeload && (
                  <Text style={styles.sessionDeload}>
                    {"  "}
                    (DELOAD)
                  </Text>
                )}
              </Text>
            </View>

            <View style={styles.sessionInfoTopButtons}>
              <Button
                mode={mockData.current ? "outlined" : "contained"}
                dark
                compact
                labelStyle={{ fontSize: 12, marginTop: 6 }}
                contentStyle={{
                  height: 36,
                }}
                buttonColor={
                  mockData.current ? "transparent" : Colors.info.dark
                }
                textColor="white"
                disabled={mockData.current}
              >
                {mockData.current ? "Current" : "Go to current"}
              </Button>

              <Menu
                visible={sessionOptionsOpen}
                onDismiss={() => setSessionOptionsOpen(false)}
                anchor={
                  <IconButton
                    icon="dots-vertical"
                    size={28}
                    onPress={() => {
                      setSessionOptionsOpen(true);
                    }}
                    style={{ marginTop: -2, marginRight: -5 }}
                  />
                }
                anchorPosition="bottom"
                mode="elevated"
                elevation={5}
              >
                <Menu.Item
                  leadingIcon="comment-processing"
                  onPress={() => {
                    setSessionNotesOpen(true);
                    setSessionOptionsOpen(false);
                  }}
                  title={
                    !mockData.sessionNotes
                      ? "Add session note"
                      : "Edit session note"
                  }
                />
                <Menu.Item
                  leadingIcon="pencil"
                  onPress={() => {}}
                  title="Change session name"
                />
                <Menu.Item
                  leadingIcon="heart-pulse"
                  onPress={() => {
                    handleDeloadToggle();
                  }}
                  title={
                    sessionIsDeload
                      ? "Unmark session as deload"
                      : "Mark session as deload"
                  }
                />
                <Divider
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                  bold
                />
                <Menu.Item
                  leadingIcon={({ size }) => (
                    <Icon
                      source="delete"
                      color={Colors.primary.light}
                      size={size}
                    />
                  )}
                  onPress={() => {}}
                  title="Clear this session's data"
                  titleStyle={{
                    fontSize: 14,
                    color: Colors.primary.light,
                    filter: "brightness(2)",
                  }}
                />
              </Menu>
            </View>
          </View>

          {mockData.sessionNotes && (
            <Pressable
              style={styles.sessionInfoNotes}
              onPress={() => {
                setSessionNotesOpen(true);
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
                {sessionNotes}
              </Text>
            </Pressable>
          )}

          <View style={styles.sessionInfoMuscleGroups}>
            {mockData.muscles.map((muscleGroup) => (
              // TODO: Add muscle group colors
              <Chip
                compact
                style={{
                  backgroundColor: "rgba(222, 0, 0, 0.5)",
                  // backgroundColor: Colors.primary.dark,
                  filter: "brightness(1.1)",
                }}
                textStyle={{
                  color: "white",
                  opacity: 0.7,
                }}
                key={muscleGroup}
              >
                {muscleGroup.toUpperCase()}
              </Chip>
            ))}
          </View>

          <View>
            {/* TODO: Datepicker */}
            <Text>Date: 12/14/2024</Text>
          </View>
        </View>

        <View style={styles.exerciseContainer}>
          <Chip
            compact
            style={{
              backgroundColor: "rgba(222, 0, 0, 0.5)",
              // backgroundColor: Colors.primary.dark,
              filter: "brightness(1.1)",
              position: "absolute",
              left: 10,
              top: -15,
            }}
            textStyle={{
              color: "white",
              opacity: 0.7,
              fontSize: 13,
            }}
          >
            {mockData.plannedExercises[0].target.toUpperCase()}
          </Chip>
          <View style={styles.exerciseHeader}>
            <View style={{ marginTop: 12 }}>
              <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
                {mockData.plannedExercises[0].name}
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: "darkgray", marginTop: 3 }}
              >
                {mockData.plannedExercises[0].equipment.toUpperCase()}
              </Text>
            </View>
            <View style={styles.exerciseActions}>
              <IconButton
                icon="history"
                size={30}
                onPress={() => {}}
                mode="contained-tonal"
              />
              <IconButton
                icon="comment-processing"
                size={24}
                theme={{ colors: { primary: Colors.accent.light } }}
                onPress={() => {}}
              />

              <Menu
                visible={selectedExerciseOptions}
                onDismiss={() => setSelectedExerciseOptions(false)}
                anchor={
                  <IconButton
                    icon="dots-vertical"
                    size={24}
                    onPress={() => {
                      setSelectedExerciseOptions(true);
                    }}
                  />
                }
                anchorPosition="bottom"
                mode="elevated"
                elevation={5}
              >
                <Menu.Item
                  leadingIcon="file-search"
                  onPress={() => {}}
                  title="Replace exercise"
                />
                <Menu.Item
                  leadingIcon="arrow-up"
                  onPress={() => {}}
                  title="Move exercise up"
                />
                <Menu.Item
                  leadingIcon="arrow-down"
                  onPress={() => {}}
                  title="Move exercise down"
                />
                <Divider
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                  bold
                />
                <Menu.Item
                  leadingIcon={({ size }) => (
                    <Icon
                      source="delete"
                      color={Colors.primary.light}
                      size={size}
                    />
                  )}
                  onPress={() => {}}
                  title="Delete exercise"
                  titleStyle={{
                    color: Colors.primary.light,
                    filter: "brightness(2)",
                  }}
                />
              </Menu>
            </View>
          </View>

          {mockData.sessionNotes && (
            <Pressable style={styles.exerciseNotes} onPress={() => {}}>
              <Icon source="pencil" size={24} color={Colors.accent.main} />
              <Text
                variant="bodySmall"
                style={{
                  color: Colors.accent.light,
                  flex: 1,
                  flexWrap: "wrap",
                }}
              >
                {mockData.plannedExercises[0].notes}
              </Text>
            </Pressable>
          )}

          <View style={styles.setsContainer}>
            <View style={styles.setsLabelRow}>
              <View style={{ flex: 0.5 }} />
              <Text
                style={{ flex: 3, textAlign: "center" }}
                variant="bodyMedium"
              >
                WEIGHT
              </Text>
              <Text
                style={{ flex: 3, textAlign: "center" }}
                variant="bodyMedium"
              >
                REPS
              </Text>
              <Text
                style={{ flex: 1.5, textAlign: "center" }}
                variant="bodyMedium"
              >
                LOG
              </Text>
              <View style={{ flex: 1 }} />
            </View>

            <View style={styles.setsRow}>
              <View style={{ flex: 0.5 }}>
                <Tooltip
                  title="Drop set"
                  theme={{
                    colors: {
                      surface: "white",
                      onSurface: Colors.secondary.dark,
                    },
                  }}
                >
                  <Text variant="bodySmall" style={styles.setType}>
                    DS
                  </Text>
                </Tooltip>
              </View>
              <View style={{ flex: 3 }}>
                <TextInput
                  maxLength={4}
                  keyboardType="numeric"
                  placeholder="lbs"
                  placeholderTextColor="gray"
                  dense
                  style={styles.setsInput}
                  underlineColor="transparent"
                  theme={{ colors: { surfaceVariant: Colors.secondary.main } }}
                />
              </View>

              <View style={{ flex: 3 }}>
                <TextInput
                  maxLength={4}
                  keyboardType="numeric"
                  dense
                  style={styles.setsInput}
                  underlineColor="transparent"
                  theme={{ colors: { surfaceVariant: Colors.secondary.main } }}
                />
              </View>
              <View style={{ flex: 1.5 }}>
                <View style={{ alignItems: "center" }}>
                  <Checkbox status="unchecked" onPress={() => {}} />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Menu
                  visible={selectedSetOptions}
                  onDismiss={() => setSelectedSetOptions(false)}
                  anchor={
                    <IconButton
                      icon="dots-vertical"
                      size={24}
                      onPress={() => {
                        setSelectedSetOptions(true);
                      }}
                    />
                  }
                  anchorPosition="bottom"
                  mode="elevated"
                  elevation={5}
                >
                  <Menu.Item
                    leadingIcon="dumbbell"
                    onPress={() => {}}
                    title="Change set type"
                  />
                  <Menu.Item
                    leadingIcon="plus"
                    onPress={() => {}}
                    title="Add drop set"
                  />
                  <Menu.Item
                    leadingIcon="arrow-up"
                    onPress={() => {}}
                    title="Move set up"
                  />
                  <Menu.Item
                    leadingIcon="arrow-down"
                    onPress={() => {}}
                    title="Move set down"
                  />
                  <Divider
                    style={{
                      marginTop: 10,
                      marginBottom: 10,
                    }}
                    bold
                  />
                  <Menu.Item
                    leadingIcon={({ size }) => (
                      <Icon
                        source="delete"
                        color={Colors.primary.light}
                        size={size}
                      />
                    )}
                    onPress={() => {}}
                    title="Delete set"
                    titleStyle={{
                      color: Colors.primary.light,
                      filter: "brightness(2)",
                    }}
                  />
                </Menu>
              </View>
            </View>

            <View style={styles.setsRow}>
              <View style={{ flex: 0.5 }}>
                <Tooltip
                  title="Drop set"
                  theme={{
                    colors: {
                      surface: "white",
                      onSurface: Colors.secondary.dark,
                    },
                  }}
                >
                  <Icon source="arrow-down" size={20} color="darkgray" />
                </Tooltip>
              </View>
              <View style={{ flex: 3 }}>
                <TextInput
                  maxLength={4}
                  keyboardType="numeric"
                  placeholder="lbs"
                  placeholderTextColor="gray"
                  dense
                  style={styles.setsInput}
                  underlineColor="transparent"
                  theme={{ colors: { surfaceVariant: Colors.secondary.main } }}
                />
              </View>

              <View style={{ flex: 3 }}>
                <TextInput
                  maxLength={4}
                  keyboardType="numeric"
                  dense
                  style={styles.setsInput}
                  underlineColor="transparent"
                  theme={{ colors: { surfaceVariant: Colors.secondary.main } }}
                />
              </View>
              <View style={{ flex: 1.5 }}>
                <View style={{ alignItems: "center" }}>
                  <Checkbox status="unchecked" onPress={() => {}} />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Menu
                  visible={selectedSetOptions}
                  onDismiss={() => setSelectedSetOptions(false)}
                  anchor={
                    <IconButton
                      icon="dots-vertical"
                      size={24}
                      onPress={() => {
                        // setSelectedSetOptions(true);
                      }}
                    />
                  }
                  anchorPosition="bottom"
                  mode="elevated"
                  elevation={5}
                >
                  <Menu.Item
                    leadingIcon="dumbbell"
                    onPress={() => {}}
                    title="Change set type"
                  />
                  <Menu.Item
                    leadingIcon="plus"
                    onPress={() => {}}
                    title="Add drop set"
                  />
                  <Menu.Item
                    leadingIcon="arrow-up"
                    onPress={() => {}}
                    title="Move set up"
                  />
                  <Menu.Item
                    leadingIcon="arrow-down"
                    onPress={() => {}}
                    title="Move set down"
                  />
                  <Divider
                    style={{
                      marginTop: 10,
                      marginBottom: 10,
                    }}
                    bold
                  />
                  <Menu.Item
                    leadingIcon={({ size }) => (
                      <Icon
                        source="delete"
                        color={Colors.primary.light}
                        size={size}
                      />
                    )}
                    onPress={() => {}}
                    title="Delete set"
                    titleStyle={{
                      color: Colors.primary.light,
                      filter: "brightness(2)",
                    }}
                  />
                </Menu>
              </View>
            </View>

            <Button
              icon={() => (
                <Icon source="plus" size={24} color={Colors.primary.main} />
              )}
              compact
              style={{ width: "100%", margin: "auto" }}
              labelStyle={{ fontSize: 13, filter: "brightness(1.1)" }}
              onPress={() => {}}
            >
              ADD SET
            </Button>
          </View>
        </View>

        <View style={{ margin: 10, height: 50, marginBottom: 30 }}>
          <Button
            style={styles.addExerciseButton}
            contentStyle={{ height: "100%" }}
            icon={() => <Icon source="plus" size={24} color="gray" />}
            labelStyle={{ color: "gray" }}
            onPress={() => {}}
            rippleColor="#424242"
          >
            ADD EXERCISE
          </Button>
        </View>
      </ScrollView>

      <Portal>
        <Modal
          visible={sessionNotesOpen}
          onDismiss={handleSessionNotesCancel}
          contentContainerStyle={{
            backgroundColor: Colors.secondary.dark,
            padding: 20,
            margin: 20,
            borderRadius: 3,
          }}
        >
          <Text variant="titleLarge" style={{ marginBottom: 20 }}>
            {!sessionNotes ? "Add session note" : "Edit session note"}
          </Text>

          <TextInput
            label="Session notes"
            defaultValue={sessionNotes}
            onChangeText={(text) => setSessionNotesEditValue(text)}
            multiline
            numberOfLines={4}
            contentStyle={{ marginVertical: 5 }}
            theme={{ colors: { primary: Colors.accent.main } }}
          />

          <View style={styles.sessionNotesButtons}>
            <Button onPress={handleSessionNotesCancel}>Cancel</Button>
            <Button onPress={handleSessionNotesSave}>Save</Button>
          </View>
        </Modal>
      </Portal>
    </>
  );
}

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
  headerSubtitleBold: {
    fontSize: 14,
    fontWeight: "bold",
  },

  sessionContainer: {
    backgroundColor: Colors.secondary.main,
    height: "100%",
  },
  sessionMainInfo: {
    margin: 10,
    marginTop: 20,
    backgroundColor: Colors.secondary.light,
    padding: 15,
    borderRadius: 3,
  },
  sessionInfoMesoName: {
    color: "darkgray",
    marginBottom: 5,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  sessionName: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  sessionInfoTopRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 8,
  },
  sessionInfoTopButtons: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  sessionInfoNotes: {
    marginBottom: 12,
    padding: 7,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.accent.dark,
  },
  sessionInfoMuscleGroups: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  sessionDeload: {
    color: "darkgray",
    fontSize: 14,
  },
  sessionNotesButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 10,
  },

  exerciseContainer: {
    position: "relative",
    margin: 10,
    marginTop: 25,
    backgroundColor: Colors.secondary.light,
    padding: 15,
    paddingBottom: 3,
    borderRadius: 3,
  },
  exerciseHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  exerciseActions: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  exerciseNotes: {
    marginBottom: 12,
    padding: 7,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.accent.dark,
  },
  addExerciseButton: {
    margin: "auto",
    width: "100%",
    backgroundColor: Colors.secondary.light,
    borderRadius: 3,
  },

  setsContainer: {
    marginTop: 10,
    marginBottom: 10,
    paddingRight: 5,
  },
  setsLabelRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  setsRow: {
    marginVertical: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  setsInput: {
    width: "80%",
    margin: "auto",
    textAlign: "center",
  },
  setType: {
    textAlign: "center",
    color: "darkgray",
  },
});
