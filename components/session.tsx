import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  FlatList,
  useWindowDimensions,
  TextInput as TextInputRN,
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
  TouchableRipple,
  List,
} from "react-native-paper";
import Colors from "@/constants/colors";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { getFullSetType } from "@/utils/set";
import { Calendar, DateData } from "react-native-calendars";
import { getCalendarDateString } from "react-native-calendars/src/services";

export default function Session({
  data: session,
  setSelectedSetOptions,
  setOpen,
}: {
  data: Session;
  setSelectedSetOptions: (options: {
    exerciseId: number;
    setOrder: number;
  }) => void;
  setOpen: (open: boolean) => void;
}) {
  ///////////// DATA //////////////
  const { width } = useWindowDimensions();

  const [sessionNotes, setSessionNotes] = useState(session.notes);
  const [sessionNotesEditValue, setSessionNotesEditValue] = useState(
    session.notes
  );

  const sessionMuscleGroups = useMemo(() => {
    const muscleGroupMap = new Map<string, MuscleGroup>();
    for (const exercise of session.exercises) {
      muscleGroupMap.set(exercise.targetMuscle.name, exercise.targetMuscle);
    }
    return Array.from(muscleGroupMap.values());
  }, [session.exercises]);

  const sessionIsCurrent =
    new Date().getTime() === new Date(session.date).getTime();

  const minDate = useMemo(() => {
    return getCalendarDateString(session.meso.startDate);
  }, [session.meso.startDate]);
  const maxDate = useMemo(() => {
    return getCalendarDateString(session.meso.endDate);
  }, [session.meso.endDate]);

  ///////////// FORM STATE /////////////
  const [sessionNotesOpen, setSessionNotesOpen] = useState(false);
  const [sessionOptionsOpen, setSessionOptionsOpen] = useState(false);
  const [selectedExerciseOptions, setSelectedExerciseOptions] = useState<
    number | null
  >(null);

  const sessionNotesRef = useRef<TextInputRN | null>(null);

  function handleSessionNotesCancel() {
    setSessionNotesEditValue(sessionNotes);
    setSessionNotesOpen(false);
  }

  function handleSessionNotesSave() {
    setSessionNotes(sessionNotesEditValue);
    setSessionNotesOpen(false);
  }

  function handleSessionNotesClear() {
    setSessionNotesEditValue("");
    if (sessionNotesRef.current) {
      sessionNotesRef.current?.clear();
    }
  }

  const [selectedDate, setSelectedDate] = useState<string>(
    getCalendarDateString(session.date)
  );
  const formattedDate = useMemo(() => {
    const userTimezoneOffset = new Date().getTimezoneOffset() * 60000;
    return new Date(
      new Date(selectedDate).getTime() + userTimezoneOffset
    ).toLocaleDateString(undefined, {
      year: "numeric",
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }, [selectedDate]);

  const onDayPress = useCallback((day: DateData) => {
    setSelectedDate(day.dateString);
  }, []);

  const marked = useMemo(() => {
    return {
      [selectedDate]: {
        selected: true,
        disableTouchEvent: true,
      },
    };
  }, [selectedDate]);

  const exerciseItemKeyExtractor = useCallback(
    (item: PlannedExercise) => item.id.toString(),
    []
  );

  const renderExerciseItem = useCallback(
    ({ item: plannedExercise }: { item: PlannedExercise }) => (
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
          {plannedExercise.targetMuscle.name.toUpperCase()}
        </Chip>
        <View style={styles.exerciseHeader}>
          {/* TODO: Link to exercise history */}
          <Pressable style={{ marginTop: 12, flex: 1 }}>
            <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
              {plannedExercise.name}
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: "darkgray", marginTop: 5 }}
            >
              {plannedExercise.equipment.toUpperCase()}
            </Text>
          </Pressable>
          <View style={styles.exerciseActions}>
            <IconButton
              icon="comment-processing"
              size={24}
              theme={{ colors: { primary: Colors.accent.light } }}
              onPress={() => {}}
            />

            <Menu
              visible={selectedExerciseOptions === plannedExercise.id}
              onDismiss={() => setSelectedExerciseOptions(null)}
              anchor={
                <IconButton
                  icon="dots-vertical"
                  size={24}
                  onPress={() => {
                    setSelectedExerciseOptions(plannedExercise.id);
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
              {plannedExercise.exerciseOrder > 1 && (
                <Menu.Item
                  leadingIcon="arrow-up"
                  onPress={() => {}}
                  title="Move exercise up"
                />
              )}

              {plannedExercise.exerciseOrder < session.exercises.length && (
                <Menu.Item
                  leadingIcon="arrow-down"
                  onPress={() => {}}
                  title="Move exercise down"
                />
              )}
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

        {plannedExercise.notes && (
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
              {plannedExercise.notes}
            </Text>
          </Pressable>
        )}

        <View style={styles.setsContainer}>
          <View style={styles.setsLabelRow}>
            <View style={{ flex: 0.5 }} />
            <Text style={{ flex: 3, textAlign: "center" }} variant="bodyMedium">
              WEIGHT
            </Text>
            <Text style={{ flex: 3, textAlign: "center" }} variant="bodyMedium">
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

          {plannedExercise.plannedSets.map((plannedSet) => (
            <View style={styles.setsRow} key={plannedSet.setOrder}>
              <View style={{ flex: 0.5 }}>
                {!!plannedSet.type && (
                  <Tooltip
                    title={getFullSetType(plannedSet.type)}
                    theme={{
                      colors: {
                        surface: "white",
                        onSurface: Colors.secondary.dark,
                      },
                    }}
                  >
                    <Text variant="bodySmall" style={styles.setType}>
                      {plannedSet.type}
                    </Text>
                  </Tooltip>
                )}
              </View>
              {/* TODO: Maybe change font family */}
              <View style={{ flex: 3 }}>
                <TextInput
                  multiline
                  maxLength={4}
                  defaultValue={plannedSet.weight?.toString()}
                  placeholder={plannedSet.prevWeight?.toString()}
                  keyboardType="numeric"
                  inputMode="numeric"
                  textContentType="none"
                  placeholderTextColor="gray"
                  dense
                  style={styles.setsInput}
                  underlineColor="transparent"
                  theme={{
                    colors: {
                      surfaceVariant: Colors.secondary.main,
                    },
                  }}
                />
              </View>

              <View style={{ flex: 3 }}>
                <TextInput
                  multiline
                  maxLength={4}
                  defaultValue={plannedSet.reps?.toString()}
                  placeholder={plannedSet.prevReps?.toString()}
                  keyboardType="numeric"
                  inputMode="numeric"
                  textContentType="none"
                  placeholderTextColor="gray"
                  dense
                  style={styles.setsInput}
                  underlineColor="transparent"
                  theme={{
                    colors: {
                      surfaceVariant: Colors.secondary.main,
                    },
                  }}
                />
              </View>
              <View style={{ flex: 1.5 }}>
                <View style={{ alignItems: "center" }}>
                  <Checkbox
                    status={plannedSet.logged ? "checked" : "unchecked"}
                    color={Colors.primary.light}
                    onPress={() => {}}
                  />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <IconButton
                  icon="dots-vertical"
                  size={24}
                  onPress={() => {
                    setSelectedSetOptions({
                      exerciseId: plannedExercise.id,
                      setOrder: plannedSet.setOrder,
                    });
                  }}
                />
              </View>
            </View>
          ))}

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
    ),
    [session.exercises, setSelectedSetOptions, selectedExerciseOptions]
  );

  return (
    <>
      <ScrollView style={{ width, flex: 1, paddingBottom: 30 }}>
        <View style={styles.sessionMainInfo}>
          <View style={styles.sessionInfoTopRow}>
            <View>
              <Text style={styles.sessionName} variant="headlineMedium">
                {session.name}
                {session.deload && (
                  <Text style={styles.sessionDeload}>
                    {"  "}
                    (DELOAD)
                  </Text>
                )}
              </Text>
            </View>

            <View style={styles.sessionInfoTopButtons}>
              <Button
                mode={sessionIsCurrent ? "outlined" : "contained"}
                dark
                compact
                labelStyle={{ fontSize: 12, marginTop: 6 }}
                contentStyle={{
                  height: 36,
                }}
                buttonColor={
                  sessionIsCurrent ? "transparent" : Colors.info.dark
                }
                textColor="white"
                disabled={sessionIsCurrent}
              >
                {sessionIsCurrent ? "Current" : "Go to current"}
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
                    !session.notes ? "Add session note" : "Edit session note"
                  }
                />
                <Menu.Item
                  leadingIcon="tag"
                  onPress={() => {}}
                  title="Change session name"
                />
                <Menu.Item
                  leadingIcon="heart-pulse"
                  onPress={() => {}}
                  title={
                    // session.deload
                    //   ? "Unmark session as deload"
                    //   : "Mark session as deload"
                    <Text>
                      {session.deload ? "Unmark" : "Mark"} session as deload
                    </Text>
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

          {session.notes && (
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
            {sessionMuscleGroups.map((muscleGroup) => (
              // TODO: Add muscle group colors
              <Chip
                compact
                style={{
                  // TODO: Set muscle group colors once they're not ugly
                  backgroundColor: "rgba(222, 0, 0, 0.5)",
                  filter: "brightness(1.1)",
                }}
                textStyle={{
                  color: "white",
                  opacity: 0.7,
                }}
                key={muscleGroup.name}
              >
                {muscleGroup.name.toUpperCase()}
              </Chip>
            ))}
          </View>

          <View style={styles.dateRow}>
            <List.Accordion
              title={
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 20,
                  }}
                >
                  <Icon source="calendar" size={24} color="darkgray" />
                  <Text variant="bodySmall" style={styles.sessionDateInfoText}>
                    {formattedDate}
                  </Text>
                </View>
              }
              right={(props) => null}
              style={styles.datePressable}
              rippleColor="rgba(255, 255, 255, 0.1)"
            >
              <Calendar
                hideExtraDays
                current={selectedDate}
                onDayPress={onDayPress}
                markedDates={marked}
                minDate={minDate}
                maxDate={maxDate}
                theme={{
                  calendarBackground: "transparent",
                  monthTextColor: "white",
                  arrowColor: Colors.primary.light,
                  dayTextColor: "white",
                  todayTextColor: "#fcbbbb",
                  selectedDayBackgroundColor: Colors.primary.main,
                  textDisabledColor: "gray",
                }}
              />
            </List.Accordion>
          </View>
        </View>

        <FlatList
          scrollEnabled={false}
          data={session.exercises}
          keyExtractor={exerciseItemKeyExtractor}
          renderItem={renderExerciseItem}
        />

        <View style={{ margin: 10, height: 50, marginBottom: 30 }}>
          <Button
            style={styles.addExerciseButton}
            contentStyle={{ height: "100%" }}
            icon={() => <Icon source="plus" size={24} color="gray" />}
            labelStyle={{ color: "gray" }}
            onPress={() => setOpen(true)}
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
            backgroundColor: "rgb(65, 65, 65)",
            padding: 20,
            margin: 20,
            borderRadius: 3,
          }}
        >
          <Text variant="titleMedium" style={{ marginBottom: 20 }}>
            {!sessionNotes ? "Add session note" : "Edit session note"}
          </Text>

          <TextInput
            label="Session notes"
            defaultValue={sessionNotes}
            autoFocus
            ref={sessionNotesRef}
            onChangeText={(text) => setSessionNotesEditValue(text)}
            multiline
            right={
              <TextInput.Icon
                icon="close"
                size={20}
                onPress={handleSessionNotesClear}
              />
            }
            numberOfLines={4}
            contentStyle={{ marginVertical: 5 }}
            theme={{
              colors: {
                surfaceVariant: Colors.secondary.light,
                primary: Colors.accent.main,
              },
            }}
          />

          <View style={styles.sessionNotesButtons}>
            <Button
              theme={{ colors: { primary: Colors.accent.light } }}
              onPress={handleSessionNotesCancel}
            >
              Cancel
            </Button>
            <Button
              theme={{
                colors: { primary: Colors.accent.light, onPrimary: "black" },
              }}
              mode="contained"
              onPress={handleSessionNotesSave}
            >
              Save
            </Button>
          </View>
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  sessionContainer: {
    backgroundColor: Colors.secondary.main,
    height: "100%",
  },
  sessionMainInfo: {
    margin: 10,
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
    gap: 15,
  },
  sessionDateInfo: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sessionDateInfoText: {
    fontSize: 13,
  },
  dateRow: {
    flex: 1,
    paddingHorizontal: 7,
    gap: 15,
    marginTop: 5,
  },
  datePressable: {
    backgroundColor: Colors.secondary.main,
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
  setOptionsContainer: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: Colors.secondary.main,
  },
  setOption: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 20,
    gap: 25,
  },
});
