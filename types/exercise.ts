type Exercise = {
  id: number;
  name: string;
  targetMuscle: MuscleGroup;
  synergistMuscles?: MuscleGroup[];
  equipment: Equipment;
};

type Equipment =
  | "Barbell"
  | "Dumbbell"
  | "Machine"
  | "Bodyweight"
  | "Cable"
  | "EZ Bar"
  | "Smith Machine"
  | "Bodyweight Loadable"
  | "Other";

type PlannedExercise = Exercise & {
  exerciseOrder: number;
  notes?: string;
  plannedSets: PlannedSet[];
};
