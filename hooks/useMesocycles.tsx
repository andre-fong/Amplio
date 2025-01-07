import { useCallback, useEffect, useState } from "react";
import {
  getMesocycles,
  logMesocycleScheduleTable,
  logMesocycleTable,
} from "@/api/mesocycles";

export default function useMesocycles({
  searchQuery,
}: {
  searchQuery: string;
}) {
  const [mesocycles, setMesocycles] = useState<Mesocycle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMesocycles = useCallback(async () => {
    try {
      // await logMesocycleScheduleTable();
      const data = await getMesocycles({ searchQuery });
      setMesocycles(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, [searchQuery]);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      fetchMesocycles();
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  return { mesocycles, loading, refresh: fetchMesocycles };
}
