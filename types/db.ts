type MesocycleDb = {
  id: string;
  name: string;
  notes?: string;
  startDate: string;
  endDate: string;
  type: "planned" | "custom";
  numMicrocycles: number;
};

type SessionDb = {
  date: string;
  mesoId: string;
  name: string;
  notes?: string;
};

type MuscleGroupDb = {
  name: string;
  color: string;
};

type ExerciseDb = {
  id: string;
  name: string;
  equipment: Equipment;
  notes?: string;
};

type RecruitsDb = {
  exerciseId: string;
  muscleGroupName: string;
  relationship: "target" | "synergist";
};

type SetDb = {
  date: string;
  mesoId: string;
  exerciseId: string;
  order: number;
  parentOrder?: number;
  weight?: number;
  reps?: number;
  logged: boolean;
  type?: SetType;
};
