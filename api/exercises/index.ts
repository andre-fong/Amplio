import * as SQLite from "expo-sqlite";

type GetExerciseParams = {
  targetMuscleGroups?: string[];
  searchQuery?: string;
};

export async function getExercises(
  params?: GetExerciseParams
): Promise<Exercise[]> {
  try {
    // TODO: Format result better
    const db = await SQLite.openDatabaseAsync("amplio.db", {
      useNewConnection: true,
    });
    const queryParams = [];

    const muscleGroupQuery = params?.targetMuscleGroups
      ? params.targetMuscleGroups
          .map((_, index) => `muscleGroupName = ?`)
          .join(" OR ")
      : undefined;
    if (params?.targetMuscleGroups)
      queryParams.push(...params.targetMuscleGroups);

    const searchQueryParams = params?.searchQuery
      ? `%${params.searchQuery.trim()}%`
      : undefined;
    if (searchQueryParams) queryParams.push(searchQueryParams);

    const exercises = await db.getAllAsync<
      Omit<Exercise, "synergistMuscles" | "targetMuscle"> & {
        targetMuscle: string;
      }
    >(
      `
    SELECT 
      e.id,
      e.name,
      e.equipment,
      json_object('name', m.name, 'color', m.color) AS targetMuscle
    FROM Exercise e
    JOIN Recruits r ON e.id = r.exerciseId
    JOIN MuscleGroup m ON r.muscleGroupName = m.name
    WHERE r.relationship = 'target' 
    ${muscleGroupQuery ? `AND (${muscleGroupQuery})` : ""} 
    ${searchQueryParams ? `AND e.name LIKE ?` : ""}
    ORDER BY e.name ASC
  `,
      queryParams
    );

    db.closeAsync();
    return exercises.map((exercise) => ({
      ...exercise,
      targetMuscle: JSON.parse(exercise.targetMuscle) as MuscleGroup,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function addExercise(
  newExercise: Exercise
): Promise<Exercise | null> {
  try {
    const db = await SQLite.openDatabaseAsync("amplio.db", {
      useNewConnection: true,
    });

    const exerciseId = (
      await db.runAsync(
        `
      INSERT INTO Exercise (name, equipment)
      `,
        [newExercise.name, newExercise.equipment]
      )
    ).lastInsertRowId;

    await db.runAsync(
      `
      INSERT INTO Recruits (exerciseId, muscleGroupName, relationship)
      `,
      [exerciseId, newExercise.targetMuscle.name, "target"]
    );

    db.closeAsync();
    return newExercise;
  } catch (error) {
    console.error(error);
    return null;
  }
}
