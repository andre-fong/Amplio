import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  TextInput as TextInputRN,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  useWindowDimensions,
} from "react-native";
import {
  Appbar,
  Button,
  Chip,
  Icon,
  IconButton,
  List,
  Menu,
  Modal,
  Portal,
  Text,
  TextInput,
  Tooltip,
  TouchableRipple,
} from "react-native-paper";
import Colors from "@/constants/colors";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ExerciseSelectBottomSheet from "@/components/exerciseSelectBottomSheet";
import MuscleSelectBottomSheet from "@/components/muscleSelectBottomSheet";
import DragList from "react-native-draglist";
import { Calendar, DateData } from "react-native-calendars";
import { getCalendarDateString } from "react-native-calendars/src/services";

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
    id: "6",
    name: "Tricep Extension",
    targetMuscle: {
      name: "Triceps",
      color: "pink",
    },
    equipment: "Dumbbell",
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

export default function NewPlannedMesocycle() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [sessionIndex, setSessionIndex] = useState(0);

  const [mesocycleTitle, setMesocycleTitle] = useState("");
  const [mesocycleNotes, setMesocycleNotes] = useState("");
  const [mesocycleNotesSaved, setMesocycleNotesSaved] = useState("");
  const [mesocycleOptionsOpen, setMesocycleOptionsOpen] = useState(false);
  const [mesocycleNotesOpen, setMesocycleNotesOpen] = useState(false);

  const mesoNotesRef = useRef<TextInputRN | null>(null);

  useEffect(() => {
    setTimeout(() => {
      if (mesocycleNotesOpen && mesoNotesRef.current) {
        mesoNotesRef.current?.focus();
      }
    }, 150);
  }, [mesocycleNotesOpen]);

  const handleMesoNotesCancel = useCallback(() => {
    setMesocycleNotes(mesocycleNotesSaved);
    setMesocycleNotesOpen(false);
  }, [mesocycleNotesSaved]);

  const handleMesoNotesSave = useCallback(() => {
    setMesocycleNotesSaved(mesocycleNotes);
    setMesocycleNotesOpen(false);
  }, [mesocycleNotes]);

  const handleMesoNotesClear = useCallback(() => {
    setMesocycleNotes("");
    if (mesoNotesRef.current) {
      mesoNotesRef.current?.clear();
    }
  }, []);

  const [muscleGroupListOpen, setMuscleGroupListOpen] = useState(false);
  const [exercisesListOpen, setExercisesListOpen] = useState(false);

  const [exercises, setExercises] = useState<Exercise[]>(mockExerciseList);
  const exerciseDragListRef = useRef<FlatList<Exercise> | null>(null);

  const onReordered = useCallback(
    async (fromIndex: number, toIndex: number) => {
      const copy = [...exercises];
      const removed = copy.splice(fromIndex, 1);

      copy.splice(toIndex, 0, removed[0]);
      setExercises(copy);
    },
    [exercises]
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const contentOffsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(contentOffsetX / width);
      setSessionIndex(index);
    },
    [width]
  );

  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined
  );
  const formattedDate = useMemo(() => {
    if (!selectedDate)
      return <Text style={{ color: "lightgray" }}>Select a start date</Text>;

    const userTimezoneOffset = new Date().getTimezoneOffset() * 60000;
    return new Date(
      new Date(selectedDate).getTime() + userTimezoneOffset
    ).toLocaleDateString(undefined, {
      year: "numeric",
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }, [selectedDate]);

  const onDayPress = useCallback(
    (day: DateData) => {
      if (day.dateString === selectedDate) setSelectedDate(undefined);
      else setSelectedDate(day.dateString);
    },
    [selectedDate]
  );

  const marked = useMemo(() => {
    if (!selectedDate) return {};

    return {
      [selectedDate]: {
        selected: true,
      },
    };
  }, [selectedDate]);

  return (
    <Portal.Host>
      <Appbar.Header
        style={{ height: 70, backgroundColor: Colors.secondary.dark }}
      >
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content
          title={
            <Text
              style={styles.headerTitle}
              variant="titleLarge"
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              Plan a Mesocycle
            </Text>
          }
        />

        <Tooltip title="Create mesocycle">
          <Appbar.Action
            icon={() => (
              <Icon source="check" size={32} color={Colors.primary.light} />
            )}
            animated={false}
            size={32}
            onPress={() => {}}
            style={{ marginRight: 10 }}
          />
        </Tooltip>
      </Appbar.Header>

      <ScrollView
        style={styles.container}
        keyboardDismissMode="on-drag"
        nestedScrollEnabled
      >
        <View style={styles.mesoMainInfo}>
          <View style={styles.mesoInfoTopRow}>
            <View style={styles.mesoName}>
              <TextInput
                value={mesocycleTitle}
                onChangeText={setMesocycleTitle}
                placeholder="Untitled Mesocycle"
              />
            </View>

            <View style={styles.mesoInfoTopButtons}>
              <Menu
                visible={mesocycleOptionsOpen}
                onDismiss={() => setMesocycleOptionsOpen(false)}
                anchor={
                  <IconButton
                    icon="dots-vertical"
                    size={32}
                    onPress={() => {
                      setMesocycleOptionsOpen(true);
                    }}
                    style={{ marginTop: -2, marginRight: -5 }}
                  />
                }
                anchorPosition="bottom"
                mode="elevated"
                elevation={5}
              >
                {/* <Menu.Item
                  leadingIcon="tag"
                  onPress={() => {}}
                  title="Change session name"
                />
                <Divider
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                  bold
                /> */}
                <Menu.Item
                  leadingIcon={({ size }) => (
                    <Icon
                      source="delete"
                      color={Colors.primary.light}
                      size={size}
                    />
                  )}
                  onPress={() => {}}
                  title="Delete mesocycle"
                  titleStyle={{
                    color: Colors.primary.light,
                    filter: "brightness(2)",
                  }}
                />
              </Menu>
            </View>
          </View>

          <Pressable
            style={styles.mesoInfoNotes}
            onPress={() => {
              setMesocycleNotesOpen(true);
            }}
          >
            <Icon source="pencil" size={24} color={Colors.accent.main} />
            <Text
              variant="bodySmall"
              style={{
                color: Colors.accent.light,
                flex: 1,
                flexWrap: "wrap",
              }}
            >
              {mesocycleNotesSaved ? (
                mesocycleNotesSaved
              ) : (
                <Text
                  variant="bodySmall"
                  style={{ color: Colors.accent.dark, fontStyle: "italic" }}
                >
                  Add notes...
                </Text>
              )}
            </Text>
          </Pressable>

          <View style={styles.dateRow}>
            <List.Accordion
              title={
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 20,
                  }}
                >
                  <Icon source="calendar" size={24} color="darkgray" />
                  <Text variant="bodySmall" style={styles.sessionDateInfoText}>
                    {formattedDate}
                  </Text>
                </View>
              }
              right={(props) => null}
              style={styles.datePressable}
              rippleColor="rgba(255, 255, 255, 0.1)"
            >
              <Calendar
                hideExtraDays
                current={selectedDate}
                onDayPress={onDayPress}
                markedDates={marked}
                theme={{
                  calendarBackground: "transparent",
                  monthTextColor: "white",
                  arrowColor: Colors.primary.light,
                  dayTextColor: "white",
                  todayTextColor: "#fcbbbb",
                  selectedDayBackgroundColor: Colors.primary.main,
                  textDisabledColor: "gray",
                }}
              />
            </List.Accordion>
          </View>
        </View>

        <FlatList
          data={[1, 2, 3]}
          // keyExtractor={(item) => item.date.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          bouncesZoom={false}
          onScroll={handleScroll}
          ListFooterComponent={() => (
            <View style={{ width, flex: 1 }}>
              <TouchableRipple
                style={[
                  styles.sessionContainer,
                  {
                    height: 80,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 12,
                  },
                ]}
                onPress={() => {}}
              >
                <>
                  <Icon source="plus" size={28} color="darkgray" />
                  <Text variant="titleMedium" style={{ color: "darkgray" }}>
                    ADD SESSION
                  </Text>
                </>
              </TouchableRipple>
            </View>
          )}
          renderItem={() => (
            <View style={{ width, flex: 1, marginBottom: 10 }}>
              <View style={styles.sessionContainer}>
                <View style={styles.mesoInfoTopRow}>
                  <View style={styles.sessionName}>
                    <TextInput
                      style={{ height: 42 }}
                      contentStyle={{ fontSize: 14 }}
                      // value={mesocycleTitle}
                      // onChangeText={setMesocycleTitle}
                      // placeholder="Untitled Mesocycle"
                    />
                  </View>

                  <IconButton
                    style={{ filter: "brightness(2)" }}
                    icon={() => (
                      <Icon
                        source="delete"
                        color={Colors.primary.light}
                        size={24}
                      />
                    )}
                    onPress={() => {}}
                  />
                </View>

                <DragList
                  keyExtractor={(item) => item.id}
                  ItemSeparatorComponent={() => (
                    <View style={{ marginBottom: 10 }} />
                  )}
                  data={exercises}
                  style={styles.exerciseList}
                  onReordered={onReordered}
                  scrollEnabled={false}
                  ref={exerciseDragListRef}
                  renderItem={({
                    item: exercise,
                    onDragStart,
                    onDragEnd,
                    isActive,
                  }) => (
                    <View
                      style={[
                        styles.exerciseContainer,
                        {
                          transform: isActive ? [{ scale: 1.05 }] : [],
                          opacity: isActive ? 0.8 : 1,
                        },
                      ]}
                    >
                      <View style={styles.exerciseTopRow}>
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
                            fontSize: 12,
                          }}
                        >
                          {exercise.targetMuscle.name.toUpperCase()}
                        </Chip>

                        <IconButton
                          icon={() => <Icon source="drag" size={24} />}
                          onLongPress={onDragStart}
                          delayLongPress={250}
                          onPressOut={onDragEnd}
                        />
                      </View>

                      <Pressable
                        style={styles.exerciseEditable}
                        onPress={() => {
                          setExercisesListOpen(true);
                        }}
                        disabled={isActive}
                      >
                        <Text
                          variant="titleLarge"
                          style={{ fontSize: 18, fontWeight: "bold" }}
                        >
                          {exercise.name}
                        </Text>
                        <Text
                          variant="bodySmall"
                          style={{ color: "darkgray", marginTop: 2 }}
                        >
                          {exercise.equipment.toUpperCase()}
                        </Text>
                      </Pressable>
                    </View>
                  )}
                />

                <Button
                  style={{ marginTop: 10 }}
                  labelStyle={{ fontSize: 13, color: Colors.primary.light }}
                  onPress={() => {
                    setMuscleGroupListOpen(true);
                  }}
                  icon={() => (
                    <Icon
                      source="plus"
                      size={24}
                      color={Colors.primary.light}
                    />
                  )}
                >
                  ADD A MUSCLE GROUP
                </Button>
              </View>
            </View>
          )}
        />

        {/* <View style={{ margin: 10, height: 50, marginBottom: 30 }}>
          <Button
            style={styles.addSessionButton}
            contentStyle={{ height: "100%" }}
            icon={() => <Icon source="plus" size={24} color="darkgray" />}
            labelStyle={{ color: "darkgray" }}
            onPress={() => {}}
            rippleColor="#424242"
          >
            ADD SESSION
          </Button>
        </View> */}
      </ScrollView>

      <Portal>
        <MuscleSelectBottomSheet
          open={muscleGroupListOpen}
          setOpen={setMuscleGroupListOpen}
          onMuscleGroupSelect={() => {}}
        />

        <ExerciseSelectBottomSheet
          open={exercisesListOpen}
          setOpen={setExercisesListOpen}
          onExerciseSelect={() => {}}
        />
        <Modal
          visible={mesocycleNotesOpen}
          onDismiss={handleMesoNotesCancel}
          contentContainerStyle={{
            backgroundColor: "rgb(65, 65, 65)",
            padding: 20,
            margin: 20,
            borderRadius: 3,
          }}
        >
          <Text variant="titleMedium" style={{ marginBottom: 20 }}>
            {!mesocycleNotesSaved ? "Add session note" : "Edit session note"}
          </Text>

          <TextInput
            label="Session notes"
            defaultValue={mesocycleNotes}
            ref={mesoNotesRef}
            onChangeText={setMesocycleNotes}
            multiline
            right={
              <TextInput.Icon
                icon="close"
                size={20}
                onPress={handleMesoNotesClear}
              />
            }
            numberOfLines={4}
            contentStyle={{ marginVertical: 5 }}
            theme={{ colors: { surfaceVariant: Colors.secondary.light } }}
          />

          <View style={styles.mesoNotesButtons}>
            <Button
              theme={{ colors: { primary: Colors.accent.light } }}
              onPress={handleMesoNotesCancel}
            >
              Cancel
            </Button>
            <Button
              theme={{
                colors: { primary: Colors.accent.light, onPrimary: "black" },
              }}
              // rippleColor={Colors.accent.dark}
              mode="contained"
              onPress={handleMesoNotesSave}
            >
              Save
            </Button>
          </View>
        </Modal>
      </Portal>
    </Portal.Host>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary.main,
  },
  headerTitle: {
    paddingLeft: 5,
    fontWeight: "bold",
  },
  mesoMainInfo: {
    margin: 10,
    backgroundColor: Colors.secondary.light,
    padding: 15,
    borderRadius: 3,
  },
  mesoName: {
    flex: 1,
  },
  mesoInfoTopRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    marginBottom: 8,
  },
  mesoInfoTopButtons: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  mesoInfoNotes: {
    marginVertical: 12,
    padding: 7,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.accent.dark,
  },
  mesoNotesButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 15,
  },

  sessionContainer: {
    margin: 10,
    backgroundColor: Colors.secondary.light,
    padding: 15,
    borderRadius: 3,
  },
  sessionName: {
    flex: 0.8,
  },
  addSessionButton: {
    margin: "auto",
    width: "100%",
    backgroundColor: Colors.secondary.light,
    borderRadius: 3,
  },
  sessionDateInfoText: {
    fontSize: 13,
  },
  dateRow: {
    flex: 1,
    gap: 15,
    marginTop: 5,
  },
  datePressable: {
    backgroundColor: Colors.secondary.main,
  },

  exerciseList: {
    paddingHorizontal: 10,
    marginHorizontal: -10,
    marginVertical: 10,
  },
  exerciseContainer: {
    // borderColor: "lightgray",
    // borderRadius: 3,
    // borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: "#292929",
  },
  exercisePlaceholder: {
    width: "100%",
    height: 120,
    opacity: 0.8,
  },
  exerciseTopRow: {
    marginTop: 5,
    paddingHorizontal: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exerciseEditable: {
    margin: 10,
    marginBottom: 5,
    marginTop: -4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: Colors.secondary.main,
    borderRadius: 3,
  },
});
