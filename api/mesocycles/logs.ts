import * as SQLite from "expo-sqlite";

type GetMesocycleLogsParams = {
  mesoId: number;
};

// TODO
export async function getMesocycleLogs(
  params: GetMesocycleLogsParams
): Promise<Session[]> {
  const db = await SQLite.openDatabaseAsync("amplio.db", {
    useNewConnection: true,
  });
  const queryParams = [params.mesoId];

  const [meso, sessions] = await Promise.all([
    db.getFirstAsync<Omit<Mesocycle, "percentFinished">>(
      `
      SELECT 
        id,
        name,
        startDate,
        endDate,
        type,
        numMicrocycles,
        (
          SELECT COUNT(DISTINCT day)
          FROM MesocycleDaySchedule
          WHERE mesoId = ?
        ) AS numSessionsPerMicrocycle
      FROM Mesocycle
      WHERE id = ?
    `,
      queryParams
    ),

    getMesocycleSessions(params),
  ]);
}

/**
 * Get all non-empty sessions for a mesocycle.
 */
export async function getMesocycleSessions(
  params: GetMesocycleLogsParams
): Promise<Session[]> {
  const db = await SQLite.openDatabaseAsync("amplio.db", {
    useNewConnection: true,
  });
  const queryParams = [params.mesoId];

  // TODO!!!!!!
  const sessions = await db.getAllAsync<Session>(
    `
    SELECT 
      s.date,
      s.mesoId,
      s.name,
      s.notes,
      deload,
      completed
    FROM Session s
    JOIN SessionExercise se ON (s.date = se.date AND s.mesoId = se.mesoId)
    JOIN Exercise e ON se.exerciseId = e.id
    JOIN ExerciseSet es ON se.id = es.sessionExerciseId
    WHERE s.mesoId = ?
    ORDER BY s.date ASC
  `,
    queryParams
  );

  db.closeAsync();
  return sessions;
}
