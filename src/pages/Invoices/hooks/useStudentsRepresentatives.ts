import { useQuery } from "@tanstack/react-query";
import { StudentRepresentative } from "../types";
import { studentsRepresentativesService } from "@/services/Invoices/studentsRepresentativesService";
import { useToast } from "@/hooks/use-toast";

interface StudentsRepresentativesResponse {
  data: StudentRepresentative[];
  success: boolean;
  message?: string;
}

const useStudentsRepresentatives = () => {
  const { toast } = useToast();

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

  if (error) {
    toast({
      variant: "destructive",
      title: "Error al obtener los representantes",
      description: error.message,
    });
  }

  return {
    studentsRepresentatives: studentsRepresentativesData?.data || [],
    isLoading,
    error,
  };
};

export default useStudentsRepresentatives;
