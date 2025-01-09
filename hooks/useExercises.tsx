import { useCallback, useEffect, useState } from "react";
import { getExercises } from "@/api/exercises";

export default function useExercises({
  targetMuscleGroups,
  searchQuery,
}: {
  targetMuscleGroups?: string[];
  searchQuery?: string;
}) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExercises = useCallback(async () => {
    try {
      const data = await getExercises({ targetMuscleGroups, searchQuery });
      setExercises(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, [targetMuscleGroups, searchQuery]);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      fetchExercises();
    }, 250);

    return () => clearTimeout(timeout);
  }, [targetMuscleGroups, searchQuery]);

  return { exercises, loading, refresh: fetchExercises };
}
