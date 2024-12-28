import { FlatList, StyleSheet, View } from "react-native";
import {
  FlatList as FlatListGH,
  ScrollView,
} from "react-native-gesture-handler";
import {
  Chip,
  Divider,
  Icon,
  Searchbar,
  Text,
  TouchableRipple,
} from "react-native-paper";
import { useCallback, useEffect, useRef, useState } from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlashList,
} from "@gorhom/bottom-sheet";
import Colors from "@/constants/colors";

const mockExerciseList: Exercise[] = [
  {
    id: "1",
    name: "Bench Press",
    targetMuscle: {
      name: "Chest",
      color: "red",
    },
    equipment: "Barbell",
  },
  {
    id: "2",
    name: "Squat",
    targetMuscle: {
      name: "Quads",
      color: "green",
    },
    equipment: "Barbell",
  },
  {
    id: "3",
    name: "Deadlift",
    targetMuscle: {
      name: "Hamstrings",
      color: "yellow",
    },
    equipment: "Barbell",
  },
  {
    id: "4",
    name: "Pull-up",
    targetMuscle: {
      name: "Back",
      color: "blue",
    },
    equipment: "Bodyweight",
  },
  {
    id: "5",
    name: "Dumbbell Curl",
    targetMuscle: {
      name: "Biceps",
      color: "purple",
    },
    equipment: "Dumbbell",
  },
  {
    id: "6",
    name: "Tricep Extension",
    targetMuscle: {
      name: "Triceps",
      color: "pink",
    },
    equipment: "Dumbbell",
  },
  {
    id: "7",
    name: "Leg Press",
    targetMuscle: {
      name: "Quads",
      color: "green",
    },
    equipment: "Machine",
  },
  {
    id: "8",
    name: "Calf Raise",
    targetMuscle: {
      name: "Calves",
      color: "orange",
    },
    equipment: "Machine",
  },
  {
    id: "9",
    name: "Shoulder Press",
    targetMuscle: {
      name: "Shoulders",
      color: "cyan",
    },
    equipment: "Barbell",
  },
  {
    id: "10",
    name: "Lat Pulldown",
    targetMuscle: {
      name: "Back",
      color: "blue",
    },
    equipment: "Machine",
  },
  {
    id: "11",
    name: "Hammer Curl",
    targetMuscle: {
      name: "Biceps",
      color: "purple",
    },
    equipment: "Dumbbell",
  },
  {
    id: "12",
    name: "Skullcrusher",
    targetMuscle: {
      name: "Triceps",
      color: "pink",
    },
    equipment: "Barbell",
  },
];

const mockMuscleGroupList: MuscleGroup[] = [
  { name: "Chest", color: "red" },
  { name: "Quads", color: "green" },
  { name: "Hamstrings", color: "yellow" },
  { name: "Back", color: "blue" },
  { name: "Biceps", color: "purple" },
  { name: "Triceps", color: "pink" },
  { name: "Calves", color: "orange" },
  { name: "Shoulders", color: "cyan" },
];

