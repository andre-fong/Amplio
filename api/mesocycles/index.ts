import * as SQLite from "expo-sqlite";

type GetMesocyclesParams = {
  searchQuery?: string;
};

// TODO: NEED TO TEST GETMESOCYCLESCHEDULE!

export async function getMesocycles(
  params?: GetMesocyclesParams
): Promise<Mesocycle[]> {
  try {
    const db = await SQLite.openDatabaseAsync("amplio.db", {
      useNewConnection: true,
    });
    const queryParams = [];

    const searchQueryParams = params?.searchQuery
      ? `%${params.searchQuery}%`
      : undefined;
    if (searchQueryParams) queryParams.push(searchQueryParams);

    const mesocycles = await db.getAllAsync<Mesocycle>(
      `
    WITH CompletedSessionCount AS (
      SELECT
        mesoId AS id,
        COUNT(*) AS numCompletedSessions
      FROM Session s
      WHERE s.completed = 1
      GROUP BY mesoId
    ),
    MicrocycleDayCount AS (
      SELECT
        mesoId,
        COUNT(DISTINCT day) AS numSessionsPerMicrocycle
      FROM MesocycleDaySchedule
      GROUP BY mesoId
    )
    SELECT 
      m.id,
      m.name,
      m.notes,
      m.startDate,
      m.endDate,
      m.type,
      m.numMicrocycles,
      mdc.numSessionsPerMicrocycle,
      IFNULL(csc.numCompletedSessions, 0) / (numMicrocycles * COUNT(mds.day)) * 100 AS percentFinished
    FROM Mesocycle m
    JOIN MicrocycleDayCount mdc ON m.id = mdc.mesoId
    JOIN MesocycleDaySchedule mds ON m.id = mds.mesoId
    LEFT JOIN CompletedSessionCount csc ON m.id = csc.id
    ${searchQueryParams ? `WHERE m.name LIKE ?` : ""}
    GROUP BY m.id, m.name, m.notes, m.startDate, m.endDate, m.type, m.numMicrocycles
    ORDER BY m.startDate DESC
  `,
      queryParams
    );

    db.closeAsync();
    return mesocycles;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function logMesocycleTable() {
  try {
    const db = await SQLite.openDatabaseAsync("amplio.db", {
      useNewConnection: true,
    });

    const table = await db.getAllAsync<Mesocycle>(
      `
    SELECT * FROM Mesocycle
  `
    );

    console.log(table);
    db.closeAsync();
  } catch (error) {
    console.error(error);
  }
}

export async function getMesocycleSchedule(mesoId: number) {
  try {
    const db = await SQLite.openDatabaseAsync("amplio.db", {
      useNewConnection: true,
    });

    const schedule = await db.getAllAsync<MesocycleSchedule>(
      `
    SELECT 
      m.id AS mesocycleId,
      m.name AS mesocycleName,
      m.startDate AS mesocycleStartDate,
      m.endDate AS mesocycleEndDate,
      m.type AS mesocycleType,
      mds.day,
      e.id AS exerciseId,
      e.name AS exerciseName,
      e.equipment AS exerciseEquipment,
      json_object('name', m.name, 'color', m.color) AS targetMuscle
    FROM Mesocycle m
    JOIN MesocycleDaySchedule mds ON m.id = mds.mesoId
    JOIN Exercise e ON mds.exerciseId = e.id
    JOIN Recruits r ON e.id = r.exerciseId
    JOIN MuscleGroup mg ON r.muscleGroupName = mg.name
    WHERE m.id = ?
  `,
      [mesoId]
    );

    db.closeAsync();
    return schedule;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function logMesocycleScheduleTable() {
  try {
    const db = await SQLite.openDatabaseAsync("amplio.db", {
      useNewConnection: true,
    });

    const table = await db.getAllAsync<MesocycleSchedule>(
      `
    SELECT * FROM MesocycleDaySchedule
  `
    );

    console.log(table);
    db.closeAsync();
  } catch (error) {
    console.error(error);
  }
}

export async function addPlannedMesocycle(
  newMeso: Omit<Mesocycle, "id" | "endDate">,
  newSchedule: (Omit<DaySchedule, "exercises"> & {
    exercises: ((Exercise | MuscleGroup) & { order: number })[];
  })[]
) {
  if (newMeso.type !== "planned") {
    throw new Error(
      "Error adding unplanned mesocycle using addPlannedMesocycle"
    );
  }

  try {
    const db = await SQLite.openDatabaseAsync("amplio.db", {
      useNewConnection: true,
    });

    await db.withTransactionAsync(async () => {
      const mesoId = (
        await db.runAsync(
          `
      INSERT INTO Mesocycle (name, notes, startDate, type, numMicrocycles)
      VALUES (?, ?, ?, ?, ?)
    `,
          [
            newMeso.name,
            newMeso.notes || "",
            newMeso.startDate,
            newMeso.type,
            newMeso.numMicrocycles,
          ]
        )
      ).lastInsertRowId;

      console.log(mesoId);
      console.log(newSchedule[0].exercises);

      await Promise.all(
        newSchedule
          .map((day) =>
            day.exercises.map(async (exercise) => {
              if (!("id" in exercise))
                throw new Error("Unselected exercise in schedule found");

              await db.runAsync(
                `
          INSERT INTO MesocycleDaySchedule (mesoId, day, name, exerciseId, exerciseOrder)
          VALUES (?, ?, ?, ?, ?)
        `,
                [
                  mesoId,
                  day.day,
                  day.name || `Day ${day.day}`,
                  exercise.id,
                  exercise.order,
                ]
              );
            })
          )
          .flat()
      );
    });
  } catch (error) {
    console.error(error);
  }
}

export async function deleteMesocycle(mesoId: number) {
  try {
    const db = await SQLite.openDatabaseAsync("amplio.db", {
      useNewConnection: true,
    });

    await db.withTransactionAsync(async () => {
      await Promise.all(
        [
          `DELETE FROM Mesocycle WHERE id = ?`,
          `DELETE FROM MesocycleDaySchedule WHERE mesoId = ?`,
          `DELETE FROM Session WHERE mesoId = ?`,
        ].map((query) => db.runAsync(query, [mesoId]))
      );

      await db.runAsync(
        `
      DELETE FROM ExerciseSet
      WHERE sessionExerciseId IN (
        SELECT id
        FROM SessionExercise
        WHERE mesoId = ?
      )
    `,
        [mesoId]
      );

      await db.runAsync(
        `
      DELETE FROM SessionExercise
      WHERE mesoId = ?
    `,
        [mesoId]
      );
    });

    db.closeAsync();
  } catch (error) {
    console.error(error);
  }
}
