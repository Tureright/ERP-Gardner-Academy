import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { StudentRepresentative } from "../types";
import { studentsRepresentativesService } from "@/services/Invoices/studentsRepresentativesService";
import { useToast } from "@/hooks/use-toast";

interface StudentsRepresentativesResponse {
  data: StudentRepresentative[];
  success: boolean;
  message?: string;
}

interface SortState {
  field?: string;
  order?: 'ascend' | 'descend';
}

const useStudentsRepresentatives = () => {
  const { toast } = useToast();
  const [sortState, setSortState] = useState<SortState>({});

  const {
    data: studentsRepresentativesData,
    isLoading,
    error,
  } = useQuery<StudentsRepresentativesResponse, Error>({
    queryKey: ["studentsRepresentatives"],
    queryFn: async () => {
      const response = await studentsRepresentativesService.getStudentsRepresentatives();
      return response as StudentsRepresentativesResponse;
    },
  });

  const sortedStudentsRepresentatives = useMemo(() => {
    if (!studentsRepresentativesData?.data || !sortState.field) {
      return studentsRepresentativesData?.data || [];
    }

    return [...studentsRepresentativesData.data].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (sortState.field?.includes('.')) {
        const keys = sortState.field.split('.');
        aValue = keys.reduce((obj, key) => obj?.[key], a);
        bValue = keys.reduce((obj, key) => obj?.[key], b);
      } else {
        aValue = a[sortState.field as keyof typeof a];
        bValue = b[sortState.field as keyof typeof b];
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortState.order === 'ascend' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortState.order === 'ascend' ? 1 : -1;
      }
      return 0;
    });
  }, [studentsRepresentativesData?.data, sortState]);

  const handleTableChange = (newPagination: any, filters: any, sorter: any) => {
    if (sorter && sorter.field) {
      setSortState({
        field: sorter.field,
        order: sorter.order,
      });
    } else {
      setSortState({});
    }
  };

  if (error) {
    toast({
      variant: "destructive",
      title: "Error al obtener los representantes",
      description: error.message,
    });
  }

  return {
    studentsRepresentatives: sortedStudentsRepresentatives,
    isLoading,
    error,
    handleTableChange,
  };
};

export default useStudentsRepresentatives;
