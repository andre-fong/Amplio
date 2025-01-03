import { StyleSheet, View } from "react-native";
import { Divider, Icon, Text, TouchableRipple } from "react-native-paper";
import { useCallback, useEffect, useRef } from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlashList,
} from "@gorhom/bottom-sheet";
import Colors from "@/constants/colors";
import useMuscleGroups from "@/hooks/useMuscleGroups";
import { FlashList } from "@shopify/flash-list";

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
  const { muscleGroups, loading } = useMuscleGroups();

  // Open bottom sheet when open is true
  useEffect(() => {
    if (open) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
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
          // TODO: Change estimatedItemSize once restyled
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
