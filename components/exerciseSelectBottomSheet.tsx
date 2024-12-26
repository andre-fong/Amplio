import { StyleSheet, View } from "react-native";
import {
  Divider,
  Icon,
  Searchbar,
  Text,
  TouchableRipple,
} from "react-native-paper";
import { useRef, useState } from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlashList,
  BottomSheetFlatList,
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

export default function ExerciseSelectBottomSheet({
  open,
  setOpen,
}: // onExerciseSelect,
{
  open: boolean;
  setOpen: (open: boolean) => void;
  // TODO: Change exercise param type
  // onExerciseSelect: (exercise: string) => void;
}) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      {open && (
        <BottomSheet
          backgroundStyle={{ backgroundColor: Colors.secondary.main }}
          snapPoints={["80%"]}
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
            setOpen(false);
          }}
          index={0}
        >
          <View
            style={{
              paddingTop: 10,
              paddingHorizontal: 25,
              paddingBottom: 15,
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
            {/* TODO: Filters */}
            <View></View>
          </View>

          <BottomSheetFlashList
            contentContainerStyle={styles.sheetContainer}
            data={mockExerciseList}
            estimatedItemSize={20}
            renderItem={({ item: exercise }) => (
              <TouchableRipple onPress={() => {}} key={exercise.id}>
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
            )}
          />
        </BottomSheet>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  sheetContainer: {
    paddingBottom: 10,
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
});
