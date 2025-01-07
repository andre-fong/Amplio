import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  TextInput as TextInputRN,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  useWindowDimensions,
} from "react-native";
import {
  Appbar,
  Button,
  Chip,
  Dialog,
  Icon,
  IconButton,
  List,
  Menu,
  Modal,
  Portal,
  SegmentedButtons,
  Snackbar,
  Text,
  TextInput,
  Tooltip,
  TouchableRipple,
} from "react-native-paper";
import Colors from "@/constants/colors";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ExerciseSelectBottomSheet from "@/components/exerciseSelectBottomSheet";
import MuscleSelectBottomSheet from "@/components/muscleSelectBottomSheet";
import DragList from "react-native-draglist";
import { Calendar, DateData } from "react-native-calendars";
import { addPlannedMesocycle } from "@/api/mesocycles";

export default function NewPlannedMesocycle() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [sessionIndex, setSessionIndex] = useState(0);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const containerScrollRef = useRef<ScrollView | null>(null);

  const [mesocycleNotesTemp, setMesocycleNotesTemp] = useState("");
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

  const [muscleGroupListOpen, setMuscleGroupListOpen] = useState(false);
  const [exercisesListOpen, setExercisesListOpen] = useState(false);
  const [exerciseFilter, setExerciseFilter] = useState("");

  const draglistKeyExtractor = useCallback(
    (item: (Exercise | MuscleGroup) & { order: number }) => {
      if ("id" in item) return item.id.toString() + item.order;
      return item.name + item.order;
    },
    []
  );
  const draglistItemSeparator = useCallback(
    () => <View style={{ marginBottom: 10 }} />,
    []
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const contentOffsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(contentOffsetX / width);
      setSessionIndex(index);
    },
    [width]
  );

  const setSelectedDate = useCallback((date: string | undefined) => {
    setNewMeso((prev) => ({ ...prev, startDate: date || "" }));
  }, []);

  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [confirmMesocycleOpen, setConfirmMesocycleOpen] = useState(false);
  const handleConfirmMesocycleCancel = useCallback(() => {
    setConfirmMesocycleOpen(false);
    setNewMeso((prev) => ({
      ...prev,
      numMicrocycles: 4,
    }));
  }, []);

  //////////// PAGE STATE ////////////
  const [newMeso, setNewMeso] = useState<Omit<Mesocycle, "id" | "endDate">>({
    name: "",
    notes: "",
    startDate: "",
    type: "planned",
    numMicrocycles: 4,
  });
  const [daySchedules, setDaySchedules] = useState<
    (Omit<DaySchedule, "exercises"> & {
      exercises: ((Exercise | MuscleGroup) & { order: number })[];
    })[]
  >([
    {
      day: 1,
      name: "",
      exercises: [],
    },
  ]);

  const formattedDate = useMemo(() => {
    if (!newMeso.startDate)
      return <Text style={{ color: "lightgray" }}>Select a start date</Text>;

    const userTimezoneOffset = new Date().getTimezoneOffset() * 60000;
    return new Date(
      new Date(newMeso.startDate).getTime() + userTimezoneOffset
    ).toLocaleDateString(undefined, {
      year: "numeric",
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }, [newMeso.startDate]);

  const onDayPress = useCallback(
    (day: DateData) => {
      if (day.dateString === newMeso.startDate) setSelectedDate(undefined);
      else setSelectedDate(day.dateString);
    },
    [newMeso.startDate]
  );

  const marked = useMemo(() => {
    if (!newMeso.startDate) return {};

    return {
      [newMeso.startDate]: {
        selected: true,
      },
    };
  }, [newMeso.startDate]);

  const changeMesoWeeks = useCallback(
    (weeks: string) => {
      setNewMeso((prev) => ({
        ...prev,
        numMicrocycles: parseInt(weeks),
      }));
    },
    [setNewMeso]
  );

  const handleMesoNotesCancel = useCallback(() => {
    setMesocycleNotesTemp(newMeso.notes || "");
    setMesocycleNotesOpen(false);
  }, [newMeso.notes]);

  const handleMesoNotesSave = useCallback(() => {
    setNewMeso((prev) => ({ ...prev, notes: mesocycleNotesTemp }));
    setMesocycleNotesOpen(false);
  }, [mesocycleNotesTemp]);

  const handleMesoNotesClear = useCallback(() => {
    setMesocycleNotesTemp("");
    if (mesoNotesRef.current) {
      mesoNotesRef.current?.clear();
    }
  }, []);

  const onReordered = useCallback(
    async (fromIndex: number, toIndex: number) => {
      const copy = [...daySchedules[sessionIndex].exercises];
      const removed = copy.splice(fromIndex, 1);

      copy.splice(toIndex, 0, removed[0]);
      setDaySchedules((prev) => {
        const newSchedules = [...prev];
        newSchedules[sessionIndex].exercises = copy;
        return newSchedules;
      });
    },
    [sessionIndex, daySchedules]
  );

  const [snackbarMessage, setSnackbarMessage] = useState("");

  const dismissSnackbar = useCallback(() => {
    setSnackbarMessage("");
  }, []);

  /**
   * Handle selecting a muscle group from bottom sheet
   */
  const handleMuscleGroupSelect = useCallback(
    (muscleGroup: MuscleGroup) => {
      setDaySchedules((prev) => {
        const newSchedules = [...prev];
        newSchedules[sessionIndex].exercises.push({
          ...muscleGroup,
          order: prev[sessionIndex].exercises.length + 1,
        });
        return newSchedules;
      });
    },
    [sessionIndex]
  );

  /**
   * Handle selecting an exercise from bottom sheet
   */
  const handleExerciseSelect = useCallback(
    (exercise: Exercise) => {
      setDaySchedules((prev) => {
        const newSchedules = [...prev];
        newSchedules[sessionIndex].exercises[exerciseIndex] = {
          ...exercise,
          order: exerciseIndex + 1,
        };
        return newSchedules;
      });
    },
    [sessionIndex, exerciseIndex]
  );

  /**
   * Handle deleting an exercise from the draglist
   */
  const handleExerciseDelete = useCallback(
    (exercise: (Exercise | MuscleGroup) & { order: number }) => {
      setDaySchedules((prev) => {
        const newSchedules = [...prev];
        newSchedules[sessionIndex].exercises = newSchedules[
          sessionIndex
        ].exercises.filter((ex) => ex.order !== exercise.order);
        return newSchedules;
      });
    },
    [sessionIndex]
  );

  const handleSessionDelete = useCallback(
    (index: number) => {
      if (daySchedules.length === 1) {
        setSnackbarMessage("You should have at least one session.");
        return;
      }
      setDaySchedules((prev) => {
        const newSchedules = [...prev];
        newSchedules.splice(index, 1);
        return newSchedules.map((schedule, index) => ({
          ...schedule,
          day: index + 1,
        }));
      });
    },
    [daySchedules]
  );

  const draglistRenderItem = useCallback(
    ({
      item: exercise,
      onDragStart,
      onDragEnd,
      isActive,
      index,
    }: {
      item: (Exercise | MuscleGroup) & { order: number };
      onDragStart: () => void;
      onDragEnd: () => void;
      isActive: boolean;
      index: number;
    }) => (
      <View
        style={[
          styles.exerciseContainer,
          {
            transform: isActive ? [{ scale: 1.05 }] : [],
            opacity: isActive ? 0.8 : 1,
          },
        ]}
      >
        <View style={styles.exerciseTopRow}>
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
              fontSize: 12,
            }}
          >
            {"id" in exercise
              ? exercise.targetMuscle.name.toUpperCase()
              : exercise.name.toUpperCase()}
          </Chip>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <IconButton
              icon={() => (
                <Icon source="delete" size={20} color={Colors.primary.light} />
              )}
              onPress={() => handleExerciseDelete(exercise)}
            />
            <IconButton
              icon={() => <Icon source="drag" size={24} />}
              onLongPress={onDragStart}
              delayLongPress={250}
              onPressOut={onDragEnd}
            />
          </View>
        </View>

        <Pressable
          style={styles.exerciseEditable}
          onPress={() => {
            setExerciseFilter(
              "id" in exercise ? exercise.targetMuscle.name : exercise.name
            );
            setExerciseIndex(index);
            setExercisesListOpen(true);
          }}
          disabled={isActive}
        >
          {"id" in exercise ? (
            <>
              <Text
                variant="titleLarge"
                style={{ fontSize: 18, fontWeight: "bold" }}
              >
                {exercise.name}
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: "darkgray", marginTop: 2 }}
              >
                {exercise.equipment.toUpperCase()}
              </Text>
            </>
          ) : (
            <Text
              variant="bodySmall"
              style={{
                paddingVertical: 10,
                paddingHorizontal: 5,
                color: "darkgray",
                fontStyle: "italic",
              }}
            >
              Select an exercise...
            </Text>
          )}
        </Pressable>
      </View>
    ),
    [handleExerciseDelete]
  );

  const handleConfirmMesocycle = useCallback(() => {
    if (!newMeso.name) {
      setSnackbarMessage("Mesocycle name required.");
      return;
    }
    if (!newMeso.startDate) {
      setSnackbarMessage("Mesocycle start date required.");
      return;
    }

    for (let i = 0; i < daySchedules.length; i++) {
      const dayName = daySchedules[i].name
        ? `"${daySchedules[i].name}"`
        : `Day ${i + 1}`;

      if (daySchedules[i].exercises.length === 0) {
        setSnackbarMessage(`${dayName} should have at least one exercise.`);
        return;
      }

      for (let j = 0; j < daySchedules[i].exercises.length; j++) {
        if (!("id" in daySchedules[i].exercises[j])) {
          setSnackbarMessage(`${dayName} contains an unselected exercise.`);
          return;
        }
      }
    }

    setConfirmMesocycleOpen(true);
  }, [newMeso, daySchedules]);

  const handleSubmitMesocycleToBackend = useCallback(() => {
    addPlannedMesocycle(newMeso, daySchedules)
      .then(() => {
        router.back();
      })
      .catch((error) => {
        setErrorDialogOpen(error);
      });
  }, [newMeso, daySchedules]);

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

        <Tooltip title="Create mesocycle">
          <Appbar.Action
            icon={() => (
              <Icon source="check" size={32} color={Colors.primary.light} />
            )}
            animated={false}
            size={32}
            onPress={handleConfirmMesocycle}
            style={{ marginRight: 10 }}
          />
        </Tooltip>
      </Appbar.Header>

      <ScrollView
        style={styles.container}
        keyboardDismissMode="on-drag"
        nestedScrollEnabled
        ref={containerScrollRef}
      >
        <View style={styles.mesoMainInfo}>
          <View style={styles.mesoInfoTopRow}>
            <View style={styles.mesoName}>
              <TextInput
                value={newMeso.name}
                onChangeText={(text) =>
                  setNewMeso((prev) => ({ ...prev, name: text }))
                }
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
              {newMeso.notes ? (
                newMeso.notes
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
                current={!!newMeso.startDate ? newMeso.startDate : undefined}
                onDayPress={onDayPress}
                markedDates={marked}
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
          data={daySchedules}
          extraData={sessionIndex}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          bouncesZoom={false}
          onScroll={handleScroll}
          ListFooterComponent={() => (
            <View style={{ width, flex: 1 }}>
              <TouchableRipple
                style={[
                  styles.sessionContainer,
                  {
                    height: 80,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 12,
                  },
                ]}
                onPress={() => {
                  setDaySchedules((prev) => [
                    ...prev,
                    {
                      day: prev.length + 1,
                      name: "",
                      exercises: [],
                    },
                  ]);
                }}
              >
                <>
                  <Icon source="plus" size={28} color="darkgray" />
                  <Text variant="titleMedium" style={{ color: "darkgray" }}>
                    ADD SESSION
                  </Text>
                </>
              </TouchableRipple>
            </View>
          )}
          renderItem={({ item: daySchedule, index }) => (
            <View style={{ width, flex: 1, paddingBottom: 100 }}>
              <View style={styles.sessionContainer}>
                <View style={styles.mesoInfoTopRow}>
                  <View style={styles.sessionName}>
                    <TextInput
                      style={{ height: 42 }}
                      contentStyle={{ fontSize: 14 }}
                      value={daySchedule.name}
                      onChangeText={(text) =>
                        setDaySchedules((prev) => {
                          const newSchedules = [...prev];
                          newSchedules[sessionIndex].name = text;
                          return newSchedules;
                        })
                      }
                      placeholder={`Day ${daySchedule.day}`}
                    />
                  </View>

                  <IconButton
                    style={{ filter: "brightness(2)" }}
                    icon={() => (
                      <Icon
                        source="delete"
                        color={Colors.primary.light}
                        size={24}
                      />
                    )}
                    onPress={() => handleSessionDelete(index)}
                  />
                </View>

                <DragList
                  keyExtractor={draglistKeyExtractor}
                  ItemSeparatorComponent={draglistItemSeparator}
                  data={daySchedule.exercises}
                  style={styles.exerciseList}
                  onReordered={onReordered}
                  scrollEnabled={false}
                  renderItem={draglistRenderItem}
                />

                <Button
                  labelStyle={{ fontSize: 13, color: Colors.primary.light }}
                  onPress={() => {
                    setMuscleGroupListOpen(true);
                  }}
                  icon={() => (
                    <Icon
                      source="plus"
                      size={24}
                      color={Colors.primary.light}
                    />
                  )}
                >
                  ADD A MUSCLE GROUP
                </Button>
              </View>
            </View>
          )}
        />
      </ScrollView>

      <Portal>
        <Snackbar
          visible={!!snackbarMessage}
          onDismiss={dismissSnackbar}
          duration={3500}
          style={{ backgroundColor: "black" }}
        >
          <Text>{snackbarMessage}</Text>
        </Snackbar>

        <MuscleSelectBottomSheet
          open={muscleGroupListOpen}
          setOpen={setMuscleGroupListOpen}
          onMuscleGroupSelect={handleMuscleGroupSelect}
          data={sessionIndex}
        />

        <ExerciseSelectBottomSheet
          open={exercisesListOpen}
          setOpen={setExercisesListOpen}
          onExerciseSelect={handleExerciseSelect}
          filter={exerciseFilter}
          data={sessionIndex}
        />
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
            {!newMeso.notes ? "Add session note" : "Edit session note"}
          </Text>

          <TextInput
            label="Session notes"
            defaultValue={mesocycleNotesTemp}
            ref={mesoNotesRef}
            onChangeText={setMesocycleNotesTemp}
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

          <View style={styles.mesoModalButtons}>
            <Button
              theme={{ colors: { primary: Colors.accent.light } }}
              onPress={handleMesoNotesCancel}
            >
              Cancel
            </Button>
            <Button
              theme={{
                colors: { primary: Colors.accent.light, onPrimary: "black" },
              }}
              // rippleColor={Colors.accent.dark}
              mode="contained"
              onPress={handleMesoNotesSave}
            >
              Save
            </Button>
          </View>
        </Modal>

        <Modal
          visible={confirmMesocycleOpen}
          onDismiss={handleConfirmMesocycleCancel}
          contentContainerStyle={{
            backgroundColor: "rgb(65, 65, 65)",
            padding: 20,
            margin: 20,
            borderRadius: 3,
          }}
        >
          <Text variant="titleMedium">Confirm New Mesocycle</Text>
          <Text variant="bodyMedium" style={{ marginTop: 20 }}>
            How many weeks will you train?
          </Text>
          <SegmentedButtons
            style={{ marginVertical: 15 }}
            theme={{
              colors: {
                secondaryContainer: Colors.primary.dark,
                onSecondaryContainer: "white",
                primary: Colors.primary.light,
              },
            }}
            value={newMeso.numMicrocycles.toString()}
            onValueChange={changeMesoWeeks}
            buttons={[
              {
                label: "4",
                value: "4",
              },
              {
                label: "5",
                value: "5",
              },
              {
                label: "6",
                value: "6",
              },
            ]}
          />
          <View style={styles.mesoModalButtons}>
            <Button
              theme={{ colors: { primary: Colors.primary.main } }}
              onPress={handleConfirmMesocycleCancel}
            >
              Back
            </Button>
            <Button
              theme={{
                colors: { primary: Colors.primary.dark, onPrimary: "white" },
              }}
              // rippleColor={Colors.accent.dark}
              mode="contained"
              onPress={handleSubmitMesocycleToBackend}
            >
              Confirm
            </Button>
          </View>
        </Modal>

        <Dialog
          visible={errorDialogOpen}
          onDismiss={() => setErrorDialogOpen(false)}
          style={{
            backgroundColor: "rgb(65, 65, 65)",
          }}
        >
          <Dialog.Title>Error</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              There was an error processing your request.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              labelStyle={{ fontSize: 13, color: Colors.primary.light }}
              onPress={() => setErrorDialogOpen(false)}
            >
              OK
            </Button>
          </Dialog.Actions>
        </Dialog>
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
  mesoModalButtons: {
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
  sessionDateInfoText: {
    fontSize: 13,
  },
  dateRow: {
    flex: 1,
    gap: 15,
    marginTop: 5,
  },
  datePressable: {
    backgroundColor: Colors.secondary.main,
  },

  exerciseList: {
    paddingHorizontal: 10,
    marginHorizontal: -10,
    marginVertical: 10,
  },
  exerciseContainer: {
    // borderColor: "lightgray",
    // borderRadius: 3,
    // borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: "#292929",
  },
  exercisePlaceholder: {
    width: "100%",
    height: 120,
    opacity: 0.8,
  },
  exerciseTopRow: {
    marginTop: 5,
    paddingHorizontal: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exerciseEditable: {
    margin: 10,
    marginBottom: 5,
    marginTop: -4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: Colors.secondary.main,
    borderRadius: 3,
  },
});
