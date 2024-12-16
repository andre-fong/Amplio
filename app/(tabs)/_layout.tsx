import { View, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { Icon, Text } from "react-native-paper";
import Colors from "@/constants/colors";

function TabIcon({
  focused,
  color,
  size,
  source,
  title,
}: {
  focused: boolean;
  color: string;
  size: number;
  source: string;
  title: string;
}) {
  return (
    <View style={styles.tabContainer}>
      <View style={styles.iconContainer}>
        <Icon source={source} color={color} size={size} />
        {focused && <View style={styles.activeIndicator} />}
      </View>
      <Text style={focused ? styles.tabTitleActive : styles.tabTitle}>
        {title}
      </Text>
    </View>
  );
}

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: Colors.primary.main,
          tabBarStyle: {
            backgroundColor: Colors.secondary.dark,
            height: 80,
            borderTopWidth: 0,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Logs",
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => (
              <TabIcon
                focused={focused}
                title="Logs"
                source={focused ? "notebook-edit" : "notebook-edit-outline"}
                color={color}
                size={size}
              />
            ),
            tabBarIconStyle: {
              width: "100%",
              height: "100%",
            },
          }}
        />
        <Tabs.Screen
          name="mesocycles"
          options={{
            title: "Mesocycles",
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => (
              <TabIcon
                focused={focused}
                title="Mesocycles"
                source={focused ? "calendar-month" : "calendar-month-outline"}
                color={color}
                size={size}
              />
            ),
            tabBarIconStyle: {
              width: "100%",
              height: "100%",
            },
          }}
        />
        <Tabs.Screen
          name="graphs"
          options={{
            title: "Graphs",
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => (
              <TabIcon
                focused={focused}
                title="Graphs"
                source={focused ? "chart-areaspline-variant" : "chart-line"}
                color={color}
                size={size}
              />
            ),
            tabBarIconStyle: {
              width: "100%",
              height: "100%",
            },
          }}
        />
        <Tabs.Screen
          name="me"
          options={{
            title: "Me",
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => (
              <TabIcon
                focused={focused}
                title="Me"
                source={focused ? "account-circle" : "account-circle-outline"}
                color={color}
                size={size}
              />
            ),
            tabBarIconStyle: {
              width: "100%",
              height: "100%",
            },
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({
  tabContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  tabTitle: {
    fontSize: 11,
    marginTop: 7,
    color: "white",
  },
  tabTitleActive: {
    fontSize: 11,
    marginTop: 7,
    color: Colors.primary.light,
    fontWeight: "600",
  },
  iconContainer: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
  },
  activeIndicator: {
    position: "absolute",
    height: 32,
    left: -16,
    right: -16,
    backgroundColor: Colors.primary.light,
    borderRadius: 99,
    opacity: 0.2,
  },
});
