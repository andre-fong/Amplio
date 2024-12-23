import { StyleSheet, View } from "react-native";
import {
  Divider,
  Icon,
  IconButton,
  Menu,
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
              title="Add note"
            />
            <Menu.Item
              leadingIcon="tag"
              onPress={() => {}}
              title="Change name"
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
    marginBottom: 10,
  },
  headerActions: {
    marginTop: -10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});
