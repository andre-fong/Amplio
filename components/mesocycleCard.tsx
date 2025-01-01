import { Pressable, StyleSheet, View } from "react-native";
import {
  Chip,
  Divider,
  Icon,
  IconButton,
  Menu,
  ProgressBar,
  Text,
  TouchableRipple,
} from "react-native-paper";
import { useState } from "react";
import Colors from "@/constants/colors";

export default function MesocycleCard({
  data,
  onDelete,
}: {
  data: Mesocycle;
  onDelete: (mesoId: number | null) => void;
}) {
  ///////////// DATA //////////////
  const showYear =
    new Date(data.startDate).getFullYear() !== new Date().getFullYear();
  const startDate = new Date(data.startDate).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const endDate = data.endDate ? (
    new Date(data.endDate).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  ) : (
    <Text variant="bodyMedium" style={{ fontWeight: "bold" }}>
      Ongoing
    </Text>
  );

  ///////////// FORM STATE /////////////
  const [mesoOptionsOpen, setMesoOptionsOpen] = useState(false);

  return (
    <TouchableRipple
      style={styles.container}
      onPress={() => {
        console.log("hello");
      }}
      onLongPress={() => {
        setMesoOptionsOpen(true);
      }}
    >
      <>
        <View style={styles.headerRow}>
          <Text
            variant="titleLarge"
            ellipsizeMode="tail"
            numberOfLines={1}
            style={{
              flex: 1,
              marginTop: 5,
              fontWeight: "bold",
              fontSize: 20,
            }}
          >
            {data.name}
          </Text>

          <View style={styles.headerActions}>
            <IconButton
              mode="contained-tonal"
              icon="chart-bar"
              size={24}
              onPress={() => {}}
            />

            <Menu
              visible={mesoOptionsOpen}
              onDismiss={() => setMesoOptionsOpen(false)}
              anchor={
                <IconButton
                  icon="dots-vertical"
                  size={24}
                  onPress={() => {
                    setMesoOptionsOpen(true);
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
                title={data.notes ? "Edit note" : "Add note"}
              />
              <Menu.Item
                leadingIcon="tag"
                onPress={() => {}}
                title="Change name"
              />
              <Menu.Item
                leadingIcon="pencil"
                onPress={() => {}}
                title="Edit structure"
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
                  <Icon
                    source="delete"
                    color={Colors.primary.light}
                    size={size}
                  />
                )}
                onPress={() => {
                  onDelete(data.id);
                  setMesoOptionsOpen(false);
                }}
                title="Delete mesocycle"
                titleStyle={{
                  color: Colors.primary.light,
                  filter: "brightness(2)",
                }}
              />
            </Menu>
          </View>
        </View>

        {data.notes && (
          <Pressable style={styles.notes} onPress={() => {}}>
            <Icon source="pencil" size={24} color={Colors.accent.main} />
            <Text
              variant="bodySmall"
              style={{
                color: Colors.accent.light,
                flex: 1,
                flexWrap: "wrap",
              }}
            >
              {data.notes}
            </Text>
          </Pressable>
        )}

        <View style={styles.tagsContainer}>
          {data.type === "planned" ? (
            <>
              {[
                "Planned",
                `${data.numMicrocycles} microcycles`,
                `${data.numSessionsPerMicrocycle} days / microcycle`,
              ].map((tag) => (
                <Chip
                  key={tag}
                  compact
                  style={{
                    backgroundColor: "rgba(222, 0, 0, 0.5)",
                    filter: "brightness(1.1)",
                  }}
                  textStyle={{
                    color: "white",
                    opacity: 0.7,
                    fontSize: 12,
                  }}
                >
                  {tag}
                </Chip>
              ))}
            </>
          ) : (
            <Chip
              compact
              mode="outlined"
              style={{
                backgroundColor: Colors.secondary.light,
              }}
              textStyle={{
                color: "white",
                opacity: 0.7,
                fontSize: 12,
              }}
            >
              {data.numMicrocycles} weeks
            </Chip>
          )}
        </View>

        <View style={styles.dateRow}>
          <Icon source="calendar" size={22} />

          <Text variant="bodySmall" style={{ marginLeft: 5 }}>
            {startDate}{" "}
            {showYear && `(${new Date(data.startDate).getFullYear()})`}
            {"  —  "}
            {endDate}{" "}
            {showYear &&
              !!data.endDate &&
              `(${new Date(data.endDate).getFullYear()})`}
          </Text>
        </View>

        {data.type === "planned" && (
          <View style={styles.progressContainer}>
            <View style={{ flex: 1 }}>
              <ProgressBar
                animatedValue={data.percentFinished / 100}
                color={Colors.accent.main}
              />
            </View>
            <Text
              variant="bodySmall"
              style={{
                color: Colors.accent.dark,
                fontWeight: "bold",
                filter: "brightness(0.9)",
              }}
            >
              {data.percentFinished}%
            </Text>
          </View>
        )}
      </>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary.light,
    padding: 15,
    borderRadius: 3,
  },
  headerRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  headerActions: {
    marginTop: -10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  tagsContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },
  notes: {
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
  progressContainer: {
    marginTop: 15,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  dateRow: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    paddingHorizontal: 7,
    gap: 5,
    marginTop: 5,
  },
});
