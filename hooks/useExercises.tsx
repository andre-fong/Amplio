import { useEffect, useState } from "react";
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

  console.log(targetMuscleGroups, searchQuery);

  useEffect(() => {
    async function fetchExercises() {
      try {
        const data = await getExercises({ targetMuscleGroups, searchQuery });
        setExercises(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }

    setLoading(true);
    const timeout = setTimeout(() => {
      fetchExercises();
    }, 250);

    return () => clearTimeout(timeout);
  }, [targetMuscleGroups, searchQuery]);

  return { exercises, loading };
}
