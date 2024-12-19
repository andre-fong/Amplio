import * as SQLite from "expo-sqlite";

/**
 * Creates the database schema and populates it with default data (if there is none).
 */
export async function spinUpDatabase() {
  console.log("Spinning up database...");
  const db = await SQLite.openDatabaseAsync("amplio.db");
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS Mesocycle (
      id TEXT PRIMARY KEY,
      name TEXT,
      notes TEXT,
      startDate TEXT,
      endDate TEXT,
      type TEXT,
      numMicrocycles INTEGER
    );
    CREATE TABLE IF NOT EXISTS Session (
      date TEXT,
      mesoId TEXT,
      name TEXT,
      notes TEXT,
      PRIMARY KEY (date, mesoId),
      FOREIGN KEY (mesoId) REFERENCES Mesocycle(id)
    );
    CREATE TABLE IF NOT EXISTS MuscleGroup (
      name TEXT PRIMARY KEY NOT NULL,
      color TEXT
    );
    CREATE TABLE IF NOT EXISTS Exercise (
      id TEXT PRIMARY KEY,
      name TEXT,
      equipment TEXT,
      notes TEXT
    );
    CREATE TABLE IF NOT EXISTS Recruits (
      exerciseId TEXT,
      muscleGroupName TEXT,
      relationship TEXT,
      PRIMARY KEY (exerciseId, muscleGroupName, relationship),
      FOREIGN KEY (exerciseId) REFERENCES Exercise(id),
      FOREIGN KEY (muscleGroupName) REFERENCES MuscleGroup(name)
    );
    CREATE TABLE IF NOT EXISTS SessionExercise (
      id TEXT PRIMARY KEY,
      date TEXT,
      mesoId TEXT,
      exerciseId TEXT,
      exerciseOrder INTEGER NOT NULL,
      FOREIGN KEY (date, mesoId) REFERENCES Session(date, mesoId),
      FOREIGN KEY (exerciseId) REFERENCES Exercise(id)
    );
    CREATE TABLE IF NOT EXISTS ExerciseSet (
      sessionExerciseId TEXT,
      setOrder INTEGER NOT NULL,
      parentSetOrder INTEGER,
      weight REAL,
      reps INTEGER,
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
  `);

  console.log("Database spun up!");
}

export async function getAllMuscleGroups() {
  const db = await SQLite.openDatabaseAsync("amplio.db");
  console.log(await db.getFirstAsync<MuscleGroup>(`SELECT * FROM muscleGroup`));
}

/**
 * WARNING: This function will drop all tables in the database.
 */
export async function clearDatabase() {
  const db = await SQLite.openDatabaseAsync("amplio.db");

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
