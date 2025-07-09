import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  uploadProfilePicture,
  getProfilePicture,
  syncNewDocentes,
  getEmployees13erSueldo,
  getEmployeeByAdminId,
  get13erSueldoByEmployeeId,
  getMonthsFor14Sueldo,
} from "../services/employeeService";
import { EmployeeData, EmployeeResponse } from "../types";
export function useEmployees() {
  return useQuery({ queryKey: ["employees"], queryFn: getAllEmployees });
}

export function useEmployee(employeeId: string) {
  return useQuery({
    queryKey: ["employee", employeeId],
    queryFn: () => getEmployeeById(employeeId),
    enabled: !!employeeId,
  });
}

export function useGetEmployeeByAdminId(adminId: string) {
  return useQuery({
    queryKey: ["employee", adminId],
    queryFn: () => getEmployeeByAdminId(adminId),
    enabled: !!adminId,
  });
}
export function useProfilePicture(employeeId: string) {
  return useQuery({
    queryKey: ["profilePicture", employeeId],
    queryFn: () => getProfilePicture(employeeId),
    enabled: !!employeeId,
  });
}

export function useGetEmployees13erSueldo() {
  return useQuery({
    queryKey: ["employees13er"],
    queryFn: getEmployees13erSueldo,
  });
}

export function useGet13erSueldoByEmployeeId(employeeId: string) {
  return useQuery({
    queryKey: ["employees13er", employeeId],
    queryFn: () => get13erSueldoByEmployeeId(employeeId),
    enabled: !!employeeId,
  });
}

export function useGetMonthsFor14Sueldo(employeeId: string) {
  return useQuery({
    queryKey: ["employees14to", employeeId],
    queryFn: () => getMonthsFor14Sueldo(employeeId),
    enabled: !!employeeId,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmployee,
    onMutate: async (newEmployee: EmployeeResponse) => {
      await queryClient.cancelQueries({ queryKey: ["employees"] });

      const previousEmployees = queryClient.getQueryData(["employees"]);

      queryClient.setQueryData(["employees"], (old: any) => {
        const existingData = old?.data || [];
        return {
          ...old,
          data: [...existingData, { id: Date.now(), ...newEmployee }],
        };
      });

      return { previousEmployees };
    },
    onError: (error, newEmployee, context) => {
      queryClient.setQueryData(["employees"], context?.previousEmployees);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeId,
      employeeData,
    }: {
      employeeId: string;
      employeeData: EmployeeData;
    }) => updateEmployee(employeeId, employeeData),
    onMutate: async ({ employeeId, employeeData }) => {
      await queryClient.cancelQueries({ queryKey: ["employees"] });

      const previousEmployees = queryClient.getQueryData(["employees"]);

      queryClient.setQueryData(["employees"], (old: any) => {
        const existingData = old?.data || [];
        return {
          ...old,
          data: existingData.map((employee: EmployeeResponse) =>
            employeeId === employee.id
              ? { ...employee, ...employeeData }
              : employee
          ),
        };
      });

      return { previousEmployees };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["employees"], context?.previousEmployees);
    },
    onSettled: () => {
      queryClient.cancelQueries({ queryKey: ["employees"] });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEmployee,
    onMutate: async (employeeId) => {
      await queryClient.cancelQueries({ queryKey: ["employees"] });

      const previousEmployees = queryClient.getQueryData(["employees"]);

      queryClient.setQueryData(["employees"], (old: any) => {
        const existingData = old?.data || [];
        return {
          ...old,
          data: existingData.filter(
            (employee: EmployeeResponse) => employee.id !== employeeId
          ),
        };
      });

      return { previousEmployees };
    },
    onError: (error, employeeId, context) => {
      queryClient.setQueryData(["employees"], context?.previousEmployees);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useUploadProfilePicture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeId,
      base64Data,
    }: {
      employeeId: string;
      base64Data: string;
    }) => uploadProfilePicture(employeeId, base64Data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useSyncNewDocentes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => syncNewDocentes(),
    onSuccess: (data) => {
      console.log("Docentes sincronizados:", data);
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: (error) => {
      console.error("Error al sincronizar docentes:", error);
      alert("Error al sincronizar docentes.");
    },
  });
}
