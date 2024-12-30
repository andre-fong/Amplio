import { useEffect, useState } from "react";
import { getMuscleGroups } from "@/api/muscleGroups";

export default function useMuscleGroups() {
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMuscleGroups() {
      try {
        const data = await getMuscleGroups();
        setMuscleGroups(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }

    setLoading(true);
    fetchMuscleGroups();
  }, []);

  return { muscleGroups, loading };
}
