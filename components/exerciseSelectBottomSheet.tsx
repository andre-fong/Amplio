import {
  StyleSheet,
  View,
  Keyboard,
  TextInput as TextInputRN,
  ScrollView,
} from "react-native";
import { FlatList as FlatListGH } from "react-native-gesture-handler";
import {
  Button,
  Checkbox,
  Chip,
  Divider,
  Icon,
  List,
  Modal,
  Searchbar,
  Text,
  TextInput,
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
import equipment from "@/constants/equipment";
import { addExercise } from "@/api/exercises";

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

  const {
    exercises,
    loading,
    refresh: refreshExercises,
  } = useExercises({
    targetMuscleGroups: selectedMuscleGroupNames,
    searchQuery,
  });

  const {
    muscleGroups,
    loading: musclesLoading,
    refresh: refreshMuscleGroups,
  } = useMuscleGroups();

  // Open bottom sheet when open is true, and set filter if provided
  useEffect(() => {
    if (open) {
      if (filter) {
        setSelectedMuscleGroups({ [filter]: true });
        // scroll to selected muscle group
        const muscleInd = muscleGroups.findIndex(
          (muscle) => muscle.name === filter
        );
        if (muscleInd !== -1) {
          muscleGroupsListRef.current?.scrollToIndex({
            index: muscleInd,
            animated: false,
            viewOffset: 20,
          });
        }
      } else {
        setSelectedMuscleGroups({});
      }
      bottomSheetRef.current?.expand();
    }
  }, [open, filter, muscleGroups]);

  // Refresh muscle groups when open is true
  useEffect(() => {
    if (open) {
      refreshMuscleGroups();
    }
  }, [open]);

  const doNothing = useCallback(() => {}, []);

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
        <TouchableRipple onPress={handleNewExerciseOpen}>
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
    [searchQuery]
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

  const [newExerciseOpen, setNewExerciseOpen] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState("");
  const newExerciseNameRef = useRef<TextInputRN | null>(null);

  const [muscleDropdownOpen, setMuscleDropdownOpen] = useState(false);
  const [muscleSelected, setMuscleSelected] = useState<string | null>(null);
  const [equipmentDropdownOpen, setEquipmentDropdownOpen] = useState(false);
  const [equipmentSelected, setEquipmentSelected] = useState<string | null>(
    null
  );
  const newExerciseSaveDisabled = useMemo(
    () => newExerciseName.length === 0 || !muscleSelected || !equipmentSelected,
    [newExerciseName, muscleSelected, equipmentSelected]
  );

  const [newExerciseSaving, setNewExerciseSaving] = useState(false);

  // Focus on new exercise name input when modal opens
  useEffect(() => {
    if (newExerciseOpen) {
      setTimeout(() => {
        newExerciseNameRef.current?.focus();
      }, 150);
    }
  }, [newExerciseOpen]);

  const handleNewExerciseOpen = useCallback(() => {
    setNewExerciseName(searchQuery);
    setNewExerciseOpen(true);
  }, [searchQuery]);

  const handleNewExerciseClose = useCallback(() => {
    setNewExerciseOpen(false);
    setNewExerciseName(searchQuery);
  }, [searchQuery]);

  const handleNewExerciseSave = useCallback(async () => {
    setNewExerciseSaving(true);
    await addExercise({
      name: newExerciseName,
      targetMuscle: {
        name: muscleSelected || "",
        color: "",
      },
      equipment: equipmentSelected as Equipment,
    });
    setNewExerciseOpen(false);
    setNewExerciseSaving(false);
    refreshExercises();
  }, [newExerciseName, muscleSelected, equipmentSelected]);

  const handleMuscleSelected = useCallback((muscle: string) => {
    setMuscleSelected(muscle);
    setMuscleDropdownOpen(false);
  }, []);

  const handleEquipmentSelected = useCallback((equip: string) => {
    setEquipmentSelected(equip);
    setEquipmentDropdownOpen(false);
  }, []);

  const handleMuscleDropdownOpen = useCallback(() => {
    newExerciseNameRef.current?.blur();
    setMuscleDropdownOpen(true);
  }, []);

  const handleEquipmentDropdownOpen = useCallback(() => {
    newExerciseNameRef.current?.blur();
    setEquipmentDropdownOpen(true);
  }, []);

  const renderDropdownTitle = useCallback(
    (title: string) => (
      <Text variant="bodySmall" style={{ color: "rgb(216, 194, 190)" }}>
        {title}
      </Text>
    ),
    []
  );

  const renderDropdownDescription = useCallback(
    (description: string) => (
      <Text variant="bodyLarge" style={{ color: "white" }}>
        {description}
      </Text>
    ),
    []
  );

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
                onScrollToIndexFailed={doNothing}
              />
            </View>
          }
          renderItem={renderItem}
          ItemSeparatorComponent={flashListItemSeparatorComponent}
          ListFooterComponent={renderFooter}
        />
      </BottomSheet>

      <Modal
        visible={newExerciseOpen}
        onDismiss={handleNewExerciseClose}
        contentContainerStyle={{
          backgroundColor: "rgb(65, 65, 65)",
          padding: 20,
          margin: 20,
          borderRadius: 3,
        }}
      >
        <ScrollView>
          <Text variant="titleMedium" style={{ marginBottom: 20 }}>
            New Exercise
          </Text>

          <TextInput
            label="Name"
            defaultValue={searchQuery}
            ref={newExerciseNameRef}
            onChangeText={setNewExerciseName}
            theme={{ colors: { surfaceVariant: Colors.secondary.light } }}
          />

          <View style={{ marginVertical: 10 }}>
            <List.Accordion
              title={renderDropdownTitle("Muscle Group")}
              description={renderDropdownDescription(
                muscleSelected || "Select a muscle group"
              )}
              theme={{
                colors: {
                  background: Colors.secondary.light,
                  onSurface: "white",
                },
              }}
              expanded={muscleDropdownOpen}
              onPress={handleMuscleDropdownOpen}
            >
              <View />
            </List.Accordion>
          </View>

          <List.Accordion
            title={renderDropdownTitle("Equipment")}
            description={renderDropdownDescription(
              equipmentSelected || "Select an equipment type"
            )}
            theme={{
              colors: {
                background: Colors.secondary.light,
                onSurface: "white",
              },
            }}
            expanded={equipmentDropdownOpen}
            onPress={handleEquipmentDropdownOpen}
          >
            <View />
          </List.Accordion>

          <View style={styles.newExerciseButtons}>
            <Button
              theme={{
                colors: { primary: Colors.primary.light },
              }}
              onPress={handleNewExerciseClose}
            >
              Cancel
            </Button>
            <Button
              theme={{
                colors: {
                  primary: Colors.primary.dark,
                  onPrimary: "white",
                },
              }}
              mode="contained"
              onPress={handleNewExerciseSave}
              disabled={newExerciseSaveDisabled || newExerciseSaving}
              loading={newExerciseSaving}
            >
              Save
            </Button>
          </View>
        </ScrollView>
      </Modal>

      <Modal
        visible={muscleDropdownOpen && newExerciseOpen}
        onDismiss={() => setMuscleDropdownOpen(false)}
        contentContainerStyle={{
          backgroundColor: "rgb(40, 40, 40)",
          padding: 20,
          margin: 20,
          borderRadius: 3,
          flex: 0.7,
        }}
      >
        <ScrollView persistentScrollbar>
          <Text style={{ marginBottom: 10, color: "darkgray" }}>
            Muscle Groups
          </Text>
          {muscleGroups.map((muscle) => (
            <Checkbox.Item
              key={muscle.name}
              label={muscle.name}
              status={muscleSelected === muscle.name ? "checked" : "unchecked"}
              onPress={() => handleMuscleSelected(muscle.name)}
            />
          ))}
        </ScrollView>
      </Modal>

      <Modal
        visible={equipmentDropdownOpen && newExerciseOpen}
        onDismiss={() => setEquipmentDropdownOpen(false)}
        contentContainerStyle={{
          backgroundColor: "rgb(40, 40, 40)",
          padding: 20,
          margin: 20,
          borderRadius: 3,
          flex: 0.7,
        }}
      >
        <ScrollView persistentScrollbar>
          <Text style={{ marginBottom: 10, color: "darkgray" }}>
            Equipment Types
          </Text>
          {equipment.map((item) => (
            <Checkbox.Item
              key={item}
              label={item}
              status={equipmentSelected === item ? "checked" : "unchecked"}
              onPress={() => handleEquipmentSelected(item)}
            />
          ))}
        </ScrollView>
      </Modal>
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

  newExerciseButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
    gap: 15,
  },
});
