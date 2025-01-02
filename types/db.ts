type MesocycleDb = {
  id: number;
  name: string;
  notes?: string;
  startDate: string;
  endDate?: string;
  type: "planned" | "custom";
  numMicrocycles?: number;
};

type MesocycleDayScheduleDb = {
  mesoId: number;
  day: number;
  name: string;
  exerciseId: number;
  exerciseOrder: number;
};

type SessionDb = {
  date: string;
  mesoId: number;
  name: string;
  notes?: string;
  deload: boolean;
  completed: boolean;
};

type MuscleGroupDb = {
  name: string;
  color: string;
};

type ExerciseDb = {
  id: number;
  name: string;
  equipment: Equipment;
  notes?: string;
};

type RecruitsDb = {
  exerciseId: number;
  muscleGroupName: string;
  relationship: "target" | "synergist";
};

type SessionExerciseDb = {
  id: number;
  date: string;
  mesoId: number;
  exerciseId: number;
  notes?: string;
  exerciseOrder: number;
};

type ExerciseSetDb = {
  sessionExerciseId: number;
  setOrder: number;
  parentSetOrder?: number;
  weight?: number;
  reps?: number;
  logged: boolean;
  type?: SetType;
};
