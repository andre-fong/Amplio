import * as SQLite from "expo-sqlite";
import exercisesJson from "@/utils/exercises.json";

/**
 * Creates the database schema and populates it with default data (if there is none).
 */
export async function spinUpDatabase() {
  console.log("Spinning up database...");

  // Parse exercises from JSON
  const exercises: (ExerciseDb & {
    targetMuscle: string;
    synergistMuscles?: string[];
  })[] = exercisesJson.map((exercise, index) => ({
    id: index,
    name: exercise.name,
    equipment: exercise.equipment as Equipment,
    targetMuscle: exercise.targetMuscle,
    synergistMuscles: exercise.synergistMuscles,
  }));

  const recruitsList: RecruitsDb[] = [];
  for (const exercise of exercises) {
    recruitsList.push({
      exerciseId: exercise.id,
      muscleGroupName: exercise.targetMuscle,
      relationship: "target",
    });

    if (exercise.synergistMuscles) {
      for (const muscle of exercise.synergistMuscles) {
        recruitsList.push({
          exerciseId: exercise.id,
          muscleGroupName: muscle,
          relationship: "synergist",
        });
      }
    }
  }

  try {
    const db = await SQLite.openDatabaseAsync("amplio.db", {
      useNewConnection: true,
    });
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Mesocycle (
        id INTEGER PRIMARY KEY,
        name TEXT,
        notes TEXT,
        startDate TEXT,
        endDate TEXT CHECK(unixEpoch(startDate) < unixEpoch(endDate)),
        type TEXT NOT NULL,
        numMicrocycles INTEGER CHECK(numMicrocycles > 0)
      );
      CREATE TABLE IF NOT EXISTS MesocycleDaySchedule (
        mesoId INTEGER,
        day INTEGER CHECK(day > 0),
        name TEXT NOT NULL,
        exerciseId INTEGER,
        exerciseOrder INTEGER NOT NULL CHECK(exerciseOrder >= 0),
        PRIMARY KEY (mesoId, day, exerciseId),
        FOREIGN KEY (mesoId) REFERENCES Mesocycle(id),
        FOREIGN KEY (exerciseId) REFERENCES Exercise(id)
      );
      CREATE TABLE IF NOT EXISTS Session (
        date TEXT,
        mesoId INTEGER,
        name TEXT,
        notes TEXT,
        deload INTEGER,
        completed INTEGER NOT NULL,
        PRIMARY KEY (date, mesoId),
        FOREIGN KEY (mesoId) REFERENCES Mesocycle(id)
      );
      CREATE TABLE IF NOT EXISTS MuscleGroup (
        name TEXT PRIMARY KEY,
        color TEXT
      );
      CREATE TABLE IF NOT EXISTS Exercise (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        equipment TEXT NOT NULL,
        notes TEXT
      );
      CREATE TABLE IF NOT EXISTS Recruits (
        exerciseId INTEGER,
        muscleGroupName TEXT,
        relationship TEXT,
        PRIMARY KEY (exerciseId, muscleGroupName),
        FOREIGN KEY (exerciseId) REFERENCES Exercise(id),
        FOREIGN KEY (muscleGroupName) REFERENCES MuscleGroup(name)
      );
      CREATE TABLE IF NOT EXISTS SessionExercise (
        id INTEGER PRIMARY KEY,
        date TEXT,
        mesoId INTEGER,
        exerciseId INTEGER,
        notes TEXT,
        exerciseOrder INTEGER NOT NULL CHECK(exerciseOrder >= 0),
        FOREIGN KEY (date, mesoId) REFERENCES Session(date, mesoId),
        FOREIGN KEY (exerciseId) REFERENCES Exercise(id)
      );
      CREATE TABLE IF NOT EXISTS ExerciseSet (
        sessionExerciseId INTEGER,
        setOrder INTEGER NOT NULL CHECK(setOrder >= 0),
        parentSetOrder INTEGER CHECK(parentSetOrder >= 0),
        weight REAL CHECK(weight > 0),
        reps INTEGER CHECK(reps > 0),
        logged INTEGER,
        type TEXT,
        PRIMARY KEY (sessionExerciseId, setOrder),
        FOREIGN KEY (sessionExerciseId) REFERENCES SessionExercise(id)
      );
      
      -- Default muscle groups
      INSERT OR IGNORE INTO MuscleGroup (name, color) VALUES ('Chest', '#FF0000');
      INSERT OR IGNORE INTO MuscleGroup (name, color) VALUES ('Triceps', '#00FF00');
      INSERT OR IGNORE INTO MuscleGroup (name, color) VALUES ('Shoulders', '#0000FF');
      INSERT OR IGNORE INTO MuscleGroup (name, color) VALUES ('Back', '#FFFF00');
      INSERT OR IGNORE INTO MuscleGroup (name, color) VALUES ('Biceps', '#FF00FF');
      INSERT OR IGNORE INTO MuscleGroup (name, color) VALUES ('Quads', '#00FFFF');
      INSERT OR IGNORE INTO MuscleGroup (name, color) VALUES ('Hamstrings', '#FFA500');
      INSERT OR IGNORE INTO MuscleGroup (name, color) VALUES ('Glutes', '#800080');
      INSERT OR IGNORE INTO MuscleGroup (name, color) VALUES ('Abs', '#008000');
      INSERT OR IGNORE INTO MuscleGroup (name, color) VALUES ('Calves', '#800000');
      INSERT OR IGNORE INTO MuscleGroup (name, color) VALUES ('Forearms', '#000080');

      -- Default exercises
      ${exercises
        .map(
          (exercise) =>
            `INSERT OR IGNORE INTO Exercise (id, name, equipment) VALUES ('${exercise.id}', '${exercise.name}', '${exercise.equipment}');`
        )
        .join("\n")}

      -- Default recruits
      ${recruitsList
        .map(
          (recruit) => `
        INSERT OR IGNORE INTO Recruits (exerciseId, muscleGroupName, relationship) VALUES ('${recruit.exerciseId}', '${recruit.muscleGroupName}', '${recruit.relationship}');
      `
        )
        .join("\n")}
    `);
  } catch (e) {
    console.error(e);
  }

  console.log("Database spun up!");
}

/**
 * WARNING: This function will drop all tables in the database.
 */
export async function clearDatabase() {
  const db = await SQLite.openDatabaseAsync("amplio.db", {
    useNewConnection: true,
  });

  // Drop all tables
  await db.execAsync(`
    DROP TABLE IF EXISTS Mesocycle;
    DROP TABLE IF EXISTS Session;
    DROP TABLE IF EXISTS MuscleGroup;
    DROP TABLE IF EXISTS Exercise;
    DROP TABLE IF EXISTS Recruits;
    DROP TABLE IF EXISTS ExerciseSet;
  `);

  console.log("Database cleared!");
}
