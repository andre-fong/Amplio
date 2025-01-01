type Mesocycle =
  | {
      id: number;
      name: string;
      notes?: string;
      startDate: string;
      endDate: string;
      type: "planned";
      /**
       * When meso type is `planned`, *numMicrocycles* is the total number of planned weeks in the mesocycle.
       */
      numMicrocycles: number;
      numSessionsPerMicrocycle: number;
      percentFinished: number;
    }
  | {
      id: number;
      name: string;
      notes?: string;
      startDate: string;
      endDate?: string;
      type: "custom";
      /**
       * When meso type is `custom`, *numMicrocycles* is the number of weeks completed so far in the mesocycle.
       */
      numMicrocycles: number;
    };

type MesocycleSchedule = {
  mesocycle: MesocycleCondensed;
  days: {
    day: number;
    exercises: Exercise[];
  }[];
};

type MesocycleCondensed = {
  name: string;
  startDate: string;
  endDate?: string;
  type: "planned" | "custom";
};
