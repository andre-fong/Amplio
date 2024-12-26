import { StyleSheet, View } from "react-native";
import { Divider, Icon, Text, TouchableRipple } from "react-native-paper";
import { useCallback, useRef } from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlashList,
} from "@gorhom/bottom-sheet";
import Colors from "@/constants/colors";

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

export default function MuscleSelectBottomSheet({
  open,
  setOpen,
  onMuscleGroupSelect,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onMuscleGroupSelect: (muscleGroup: MuscleGroup) => void;
}) {
  const bottomSheetRef = useRef<BottomSheet>(null);

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
  }, [setOpen, bottomSheetRef]);

  return (
    <>
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
        onClose={handleClose}
        index={open ? 0 : -1}
      >
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

        <BottomSheetFlashList
          contentContainerStyle={styles.sheetContainer}
          data={mockMuscleGroupList}
          estimatedItemSize={20}
          keyExtractor={(item) => item.name}
          renderItem={({ item: muscleGroup }) => (
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
          )}
          ItemSeparatorComponent={() => <Divider />}
          ListFooterComponent={
            <>
              <Divider />
              {/* TODO: Add new muscle group capabilities */}
              <TouchableRipple onPress={() => {}}>
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
          }
        />
      </BottomSheet>
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
});
