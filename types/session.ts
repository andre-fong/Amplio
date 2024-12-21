type Session = {
  date: string;
  meso: MesocycleCondensed;
  name: string;
  notes?: string;
  deload: boolean;
  microcycleNum: number;
  dayNum: number;
  exercises: PlannedExercise[];
};
