import * as SQLite from "expo-sqlite";

export async function getMuscleGroups(): Promise<MuscleGroup[]> {
  try {
    const db = await SQLite.openDatabaseAsync("amplio.db", {
      useNewConnection: true,
    });

    const muscleGroups = await db.getAllAsync<MuscleGroup>(
      `SELECT name, color FROM MuscleGroup`
    );

    db.closeAsync();
    return muscleGroups;
  } catch (error) {
    console.error(error);
    return [];
  }
}
