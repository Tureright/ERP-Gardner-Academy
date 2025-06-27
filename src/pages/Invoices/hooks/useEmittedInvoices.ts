import { invoiceService } from "@/services/Invoices/invoiceService";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

interface PaginationState {
  page: number;
  pageSize: number;
}

const useEmittedInvoices = (highlightInvoiceId?: string) => {
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 20,
  });

  const {
    data: emittedInvoicesData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["emittedInvoices", pagination.page, pagination.pageSize],
    queryFn: () =>
      invoiceService.getEmittedInvoices(pagination.page, pagination.pageSize),
  });

  // Si hay un ID de factura para resaltar, buscar en la primera página
  useEffect(() => {
    if (highlightInvoiceId && emittedInvoicesData?.data) {
      const foundInvoice = emittedInvoicesData.data.find(
        (invoice) => invoice.id === highlightInvoiceId || invoice.numero === highlightInvoiceId
      );
      
      if (foundInvoice) {
        // La factura está en la página actual, se puede resaltar
        console.log("Factura encontrada para resaltar:", foundInvoice);
      } else {
        // La factura no está en la página actual, refrescar datos
        refetch();
      }
    }
  }, [highlightInvoiceId, emittedInvoicesData?.data, refetch]);

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
    refetch,
  };
};

export default useEmittedInvoices;
