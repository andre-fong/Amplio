import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  FlatList,
  useWindowDimensions,
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
} from "react-native-paper";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import Colors from "@/constants/colors";
import { useEffect, useState, useMemo, useRef } from "react";
import { spinUpDatabase, getAllMuscleGroups, clearDatabase } from "@/api";
import { getFullSetType } from "@/utils/set";

// TODO: Replace with real data
const mockMesoData: Mesocycle = {
  id: "1",
  name: "Chest Emphasis 2024",
  notes: "This is a great mesocycle to focus on chest strength",
  startDate: "2024-08-01",
  endDate: "2024-09-01",
  type: "planned",
  numMicrocycles: 4,
  numSessionsPerMicrocycle: 4,
  percentFinished: 0,
};

const mockSessionData: Session = {
  date: "2024-09-01",
  meso: mockMesoData,
  name: "Push",
  notes: "This was a great session, I felt strong and energized!",
  deload: false,
  microcycleNum: 1,
  dayNum: 3,
};

const mockExerciseData: PlannedExercise[] = [
  {
    id: "1",
    name: "Bench Press",
    targetMuscle: {
      name: "Chest",
      color: "#ff0000",
    },
    synergistMuscles: [
      {
        name: "Triceps",
        color: "#00ff00",
      },
      {
        name: "Shoulders",
        color: "#0000ff",
      },
    ],
    equipment: "Barbell",
    exerciseOrder: 1,
    notes: "Remember to keep your elbows in tight",
    plannedSets: [
      {
        weight: 135,
        prevWeight: 135,
        reps: 10,
        prevReps: 9,
        logged: false,
        setOrder: 1,
        type: "W",
      },
      {
        weight: 185,
        prevWeight: 185,
        reps: 3,
        prevReps: 3,
        logged: false,
        setOrder: 2,
      },
      {
        weight: 225,
        prevWeight: 215,
        reps: 1,
        prevReps: 1,
        logged: false,
        setOrder: 3,
      },
    ],
  },
  {
    id: "2",
    name: "Dumbbell Flyes",
    targetMuscle: {
      name: "Chest",
      color: "#ff0000",
    },
    synergistMuscles: [
      {
        name: "Front Delts",
        color: "#00ff00",
      },
    ],
    equipment: "Dumbbell",
    exerciseOrder: 2,
    notes: "Focus on the stretch at the bottom",
    plannedSets: [
      {
        weight: 30,
        prevWeight: 30,
        reps: 12,
        prevReps: 12,
        logged: false,
        setOrder: 1,
      },
      {
        weight: 30,
        prevWeight: 30,
        reps: 12,
        prevReps: 12,
        logged: false,
        setOrder: 2,
      },
      {
        weight: 30,
        prevWeight: 30,
        reps: 12,
        prevReps: 12,
        logged: false,
        setOrder: 3,
      },
    ],
  },
  {
    id: "3",
    name: "Tricep Pushdown (angled bar)",
    targetMuscle: {
      name: "Triceps",
      color: "#00ff00",
    },
    equipment: "Cable",
    exerciseOrder: 3,
    plannedSets: [
      {
        weight: 50,
        prevWeight: 50,
        reps: 15,
        prevReps: 15,
        logged: false,
        setOrder: 1,
      },
      {
        weight: 60,
        prevWeight: 60,
        reps: 12,
        prevReps: 12,
        logged: false,
        setOrder: 2,
      },
      {
        weight: 70,
        prevWeight: 70,
        reps: 10,
        prevReps: 10,
        logged: false,
        setOrder: 3,
      },
    ],
  },
];

