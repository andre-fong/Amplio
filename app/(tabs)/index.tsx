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
import Session from "@/components/session";

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

const mockSessionsData: Session[] = [
  {
    date: "2024-09-01",
    meso: mockMesoData,
    name: "Push",
    notes: "This was a great session, I felt strong and energized!",
    deload: false,
    microcycleNum: 1,
    dayNum: 3,
    exercises: [
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
    ],
  },
  {
    date: "2023-09-02",
    meso: mockMesoData,
    name: "Pull",
    notes: "This was an alright session, I felt a bit tired",
    deload: false,
    microcycleNum: 1,
    dayNum: 4,
    exercises: [
      {
        id: "4",
        name: "Pull-ups",
        targetMuscle: {
          name: "Back",
          color: "#ff0000",
        },
        synergistMuscles: [
          {
            name: "Biceps",
            color: "#00ff00",
          },
          {
            name: "Forearms",
            color: "#0000ff",
          },
        ],
        equipment: "Bodyweight",
        exerciseOrder: 1,
        notes: "Remember to keep your core tight",
        plannedSets: [
          {
            weight: 60,
            prevWeight: 60,
            reps: 10,
            prevReps: 10,
            logged: false,
            setOrder: 1,
            type: "W",
          },
          {
            weight: 60,
            prevWeight: 60,
            reps: 8,
            prevReps: 8,
            logged: false,
            setOrder: 2,
          },
          {
            weight: 60,
            prevWeight: 60,
            reps: 6,
            prevReps: 6,
            logged: false,
            setOrder: 3,
          },
        ],
      },
      {
        id: "5",
        name: "Barbell Rows",
        targetMuscle: {
          name: "Back",
          color: "#ff0000",
        },
        synergistMuscles: [
          {
            name: "Biceps",
            color: "#00ff00",
          },
          {
            name: "Forearms",
            color: "#0000ff",
          },
        ],
        equipment: "Barbell",
        exerciseOrder: 2,
        notes: "Focus on the stretch at the bottom",
        plannedSets: [
          {
            weight: 135,
            prevWeight: 135,
            reps: 12,
            prevReps: 12,
            logged: false,
            setOrder: 1,
          },
          {
            weight: 155,
            prevWeight: 155,
            reps: 10,
            prevReps: 10,
            logged: false,
            setOrder: 2,
          },
          {
            weight: 175,
            prevWeight: 175,
            reps: 8,
            prevReps: 8,
            logged: false,
            setOrder: 3,
          },
        ],
      },
      {
        id: "6",
        name: "Hammer Curls",
        targetMuscle: {
          name: "Biceps",
          color: "#00ff00",
        },
        equipment: "Dumbbell",
        exerciseOrder: 3,
        plannedSets: [
          {
            weight: 30,
            prevWeight: 30,
            reps: 15,
            prevReps: 15,
            logged: false,
            setOrder: 1,
          },
          {
            weight: 35,
            prevWeight: 35,
            reps: 12,
            prevReps: 12,
            logged: false,
            setOrder: 2,
          },
          {
            weight: 40,
            prevWeight: 40,
            reps: 10,
            prevReps: 10,
            logged: false,
            setOrder: 3,
          },
        ],
      },
    ],
  },
];
const mockSessionData = mockSessionsData[0];

export default function Logs() {
  ///////////// DATA //////////////

  ///////////// FORM STATE //////////////
  const [mesocycleOptionsOpen, setMesocycleOptionsOpen] = useState(false);
  const [selectedSetOptions, setSelectedSetOptions] = useState<{
    exerciseId: string;
    setOrder: number;
  } | null>(null);

  const setOptionsData = useMemo(() => {
    if (!selectedSetOptions) return null;
    const selectedExercise = mockSessionData.exercises.find(
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
          <Text
            style={styles.headerTitle}
            variant="titleLarge"
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            Logs
          </Text>
          <Pressable onPress={() => {}}>
            <Text style={styles.headerSubtitle}>{mockMesoData.name}</Text>
          </Pressable>
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
            title="Add meso note"
          />
          <Menu.Item
            leadingIcon="tag"
            onPress={() => {}}
            title="Change meso name"
          />
          <Menu.Item
            leadingIcon="pencil"
            onPress={() => {}}
            title="Edit meso structure"
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

      <ScrollView
        style={styles.sessionContainer}
        // nestedScrollEnabled
        keyboardDismissMode="on-drag"
      >
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
          data={mockSessionsData}
          keyExtractor={(item) => item.date.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          bouncesZoom={false}
          scrollsToTop
          renderItem={({ item: session }) => (
            <Session
              data={session}
              setSelectedSetOptions={({ exerciseId, setOrder }) => {
                setSelectedSetOptions({ exerciseId, setOrder });
                bottomSheetRef.current?.expand();
              }}
            />
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
    </>
  );
}

const styles = StyleSheet.create({
  headerTitleSubtitle: {
    flex: 1,
    paddingLeft: 20,
  },
  headerTitle: {
    marginBottom: 3,
    fontWeight: "bold",
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
  dateRow: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    paddingHorizontal: 7,
    gap: 15,
    marginTop: 5,
  },
  datePressable: {
    paddingVertical: 8,
    paddingHorizontal: 16,
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
