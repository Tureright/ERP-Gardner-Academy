import { invoiceService } from "@/services/Invoices/invoiceService";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface PaginationState {
  page: number;
  pageSize: number;
}

const useEmittedInvoices = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 20,
  });

  const {
    data: emittedInvoicesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["emittedInvoices", pagination.page, pagination.pageSize],
    queryFn: () =>
      invoiceService.getEmittedInvoices(pagination.page, pagination.pageSize),
  });

  const handleTableChange = (newPagination: {
    current: number;
    pageSize: number;
  }) => {
    setPagination({
      page: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  return {
    emittedInvoices: emittedInvoicesData?.data || [],
    pagination: {
      ...pagination,
      totalItems: emittedInvoicesData?.pagination?.totalItems || 0,
      totalPages: emittedInvoicesData?.pagination?.totalPages || 0,
      hasNextPage: emittedInvoicesData?.pagination?.hasNextPage || false,
    },
    isLoading,
    error,
    handleTableChange,
  };
};

export default useEmittedInvoices;