export default function ExerciseSelectBottomSheet({
  open,
  setOpen,
  onExerciseSelect,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onExerciseSelect: (exercise: Exercise) => void;
}) {
  // Open bottom sheet when open is true
  useEffect(() => {
    if (open) {
      bottomSheetRef.current?.expand();
    }
  }, [open]);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<
    Record<string, boolean>
  >({
    Chest: true,
  });

  const handleMuscleGroupSelect = useCallback(
    (muscleGroupName: string) => {
      setSelectedMuscleGroups((prev) => ({
        ...prev,
        [muscleGroupName]: !prev[muscleGroupName],
      }));
    },
    [setSelectedMuscleGroups]
  );

  const handleExerciseSelect = useCallback(
    (exercise: Exercise) => {
      onExerciseSelect(exercise);
      handleClose();
    },
    [onExerciseSelect, setOpen]
  );

  const handleClose = useCallback(() => {
    setOpen(false);
    bottomSheetRef.current?.close();
  }, [setOpen, bottomSheetRef]);

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

  const renderFooter = useCallback(
    () => (
      <>
        <Divider />
        {/* TODO: Add new exercise capabilities */}
        <TouchableRipple onPress={() => {}}>
          <View style={styles.exerciseContainer}>
            <Text
              variant="bodySmall"
              style={{ paddingVertical: 7, color: "darkgray" }}
            >
              Exercise not listed?{" "}
              <Text
                style={{
                  fontWeight: "bold",
                  color: "lightgray",
                }}
              >
                Create a custom exercise.
              </Text>
            </Text>
          </View>
        </TouchableRipple>
      </>
    ),
    []
  );

  const renderMuscleItem = useCallback(
    ({ item: muscleGroup }: { item: MuscleGroup }) => (
      <Chip
        key={muscleGroup.name}
        compact
        style={{
          // TODO: Set muscle group colors once they're not ugly
          backgroundColor: "rgba(222, 0, 0, 0.5)",
          filter: "brightness(1.1)",
        }}
        onPress={() => {
          handleMuscleGroupSelect(muscleGroup.name);
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          {selectedMuscleGroups[muscleGroup.name] && (
            <Icon source="check" size={20} />
          )}
          <Text
            style={{
              color: "white",
              opacity: 0.7,
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            {muscleGroup.name.toUpperCase()}
          </Text>
        </View>
      </Chip>
    ),
    [selectedMuscleGroups]
  );
  const renderItem = useCallback(
    ({ item: exercise }: { item: Exercise }) => (
      <TouchableRipple
        onPress={() => {
          handleExerciseSelect(exercise);
        }}
        key={exercise.id}
      >
        <View style={styles.exerciseContainer}>
          <View>
            <Text
              variant="titleLarge"
              style={{ fontSize: 18, fontWeight: "bold" }}
            >
              {exercise.name}
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: "darkgray", marginTop: 5 }}
            >
              {exercise.equipment.toUpperCase()}
              {"  "}
              <Text variant="bodyMedium" style={{ fontWeight: "bold" }}>
                &middot;
              </Text>
              {"  "}
              <Text style={{ color: "#b87a7a" }}>
                {exercise.targetMuscle.name.toUpperCase()}
              </Text>
            </Text>
          </View>

          <Icon source="chevron-right" size={24} />
        </View>
      </TouchableRipple>
    ),
    [handleExerciseSelect]
  );

  const muscleListKeyExtractor = useCallback(
    (item: MuscleGroup) => item.name,
    []
  );
  const flashListKeyExtractor = useCallback((item: Exercise) => item.id, []);

  const muscleListItemSeparatorComponent = useCallback(
    () => <View style={{ marginHorizontal: 8 }} />,
    []
  );
  const flashListItemSeparatorComponent = useCallback(() => <Divider />, []);

  return (
    <>
      <BottomSheet
        backgroundStyle={{ backgroundColor: Colors.secondary.main }}
        snapPoints={["50%", "80%"]}
        handleStyle={{
          height: 30,
          justifyContent: "center",
          backgroundColor: Colors.secondary.main,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
        enableDynamicSizing={false}
        handleIndicatorStyle={{ backgroundColor: "white", width: 50 }}
        ref={bottomSheetRef}
        backdropComponent={renderBackdropComponent}
        enablePanDownToClose
        onClose={handleClose}
        index={-1}
      >
        <BottomSheetFlashList
          contentContainerStyle={styles.sheetContainer}
          data={mockExerciseList}
          estimatedItemSize={20}
          keyExtractor={flashListKeyExtractor}
          ListHeaderComponent={
            <View
              style={{
                paddingTop: 10,
                paddingHorizontal: 25,
                backgroundColor: Colors.secondary.main,
              }}
            >
              <Text variant="headlineMedium" style={{ fontWeight: "bold" }}>
                Exercises
              </Text>
              <Searchbar
                placeholder="Search for an exercise"
                value={searchQuery}
                style={{ marginTop: 12 }}
                onChangeText={setSearchQuery}
                theme={{ colors: { onSurface: "rgb(137, 124, 121)" } }}
              />

              <FlatListGH
                style={styles.muscleGroupsFilters}
                ItemSeparatorComponent={muscleListItemSeparatorComponent}
                horizontal
                data={mockMuscleGroupList}
                renderItem={renderMuscleItem}
                keyExtractor={muscleListKeyExtractor}
              />
            </View>
          }
          renderItem={renderItem}
          ItemSeparatorComponent={flashListItemSeparatorComponent}
          ListFooterComponent={renderFooter}
        />
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: Colors.secondary.main,
  },
  exerciseContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 25,
  },
  muscleGroupsFilters: {
    marginTop: 15,
    paddingTop: 5,
    paddingBottom: 15,
  },
});
