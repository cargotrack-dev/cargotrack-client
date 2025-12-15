// src/features/Cargo/hooks/useCargoData.ts
import { useState, useEffect } from 'react';
import CargoService from '../services/CargoService';
import { Cargo } from '../types/cargo';

export const useCargoData = (id?: string) => {
  const [data, setData] = useState<Cargo | Cargo[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (id) {
          const cargo = await CargoService.getCargoById(id);
          setData(cargo);
        } else {
          const cargos = await CargoService.getAllCargo();
          setData(cargos);
        }
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { data, loading, error };
};