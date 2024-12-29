import * as SQLite from "expo-sqlite";

type GetExerciseParams = {
  muscleGroups: string[];
  searchQuery: string;
};

export async function getExercises({
  muscleGroups,
  searchQuery,
}: GetExerciseParams) {
  try {
    // TODO: Format result better
    const db = await SQLite.openDatabaseAsync("amplio.db");
    const muscleGroupQuery = muscleGroups
      .map((_, index) => `muscleGroupName = ?${index + 1}`)
      .join(" OR ");
    const muscleGroupParams = muscleGroups.map((group) => group);
    const searchQueryParams = `%${searchQuery}%`;

    const exercises = await db.getAllAsync<Exercise>(
      `
    SELECT e.id, e.name, e.equipment, e.notes, r.muscleGroupName, r.relationship
    FROM Exercise e
    JOIN Recruits r ON e.id = r.exerciseId
    WHERE (${muscleGroupQuery}) AND e.name LIKE ?
  `,
      [...muscleGroupParams, searchQueryParams]
    );

    return exercises;
  } catch (error) {
    console.error(error);
    return [];
  }
}
