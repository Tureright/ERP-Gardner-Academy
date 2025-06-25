import { useState, useCallback } from "react";

export const useEmitFilter = () => {
  const [filters, setFilters] = useState({});

  const clearFilters = useCallback(() => {
      setFilters({});
    }, []);

  const handleFilterChange = useCallback((field: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  return {
    handleFilterChange,
    clearFilters,
    filters
  };
};

export default useEmitFilter;