export default function Logs() {
  ///////////// DATA //////////////
  const sessionIsCurrent =
    new Date().getTime() === new Date(mockSessionData.date).getTime();

  const sessionMuscleGroups = useMemo(() => {
    const muscleGroupMap = new Map<string, MuscleGroup>();
    for (const exercise of mockExerciseData) {
      muscleGroupMap.set(exercise.targetMuscle.name, exercise.targetMuscle);
    }
    return Array.from(muscleGroupMap.values());
  }, [mockExerciseData]);

  const [sessionNotes, setSessionNotes] = useState(mockSessionData.notes);
  const [sessionNotesEditValue, setSessionNotesEditValue] = useState(
    mockSessionData.notes
  );
  const [sessionIsDeload, setSessionIsDeload] = useState(
    mockSessionData.deload
  );

  ///////////// FORM STATE //////////////
  const { width } = useWindowDimensions();
  const [mesocycleOptionsOpen, setMesocycleOptionsOpen] = useState(false);
  const [sessionOptionsOpen, setSessionOptionsOpen] = useState(false);
  const [sessionNotesOpen, setSessionNotesOpen] = useState(false);
  // TODO: Replace with planned exercise id for which options are open
  const [selectedExerciseOptions, setSelectedExerciseOptions] = useState<
    string | null
  >(null);
  const [selectedSetOptions, setSelectedSetOptions] = useState<{
    exerciseId: string;
    setOrder: number;
  } | null>(null);

  const setOptionsData = useMemo(() => {
    if (!selectedSetOptions) return null;
    const selectedExercise = mockExerciseData.find(
      (exercise) => exercise.id === selectedSetOptions.exerciseId
    );
    if (!selectedExercise) return null;

    const selectedSet = selectedExercise.plannedSets.find(
      (set) => set.setOrder === selectedSetOptions.setOrder
    );
    if (!selectedSet) return null;

    return {
      exercise: selectedExercise,
      set: selectedSet,
    };
  }, [selectedSetOptions]);

  const bottomSheetRef = useRef<BottomSheet>(null);

  // setInterval(() => {
  //   bottomSheetRef.current?.expand();
  // }, 3000);

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

  // TODO: Remove db testing
  useEffect(() => {
    spinUpDatabase()
      .then(() => {
        getAllMuscleGroups();
      })
      .catch((err) => {
        console.error(err);
      });

    return () => {
      clearDatabase();
    };
  }, []);

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
              {mockMesoData.name}
            </Text>
          </Pressable>
          <Text style={styles.headerSubtitle}>
            Microcycle #
            <Text style={styles.headerSubtitleBold}>
              {mockSessionData.microcycleNum}
            </Text>
            , Day{" "}
            <Text style={styles.headerSubtitleBold}>
              {mockSessionData.dayNum}
            </Text>
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

      <ScrollView style={styles.sessionContainer} nestedScrollEnabled>
        <View style={styles.sessionDateInfo}>
          <IconButton icon="arrow-left" size={24} onPress={() => {}} />
          <View style={styles.sessionDateInfoText}>
            <Text variant="bodyMedium">
              Microcycle #
              <Text style={styles.headerSubtitleBold}>
                {mockSessionData.microcycleNum}
              </Text>
              , Day{" "}
              <Text style={styles.headerSubtitleBold}>
                {mockSessionData.dayNum}
              </Text>
            </Text>
          </View>
          <IconButton icon="arrow-right" size={24} onPress={() => {}} />
        </View>

        <FlatList
          data={[1, 2, 3]}
          keyExtractor={(item) => item.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          bouncesZoom={false}
          scrollsToTop
          renderItem={() => (
            <ScrollView style={{ width, flex: 1, paddingBottom: 30 }}>
              <View style={styles.sessionMainInfo}>
                <View style={styles.sessionInfoTopRow}>
                  <View>
                    <Text style={styles.sessionName} variant="headlineMedium">
                      {mockSessionData.name}
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
                          !mockSessionData.notes
                            ? "Add session note"
                            : "Edit session note"
                        }
                      />
                      <Menu.Item
                        leadingIcon="tag"
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

                {mockSessionData.notes && (
                  <Pressable
                    style={styles.sessionInfoNotes}
                    onPress={() => {
                      setSessionNotesOpen(true);
                    }}
                  >
                    <Icon
                      source="pencil"
                      size={24}
                      color={Colors.accent.main}
                    />
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

                <View>
                  {/* TODO: Datepicker */}
                  <Text>Date: 12/14/2024</Text>
                </View>
              </View>

              <FlatList
                scrollEnabled={false}
                data={mockExerciseData}
                keyExtractor={(item) => item.id}
                renderItem={({ item: plannedExercise }) => (
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
                        <Text
                          variant="titleLarge"
                          style={{ fontWeight: "bold" }}
                        >
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
                          visible={
                            selectedExerciseOptions === plannedExercise.id
                          }
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

                          {plannedExercise.exerciseOrder <
                            mockExerciseData.length && (
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
                      <Pressable
                        style={styles.exerciseNotes}
                        onPress={() => {}}
                      >
                        <Icon
                          source="pencil"
                          size={24}
                          color={Colors.accent.main}
                        />
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
                                <Text
                                  variant="bodySmall"
                                  style={styles.setType}
                                >
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
                              keyboardType="numeric"
                              placeholder="lbs"
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
                              keyboardType="numeric"
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
                              <Checkbox status="unchecked" onPress={() => {}} />
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
                                bottomSheetRef.current?.expand();
                              }}
                            />
                          </View>
                        </View>
                      ))}

                      <Button
                        icon={() => (
                          <Icon
                            source="plus"
                            size={24}
                            color={Colors.primary.main}
                          />
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
                )}
              />

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
          )}
        />
      </ScrollView>

      {selectedSetOptions && (
        <BottomSheet
          backgroundStyle={{ backgroundColor: Colors.secondary.main }}
          handleStyle={{
            height: 30,
            justifyContent: "center",
            backgroundColor: Colors.secondary.main,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
          handleIndicatorStyle={{ backgroundColor: "white", width: 50 }}
          ref={bottomSheetRef}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              enableTouchThrough={true}
              pressBehavior="close"
              appearsOnIndex={0}
              disappearsOnIndex={-1}
            />
          )}
          enablePanDownToClose
          onClose={() => {
            setSelectedSetOptions(null);
          }}
          index={0}
        >
          <BottomSheetScrollView
            contentContainerStyle={styles.setOptionsContainer}
          >
            <View style={{ paddingHorizontal: 25, marginBottom: 25 }}>
              <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
                {setOptionsData?.exercise.name}
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: "darkgray", marginTop: 5 }}
              >
                {setOptionsData?.exercise.equipment.toUpperCase()}
              </Text>
            </View>

            <View style={[styles.setsLabelRow]}>
              <View style={{ flex: 0.5 }} />
              <Text
                style={{ flex: 1, textAlign: "center" }}
                variant="bodyMedium"
              >
                WEIGHT
              </Text>
              <Text
                style={{ flex: 1, textAlign: "center" }}
                variant="bodyMedium"
              >
                REPS
              </Text>
              <Text
                style={{ flex: 1, textAlign: "center" }}
                variant="bodyMedium"
              >
                LOG
              </Text>
              <View style={{ flex: 0.5 }} />
            </View>
            <View
              style={[styles.setsRow, { marginVertical: 0, marginBottom: 10 }]}
            >
              <View style={{ flex: 0.5 }}>
                {!!setOptionsData?.set.type && (
                  <Tooltip
                    title={getFullSetType(setOptionsData?.set.type)}
                    theme={{
                      colors: {
                        surface: "white",
                        onSurface: Colors.secondary.dark,
                      },
                    }}
                  >
                    <Text variant="bodySmall" style={styles.setType}>
                      {setOptionsData?.set.type}
                    </Text>
                  </Tooltip>
                )}
              </View>
              <Text
                style={{ flex: 1, textAlign: "center", fontWeight: "bold" }}
                variant="titleLarge"
              >
                {setOptionsData?.set.weight}
              </Text>
              <Text
                style={{ flex: 1, textAlign: "center", fontWeight: "bold" }}
                variant="titleLarge"
              >
                {setOptionsData?.set.reps}
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontWeight: "bold",
                  color: setOptionsData?.set.logged ? "white" : "darkgray",
                }}
                variant="titleLarge"
              >
                {setOptionsData?.set.logged ? "Y" : "N"}
              </Text>
              <View style={{ flex: 0.5 }} />
            </View>

            <Divider
              bold
              style={{
                marginVertical: 10,
              }}
            />

            <TouchableRipple onPress={() => {}}>
              <View style={styles.setOption}>
                <Icon source="dumbbell" size={24} color="white" />
                <Text variant="bodyLarge">Change set type</Text>
              </View>
            </TouchableRipple>

            <TouchableRipple onPress={() => {}}>
              <View style={styles.setOption}>
                <Icon source="plus" size={24} color="white" />
                <Text variant="bodyLarge">Add drop set</Text>
              </View>
            </TouchableRipple>

            {selectedSetOptions.setOrder > 1 && (
              <TouchableRipple onPress={() => {}}>
                <View style={styles.setOption}>
                  <Icon source="arrow-up" size={24} color="white" />
                  <Text variant="bodyLarge">Move set up</Text>
                </View>
              </TouchableRipple>
            )}

            {selectedSetOptions.setOrder <
              (setOptionsData?.exercise.plannedSets.length || 0) && (
              <TouchableRipple onPress={() => {}}>
                <View style={styles.setOption}>
                  <Icon source="arrow-down" size={24} color="white" />
                  <Text variant="bodyLarge">Move set down</Text>
                </View>
              </TouchableRipple>
            )}

            <Divider
              bold
              style={{
                marginVertical: 10,
              }}
            />

            <TouchableRipple onPress={() => {}}>
              <View style={styles.setOption}>
                <Icon source="delete" size={24} color={Colors.primary.light} />
                <Text
                  variant="bodyLarge"
                  style={{ color: Colors.primary.light }}
                >
                  Delete set
                </Text>
              </View>
            </TouchableRipple>
          </BottomSheetScrollView>
        </BottomSheet>
      )}

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
  sessionDateInfo: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sessionDateInfoText: {
    flex: 1,
    alignItems: "center",
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
