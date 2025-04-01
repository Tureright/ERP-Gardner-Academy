import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllPayrolls,
  getPayrollById,
  createPayroll,
  updatePayroll,
  deletePayroll,
} from "../services/payrollService";

// Hook para obtener todos los roles de pago
export function usePayrolls() {
  return useQuery({ queryKey: ["payrolls"], queryFn: getAllPayrolls });
}

// Hook para obtener un rol de pago por ID
export function usePayroll(payrollId: string) {
  return useQuery({
    queryKey: ["payroll", payrollId],
    queryFn: () => getPayrollById(payrollId),
    enabled: !!payrollId,
  });
}

// Hook para crear un nuevo rol de pago
export function useCreatePayroll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPayroll,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payrolls"] }),
  });
}

// Hook para actualizar un rol de pago
export function useUpdatePayroll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ payrollId, payrollData }: { payrollId: string; payrollData: any }) =>
      updatePayroll(payrollId, payrollData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payrolls"] }),
  });
}

// Hook para eliminar un rol de pago
export function useDeletePayroll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePayroll,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payrolls"] }),
  });
}
