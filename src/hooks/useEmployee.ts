import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../services/employeeService";

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
export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEmployee,
    onMutate: async (newEmployee) => {
      await queryClient.cancelQueries({ queryKey: ["employees"] });

      const previousEmployees = queryClient.getQueryData(["employees"]);

      queryClient.setQueryData(["employees"], (old: any) => ({
        ...old,
        data: [...(old?.data || []), { id: Date.now(), ...newEmployee }],
      }));
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
      employeeData: any;
    }) => updateEmployee(employeeId, employeeData),
    onMutate: async ({ employeeId, employeeData }) => {
      await queryClient.cancelQueries({ queryKey: ["employees"] });

      const previousEmployees = queryClient.getQueryData(["employees"]);

      queryClient.setQueryData(["employees"], (old: any) => ({
        ...old,
        data: old?.data.map((employee: any) =>
          employeeId === employee.id
            ? { ...employee, ...employeeData }
            : employee
        ),
      }));
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

      queryClient.setQueryData(["employees"], (old: any) => ({
        ...old,
        data: old?.data.filter((employee) => employee.id !== employeeId),
      }));

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
