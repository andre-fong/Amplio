type Mesocycle = {
  id: string;
  name: string;
  notes?: string;
  startDate: string;
  endDate: string;
  type: "planned" | "custom";
  numMicrocycles: number;
  numSessionsPerMicrocycle: number;
  percentFinished: number;
};

type MesocycleCondensed = {
  name: string;
  startDate: string;
  endDate: string;
  type: "planned" | "custom";
};
