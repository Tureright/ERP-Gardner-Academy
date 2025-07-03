import { invoiceService } from "@/services/Invoices/invoiceService";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";

interface PaginationState {
  page: number;
  pageSize: number;
}

interface SortState {
  field?: string;
  order?: 'ascend' | 'descend';
}

const useEmittedInvoices = (highlightInvoiceId?: string) => {
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 20,
  });
  
  const [sortState, setSortState] = useState<SortState>({});

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

  const sortedInvoices = useMemo(() => {
    if (!emittedInvoicesData?.data || !sortState.field) {
      return emittedInvoicesData?.data || [];
    }

    return [...emittedInvoicesData.data].sort((a, b) => {
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
  }, [emittedInvoicesData?.data, sortState]);

  useEffect(() => {
    if (highlightInvoiceId && sortedInvoices) {
      const foundInvoice = sortedInvoices.find(
        (invoice) => invoice.id === highlightInvoiceId || invoice.numero === highlightInvoiceId
      );
      
      if (foundInvoice) {
        //console.log("Factura encontrada para resaltar:", foundInvoice);
      } else {
        // La factura no está en la página actual, refrescar datos
        refetch();
      }
    }
  }, [highlightInvoiceId, sortedInvoices, refetch]);

  const handleTableChange = (newPagination: {
    current: number;
    pageSize: number;
  }, filters: any, sorter: any) => {
    setPagination({
      page: newPagination.current,
      pageSize: newPagination.pageSize,
    });
    
    if (sorter && sorter.field) {
      setSortState({
        field: sorter.field,
        order: sorter.order,
      });
    } else {
      setSortState({});
    }
  };

  return {
    emittedInvoices: sortedInvoices,
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
