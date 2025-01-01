import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  FlatList,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import {
  Appbar,
  Text,
  IconButton,
  Menu,
  Divider,
  Icon,
  Portal,
  Tooltip,
  TouchableRipple,
} from "react-native-paper";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import Colors from "@/constants/colors";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { spinUpDatabase, clearDatabase } from "@/api";
import { getFullSetType } from "@/utils/set";
import Session from "@/components/session";

// TODO: Replace with real data
const mockMesoData: Mesocycle = {
  id: 1,
  name: "Chest Emphasis 2024",
  notes: "This is a great mesocycle to focus on chest strength",
  startDate: "2022-08-01T00:00:00.000-05:00",
  endDate: "2025-09-01T00:00:00.000-05:00",
  type: "planned",
  numMicrocycles: 4,
  numSessionsPerMicrocycle: 4,
  percentFinished: 0,
};

const mockSessionsData: Session[] = [
  {
    date: "2024-09-01T00:00:00.000-05:00",
    meso: mockMesoData,
    name: "Push",
    notes: "This was a great session, I felt strong and energized!",
    deload: false,
    microcycleNum: 1,
    dayNum: 3,
    completed: false,
    exercises: [
      {
        id: 1,
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
            logged: true,
            setOrder: 1,
            type: "W",
          },
          {
            weight: 185,
            prevWeight: 185,
            reps: 3,
            prevReps: 3,
            logged: true,
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
        id: 2,
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
            logged: true,
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
        id: 3,
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
    date: "2023-09-02T00:00:00.000-05:00",
    meso: mockMesoData,
    name: "Pull",
    notes: "This was an alright session, I felt a bit tired",
    deload: false,
    microcycleNum: 1,
    dayNum: 4,
    completed: false,
    exercises: [
      {
        id: 4,
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
        id: 5,
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
        id: 6,
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
  {
    date: "2023-09-03T00:00:00.000-05:00",
    meso: mockMesoData,
    name: "Legs",
    notes: "Ok session, felt exhausted",
    deload: false,
    microcycleNum: 1,
    dayNum: 5,
    completed: false,
    exercises: [
      {
        id: 7,
        name: "Squats",
        targetMuscle: {
          name: "Quads",
          color: "#ff0000",
        },
        synergistMuscles: [
          {
            name: "Glutes",
            color: "#00ff00",
          },
          {
            name: "Hamstrings",
            color: "#0000ff",
          },
        ],
        equipment: "Barbell",
        exerciseOrder: 1,
        notes: "Remember to keep your back straight",
        plannedSets: [
          {
            weight: 135,
            prevWeight: 135,
            reps: 10,
            prevReps: 10,
            logged: false,
            setOrder: 1,
            type: "W",
          },
          {
            weight: 185,
            prevWeight: 185,
            reps: 8,
            prevReps: 8,
            logged: false,
            setOrder: 2,
          },
          {
            weight: 225,
            prevWeight: 215,
            reps: 6,
            prevReps: 6,
            logged: false,
            setOrder: 3,
          },
        ],
      },
      {
        id: 8,
        name: "Leg Press",
        targetMuscle: {
          name: "Quads",
          color: "#ff0000",
        },
        synergistMuscles: [
          {
            name: "Glutes",
            color: "#00ff00",
          },
          {
            name: "Hamstrings",
            color: "#0000ff",
          },
        ],
        equipment: "Machine",
        exerciseOrder: 2,
        notes: "Focus on the stretch at the bottom",
        plannedSets: [
          {
            weight: 180,
            prevWeight: 180,
            reps: 12,
            prevReps: 12,
            logged: false,
            setOrder: 1,
          },
          {
            weight: 180,
            prevWeight: 180,
            reps: 12,
            prevReps: 12,
            logged: false,
            setOrder: 2,
          },
          {
            weight: 180,
            prevWeight: 180,
            reps: 12,
            prevReps: 12,
            logged: false,
            setOrder: 3,
          },
        ],
      },
      {
        id: 9,
        name: "Leg Curls",
        targetMuscle: {
          name: "Hamstrings",
          color: "#00ff00",
        },
        equipment: "Machine",
        exerciseOrder: 3,
        plannedSets: [
          {
            weight: 60,
            prevWeight: 60,
            reps: 15,
            prevReps: 15,
            logged: false,
            setOrder: 1,
          },
          {
            weight: 70,
            prevWeight: 70,
            reps: 12,
            prevReps: 12,
            logged: false,
            setOrder: 2,
          },
          {
            weight: 80,
            prevWeight: 80,
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

export default function Logs() {
  ///////////// SPLASH SCREEN /////////////

  // TODO: Remove db testing
  useEffect(() => {
    async function prepare() {
      try {
        await spinUpDatabase();
      } catch (error) {
        console.error(error);
      } finally {
        // setAppIsReady(true);
      }
    }
    prepare();

    return () => {
      clearDatabase();
    };
  }, []);

  ///////////// DATA //////////////
  const { width } = useWindowDimensions();

  ///////////// FORM STATE //////////////
  const [sessionIndex, setSessionIndex] = useState(0);
  const changeSessionIndex = useCallback(
    (offset: number) => {
      sessionListRef?.current?.scrollToIndex({
        index: Math.min(
          Math.max(0, sessionIndex + offset),
          mockSessionsData.length - 1
        ),
      });
    },
    [sessionIndex, mockSessionsData.length]
  );

  const sessionListRef = useRef<FlatList>(null);

  const [mesocycleOptionsOpen, setMesocycleOptionsOpen] = useState(false);
  const [selectedSetOptions, setSelectedSetOptions] = useState<{
    exerciseId: number;
    setOrder: number;
  } | null>(null);

  const setOptionsData = useMemo(() => {
    if (!selectedSetOptions) return null;
    const selectedExercise = mockSessionsData[sessionIndex].exercises.find(
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

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setSessionIndex(index);
  }

  const handleSetOptionsClose = useCallback(() => {
    setSelectedSetOptions(null);
  }, []);

  const handleMoveSetUp = useCallback(() => {
    // TODO: Move set up
    bottomSheetRef.current?.close();
  }, []);

  const handleMoveSetDown = useCallback(() => {
    // TODO: Move set down
    bottomSheetRef.current?.close();
  }, []);

  const canMoveSetUp = useMemo(() => {
    return selectedSetOptions && selectedSetOptions.setOrder > 1;
  }, [selectedSetOptions]);

  const canMoveSetDown = useMemo(() => {
    return (
      selectedSetOptions &&
      selectedSetOptions.setOrder <
        (setOptionsData?.exercise.plannedSets.length || 0)
    );
  }, [selectedSetOptions, setOptionsData]);

  ///////////// RENDER //////////////
  const renderBackdropComponent = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        enableTouchThrough={true}
        pressBehavior="close"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  return (
    <Portal.Host>
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
        // onLayout={onLayoutRootView}
      >
        <View style={styles.sessionDateInfo}>
          <IconButton
            icon="chevron-left"
            size={26}
            onPress={() => changeSessionIndex(-1)}
            disabled={sessionIndex === 0}
          />
          <View style={styles.sessionDateInfoText}>
            <Text variant="bodyMedium">
              Microcycle #
              <Text style={styles.headerSubtitleBold}>
                {mockSessionsData[sessionIndex].microcycleNum}
              </Text>
              , Day{" "}
              <Text style={styles.headerSubtitleBold}>
                {mockSessionsData[sessionIndex].dayNum}
              </Text>
            </Text>
          </View>
          <IconButton
            icon="chevron-right"
            size={26}
            onPress={() => changeSessionIndex(1)}
            disabled={sessionIndex === mockSessionsData.length - 1}
          />
        </View>

        <FlatList
          data={mockSessionsData}
          keyExtractor={(item) => item.date.toString()}
          ref={sessionListRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          bouncesZoom={false}
          onScroll={handleScroll}
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

      <Portal>
        <BottomSheet
          backgroundStyle={{ backgroundColor: Colors.secondary.main }}
          // snapPoints={["80%"]}
          handleStyle={{
            height: 30,
            justifyContent: "center",
            backgroundColor: Colors.secondary.main,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
          handleIndicatorStyle={{ backgroundColor: "white", width: 50 }}
          ref={bottomSheetRef}
          backdropComponent={renderBackdropComponent}
          enablePanDownToClose
          onClose={handleSetOptionsClose}
          index={-1}
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
                {"  "}&middot;
                {`  SET ${setOptionsData?.set.setOrder} OF ${setOptionsData?.exercise.plannedSets.length}`}
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

            <TouchableRipple onPress={handleMoveSetUp} disabled={!canMoveSetUp}>
              <View style={styles.setOption}>
                <Icon
                  source="arrow-up"
                  size={24}
                  color={canMoveSetUp ? "white" : "darkgray"}
                />
                <Text
                  variant="bodyLarge"
                  style={{ color: canMoveSetUp ? "white" : "darkgray" }}
                >
                  Move set up
                </Text>
              </View>
            </TouchableRipple>

            <TouchableRipple
              onPress={handleMoveSetDown}
              disabled={!canMoveSetDown}
            >
              <View style={styles.setOption}>
                <Icon
                  source="arrow-down"
                  size={24}
                  color={canMoveSetDown ? "white" : "darkgray"}
                />
                <Text
                  variant="bodyLarge"
                  style={{ color: canMoveSetDown ? "white" : "darkgray" }}
                >
                  Move set down
                </Text>
              </View>
            </TouchableRipple>

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
      </Portal>
    </Portal.Host>
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
  sessionDeload: {
    color: "darkgray",
    fontSize: 14,
  },
  sessionDateButtons: {
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
  dateRow: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 7,
    gap: 15,
    marginTop: 15,
  },
});
