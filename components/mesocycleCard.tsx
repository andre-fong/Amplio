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

export default function MesocycleCard({ data }: { data: Mesocycle }) {
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
            variant="titleMedium"
            ellipsizeMode="tail"
            numberOfLines={1}
            style={{
              flex: 1,
              marginTop: 5,
              fontSize: 18,
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

        {/* TODO: Date range */}

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
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
});
