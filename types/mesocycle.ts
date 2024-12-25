type Mesocycle =
  | {
      id: string;
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
      id: string;
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

type MesocycleCondensed = {
  name: string;
  startDate: string;
  endDate?: string;
  type: "planned" | "custom";
};
