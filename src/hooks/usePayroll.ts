import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllPayrolls,
  getPayrollById,
  getAllPayrollsByEmployee,
  getLatestPayroll,
  createPayroll,
  updatePayroll,
  deletePayroll,
  setPayrollTemplate,
  downloadPayroll,
  getPayrollsByAdmin,
} from "../services/payrollService";
import { PayrollData, PayrollFullTemplate, PayrollResponse } from "../types";

export function usePayrolls() {
  return useQuery({ queryKey: ["payrolls"], queryFn: getAllPayrolls });
}

export function usePayroll(employeeId: string, payrollId: string) {
  return useQuery({
    queryKey: ["payroll", payrollId],
    queryFn: () => getPayrollById(employeeId, payrollId),
    enabled: !!payrollId,
  });
}
export function usePayrollsByEmployee(employeeId: string) {
  return useQuery({
    queryKey: ["payrolls", employeeId],
    queryFn: () => getAllPayrollsByEmployee(employeeId),
    enabled: !!employeeId,
  });
}

export function useGetPayrollsByAdmin(adminId: string) {
  return useQuery({
    queryKey: ["payrolls", adminId],
    queryFn: () => getPayrollsByAdmin(adminId),
    enabled: !!adminId,
  });
}

export function useLatestPayroll(employeeId: string) {
  return useQuery({
    queryKey: ["latestPayroll", employeeId],
    queryFn: () => getLatestPayroll(employeeId),
    enabled: !!employeeId,
  });
}

export function useDownloadPayroll(employeeId: string, payrollId: string) {
  return useQuery({
    queryKey: ["downloadPayroll", employeeId, payrollId],
    queryFn: () => downloadPayroll(employeeId, payrollId),
    enabled: !!employeeId && !!payrollId,
  });
}

export function useCreatePayroll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      employeeId,
      payrollData,
    }: {
      employeeId: string;
      payrollData: PayrollData;
    }) => createPayroll(employeeId, payrollData),
    onMutate: async ({ employeeId, payrollData }) => {
      await queryClient.cancelQueries({ queryKey: ["payrolls"] });

      const previousPayrolls = queryClient.getQueryData(["payrolls"]);

      queryClient.setQueryData(["payrolls"], (old: any) => ({
        ...old,
        data: [
          ...(old?.data || []),
          { id: Date.now(), employeeId, ...payrollData },
        ],
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
      employeeId,
      payrollId,
      payrollData,
    }: {
      employeeId: string;
      payrollId: string;
      payrollData: any;
    }) => updatePayroll(employeeId, payrollId, payrollData),
    onMutate: async ({ payrollId, payrollData }) => {
      await queryClient.cancelQueries({ queryKey: ["payrolls"] });

      const previousPayrolls = queryClient.getQueryData(["payrolls"]);

      queryClient.setQueryData(["payrolls"], (old: any) => ({
        ...old,
        data: old?.data.map((payroll: PayrollResponse) =>
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
    mutationFn: ({
      employeeId,
      payrollId,
    }: {
      employeeId: string;
      payrollId: string;
    }) => deletePayroll(employeeId, payrollId),
    onMutate: async ({ payrollId }) => {
      await queryClient.cancelQueries({ queryKey: ["payrolls"] });

      const previousPayrolls = queryClient.getQueryData(["payrolls"]);
      queryClient.setQueryData(["payrolls"], (old: any) => ({
        ...old,
        data: old?.data.filter(
          (payroll: PayrollResponse) => payroll.id !== payrollId
        ),
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

export function useSetPayrollTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ newPayroll }: { newPayroll: PayrollFullTemplate }) =>
      setPayrollTemplate(newPayroll),

    onSuccess: (response) => {
      console.log("✅ Respuesta completa:", response);
      console.log("📩 Mensaje:", response.data.message);
      console.log("🧾 Payroll:", response.data.formattedPayroll);
    },

    onError: (error) => {
      console.error("❌ Error al enviar plantilla de nómina:", error);
    },
  });
}
