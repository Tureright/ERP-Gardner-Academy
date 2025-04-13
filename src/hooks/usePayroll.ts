import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllPayrolls,
  getPayrollById,
  createPayroll,
  updatePayroll,
  deletePayroll,
} from "../services/payrollService";

export function usePayrolls() {
  return useQuery({ queryKey: ["payrolls"], queryFn: getAllPayrolls });
}

export function usePayroll(payrollId: string) {
  return useQuery({
    queryKey: ["payroll", payrollId],
    queryFn: () => getPayrollById(payrollId),
    enabled: !!payrollId,
  });
}

export function useCreatePayroll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPayroll,
    onMutate: async (newPayroll) => {
      await queryClient.cancelQueries({ queryKey: ["payrolls"] });

      const previousPayrolls = queryClient.getQueryData(["payrolls"]);

      queryClient.setQueryData(["payrolls"], (old: any) => ({
        ...old,
        data: [...(old?.data || []), { id: Date.now(), ...newPayroll }],
      }));

      return { previousPayrolls };
    },
    onError: (error, newPayroll, context) => {
      queryClient.setQueryData(["payrolls"], context?.previousPayrolls);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["payrolls"] });
    },
  });
}

export function useUpdatePayroll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      payrollId,
      payrollData,
    }: {
      payrollId: string;
      payrollData: any;
    }) => updatePayroll(payrollId, payrollData),
    onMutate: async ({ payrollId, payrollData }) => {
      await queryClient.cancelQueries({ queryKey: ["payrolls"] });

      const previousPayrolls = queryClient.getQueryData(["payrolls"]);

      queryClient.setQueryData(["payrolls"], (old: any) => ({
        ...old,
        data: old?.data.map((payroll) =>
          payroll.id === payrollId ? { ...payroll, ...payrollData } : payroll
        ),
      }));

      return { previousPayrolls };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["payrolls"], context?.previousPayrolls);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["payrolls"] });
    },
  });
}

export function useDeletePayroll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePayroll,
    onMutate: async (payrollId) => {
      await queryClient.cancelQueries({ queryKey: ["payrolls"] });

      const previousPayrolls = queryClient.getQueryData(["payrolls"]);
      queryClient.setQueryData(["payrolls"], (old: any) => ({
        ...old,
        data: old?.data.filter((payroll) => payroll.id !== payrollId),
      }));

      return { previousPayrolls };
    },
    onError: (error, payrollId, context) => {
      queryClient.setQueryData(["payrolls"], context?.previousPayrolls);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["payrolls"] });
    },
  });
}
