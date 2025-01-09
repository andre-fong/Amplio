import { useCallback, useEffect, useState } from "react";
import { getMuscleGroups } from "@/api/muscleGroups";

export default function useMuscleGroups() {
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMuscleGroups = useCallback(async () => {
    try {
      const data = await getMuscleGroups();
      setMuscleGroups(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchMuscleGroups();
  }, []);

  return { muscleGroups, loading, refresh: fetchMuscleGroups };
}
