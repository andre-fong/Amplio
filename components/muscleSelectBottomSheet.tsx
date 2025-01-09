import {
  StyleSheet,
  View,
  TextInput as TextInputRN,
  ScrollView,
} from "react-native";
import {
  Button,
  Divider,
  Icon,
  Modal,
  Snackbar,
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
import useMuscleGroups from "@/hooks/useMuscleGroups";
import { FlashList } from "@shopify/flash-list";
import { addMuscleGroup } from "@/api/muscleGroups";

export default function MuscleSelectBottomSheet({
  open,
  setOpen,
  onMuscleGroupSelect,
  data,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onMuscleGroupSelect: (muscleGroup: MuscleGroup) => void;
  data: any;
}) {
  const { muscleGroups, loading, refresh } = useMuscleGroups();

  // Open bottom sheet when open is true
  useEffect(() => {
    if (open) {
      bottomSheetRef.current?.expand();
    }
  }, [open]);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetListRef = useRef<any>(null);

  const handleMuscleSelect = useCallback(
    (muscleGroup: MuscleGroup) => {
      onMuscleGroupSelect(muscleGroup);
      handleClose();
    },
    [onMuscleGroupSelect, setOpen]
  );

  const handleClose = useCallback(() => {
    setOpen(false);
    bottomSheetRef.current?.close();
    setTimeout(() => {
      (
        bottomSheetListRef.current as FlashList<Exercise> | undefined
      )?.scrollToOffset({ offset: 0 });
    }, 350);
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

  const renderItem = useCallback(
    ({ item: muscleGroup }: { item: MuscleGroup }) => (
      <TouchableRipple
        onPress={() => {
          handleMuscleSelect(muscleGroup);
        }}
        key={muscleGroup.name}
      >
        <View style={styles.muscleGroupContainer}>
          <View>
            <Text variant="titleLarge" style={{ fontSize: 16 }}>
              {muscleGroup.name}
            </Text>
          </View>

          <Icon source="chevron-right" size={24} />
        </View>
      </TouchableRipple>
    ),
    [handleMuscleSelect]
  );

  const renderFooter = useCallback(
    () => (
      <>
        <Divider />
        {/* TODO: Add new muscle group capabilities */}
        <TouchableRipple onPress={handleNewMuscleOpen}>
          <View style={styles.muscleGroupContainer}>
            <Text
              variant="bodySmall"
              style={{ paddingVertical: 7, color: "darkgray" }}
            >
              Muscle group not listed?{" "}
              <Text
                style={{
                  fontWeight: "bold",
                  color: "lightgray",
                }}
              >
                Create a custom one.
              </Text>
            </Text>
          </View>
        </TouchableRipple>
      </>
    ),
    []
  );

  const [newMuscleOpen, setNewMuscleOpen] = useState(false);
  const [newMuscleName, setNewMuscleName] = useState("");
  const newMuscleNameRef = useRef<TextInputRN | null>(null);

  const newMuscleSaveDisabled = useMemo(
    () => newMuscleName.length === 0,
    [newMuscleName]
  );

  const [newMuscleSaving, setNewMuscleSaving] = useState(false);

  const handleNewMuscleOpen = useCallback(() => {
    setNewMuscleName("");
    setNewMuscleOpen(true);
  }, []);

  const handleNewMuscleClose = useCallback(() => {
    setNewMuscleOpen(false);
    setNewMuscleName("");
  }, []);

  const handleNewMuscleSave = useCallback(async () => {
    setNewMuscleSaving(true);
    const newMuscleGroup = await addMuscleGroup({
      name: newMuscleName.trim(),
      color: "",
    });
    if (!newMuscleGroup) {
      setSnackbarMessage(
        `Muscle group "${newMuscleName.trim()}" already exists.`
      );
      setNewMuscleSaving(false);
      return;
    }
    setNewMuscleOpen(false);
    setNewMuscleSaving(false);
    refresh();
  }, [newMuscleName]);

  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const dismissSnackbar = useCallback(() => {
    setSnackbarMessage(null);
  }, []);

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
          data={muscleGroups}
          extraData={data}
          estimatedItemSize={55}
          ref={bottomSheetListRef}
          keyExtractor={(item) => item.name}
          ListHeaderComponent={
            <View
              style={{
                paddingTop: 10,
                paddingHorizontal: 25,
                paddingBottom: 10,
                backgroundColor: Colors.secondary.main,
              }}
            >
              <Text variant="headlineMedium" style={{ fontWeight: "bold" }}>
                Muscle Groups
              </Text>
            </View>
          }
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Divider />}
          ListFooterComponent={renderFooter}
        />
      </BottomSheet>

      <Modal
        visible={newMuscleOpen}
        onDismiss={handleNewMuscleClose}
        contentContainerStyle={{
          backgroundColor: "rgb(65, 65, 65)",
          padding: 20,
          margin: 20,
          borderRadius: 3,
        }}
      >
        <ScrollView
          keyboardDismissMode="none"
          keyboardShouldPersistTaps="always"
        >
          <Text variant="titleMedium" style={{ marginBottom: 20 }}>
            New Muscle Group
          </Text>

          <TextInput
            label="Name"
            autoFocus
            ref={newMuscleNameRef}
            onChangeText={setNewMuscleName}
            theme={{ colors: { surfaceVariant: Colors.secondary.light } }}
          />

          <View style={styles.newMuscleButtons}>
            <Button
              theme={{
                colors: { primary: Colors.primary.light },
              }}
              onPress={handleNewMuscleClose}
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
              onPress={handleNewMuscleSave}
              disabled={newMuscleSaveDisabled || newMuscleSaving}
              loading={newMuscleSaving}
            >
              Save
            </Button>
          </View>
        </ScrollView>
      </Modal>

      <Snackbar
        visible={!!snackbarMessage}
        onDismiss={dismissSnackbar}
        duration={3500}
        style={{ backgroundColor: "black" }}
      >
        <Text>{snackbarMessage}</Text>
      </Snackbar>
    </>
  );
}

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: Colors.secondary.main,
  },
  muscleGroupContainer: {
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

  newMuscleButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
    gap: 15,
  },
});
