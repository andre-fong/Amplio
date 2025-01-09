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

export async function addMuscleGroup(
  newMuscleGroup: MuscleGroup
): Promise<MuscleGroup | null> {
  try {
    const db = await SQLite.openDatabaseAsync("amplio.db", {
      useNewConnection: true,
    });

    // Verify name is unique
    const existingMuscleGroup = await db.getFirstAsync(
      `SELECT * FROM MuscleGroup WHERE name = ?`,
      [newMuscleGroup.name]
    );
    if (existingMuscleGroup) {
      throw new Error(`Muscle group "${newMuscleGroup.name}" already exists`);
    }

    await db.runAsync(`INSERT INTO MuscleGroup (name, color) VALUES (?, ?)`, [
      newMuscleGroup.name,
      newMuscleGroup.color || "#a30000",
    ]);

    db.closeAsync();
    return newMuscleGroup;
  } catch (error) {
    console.error(error);
    return null;
  }
}
