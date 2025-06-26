import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../config/constants";

interface BilledMonths {
  studentId: string;
  representativeId: string;
  year: number;
  months: number[];
}

interface UseMonthsResult {
  billedMonths: BilledMonths | null;
  loading: boolean;
  error: Error | null;
}

const useMonths = (record: { studentId: string; representativeId: string } | null): UseMonthsResult => {
  const [billedMonths, setBilledMonths] = useState<BilledMonths | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBilledMonths = async () => {
    if (!record) return;
    
    try {
      setLoading(true);
      setError(null);
      console.log("representative id ", record.representativeId)
      const response = await fetch(
        `${API_ENDPOINTS.GET_BILLED_MONTHS}&studentId=${record.studentId}&representativeId=${record.representativeId}`
      );
      const result = await response.json();
      
      if (result.success && result.data) {
        setBilledMonths(result.data);
      } else if (result.errorResponse) {
        // Manejo específico del error de la API
        const errorMessage = result.errorResponse.details || result.errorResponse.message;
        throw new Error(errorMessage);
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al obtener los meses facturados';
      setError(new Error(errorMessage));
      console.error('Error al obtener los meses facturados:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (record) {
      fetchBilledMonths();
    }
  }, [record]);

  return {
    billedMonths,
    loading,
    error
  };
};

export default useMonths;
