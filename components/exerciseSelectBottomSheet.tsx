import { StyleSheet, View, Keyboard } from "react-native";
import { FlatList as FlatListGH } from "react-native-gesture-handler";
import {
  Chip,
  Divider,
  Icon,
  Searchbar,
  Text,
  TouchableRipple,
} from "react-native-paper";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlashList,
} from "@gorhom/bottom-sheet";
import Colors from "@/constants/colors";
import useExercises from "@/hooks/useExercises";
import useMuscleGroups from "@/hooks/useMuscleGroups";
import { FlashList } from "@shopify/flash-list";

export default function ExerciseSelectBottomSheet({
  open,
  setOpen,
  onExerciseSelect,
  filter,
  data,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onExerciseSelect: (exercise: Exercise) => void;
  filter?: string;
  data: any;
}) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetListRef = useRef<any>(null);
  const muscleGroupsListRef = useRef<FlatListGH<MuscleGroup>>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<
    Record<string, boolean>
  >({});
  const selectedMuscleGroupNames = useMemo(
    () => Object.keys(selectedMuscleGroups),
    [selectedMuscleGroups]
  );

  const { exercises, loading } = useExercises({
    targetMuscleGroups: selectedMuscleGroupNames,
    searchQuery,
  });

  const { muscleGroups, loading: musclesLoading } = useMuscleGroups();

  // Open bottom sheet when open is true, and set filter if provided
  useEffect(() => {
    if (open) {
      if (filter) {
        setSelectedMuscleGroups({ [filter]: true });
        // scroll to selected muscle group
        muscleGroupsListRef.current?.scrollToIndex({
          index: muscleGroups.findIndex((muscle) => muscle.name === filter),
          animated: false,
          viewOffset: 20,
        });
      } else {
        setSelectedMuscleGroups({});
      }
      bottomSheetRef.current?.expand();
    }
  }, [open, filter, muscleGroups]);

  const handleMuscleGroupSelect = useCallback(
    (muscleGroupName: string) => {
      setSelectedMuscleGroups((prev) => {
        if (prev[muscleGroupName]) {
          delete prev[muscleGroupName];
          return { ...prev };
        }
        return { ...prev, [muscleGroupName]: true };
      });
    },
    [setSelectedMuscleGroups]
  );

  const handleExerciseSelect = useCallback(
    (exercise: Exercise) => {
      onExerciseSelect(exercise);
      handleClose();
      setTimeout(() => {
        Keyboard.dismiss();
      }, 500);
    },
    [onExerciseSelect]
  );

  const handleClose = useCallback(() => {
    setOpen(false);
    bottomSheetRef.current?.close();
    setTimeout(() => {
      (
        bottomSheetListRef.current as FlashList<Exercise> | undefined
      )?.scrollToOffset({ offset: 0 });
    }, 300);
  }, []);

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
  const flashListKeyExtractor = useCallback(
    (item: Exercise) => item.id.toString(),
    []
  );

  const muscleListItemSeparatorComponent = useCallback(
    () => <View style={{ marginHorizontal: 8 }} />,
    []
  );
  const flashListItemSeparatorComponent = useCallback(() => <Divider />, []);

  return (
    <>
      <BottomSheet
        backgroundStyle={{ backgroundColor: Colors.secondary.main }}
        snapPoints={[85, "80%"]}
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
        onClose={handleClose}
        index={-1}
      >
        <BottomSheetFlashList
          contentContainerStyle={styles.sheetContainer}
          data={exercises}
          extraData={data}
          ref={bottomSheetListRef}
          estimatedItemSize={80}
          keyExtractor={flashListKeyExtractor}
          keyboardShouldPersistTaps="always"
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
                loading={loading || musclesLoading}
                theme={{ colors: { onSurface: "rgb(137, 124, 121)" } }}
              />

              <FlatListGH
                style={styles.muscleGroupsFilters}
                ItemSeparatorComponent={muscleListItemSeparatorComponent}
                horizontal
                data={muscleGroups}
                renderItem={renderMuscleItem}
                keyExtractor={muscleListKeyExtractor}
                ref={muscleGroupsListRef}
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
