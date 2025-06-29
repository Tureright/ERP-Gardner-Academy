import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { itemService } from "@/services/Invoices/itemService";
import { useState, useMemo } from "react";

interface SortState {
  field?: string;
  order?: 'ascend' | 'descend';
}

export const useItems = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [sortState, setSortState] = useState<SortState>({});

  const {
    data: items = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["items"],
    queryFn: itemService.getItems,
  });

  const sortedItems = useMemo(() => {
    if (!items || !sortState.field) {
      return items;
    }

    return [...items].sort((a, b) => {
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

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        if (aValue < bValue) {
          return sortState.order === 'ascend' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortState.order === 'ascend' ? 1 : -1;
        }
        return 0;
      }

      if (aValue < bValue) {
        return sortState.order === 'ascend' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortState.order === 'ascend' ? 1 : -1;
      }
      return 0;
    });
  }, [items, sortState]);

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

  // Mutation para actualizar items
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      itemService.updateItem(id, data),
    onSuccess: (response) => {
      console.log("response actualizar item: ", response);
      const { message, id } = response.data;
      if (response.success && response.data) {
        toast({
          variant: "success",
          title: "✅ Estado",
          description: `${message || "N/A"}`,
        });

        queryClient.invalidateQueries({ queryKey: ["items"] });

        return { success: true, message: message, itemId: id };
      } else {
        toast({
          variant: "destructive",
          title: "❌ Estado",
          description: "Ha ocurrido un error inesperado",
        });

        return { success: false, message: "Ha ocurrido un error inesperado" };
      }
    },
    // onError: (error: Error) => {
    //   toast({
    //     variant: "destructive",
    //     title: "❌ Error al actualizar el item",
    //     description: error.message || "Ha ocurrido un error inesperado",
    //   });
    //   return { success: false, message: "Ha ocurrido un error inesperado" };
    // },
  });

  // Mutation para crear items
  const createMutation = useMutation({
    mutationFn: (data: any) => itemService.createItem(data),
    onSuccess: (response) => {
      console.log("Respuesta del servidor al crear:", response);
      const { message, id } = response.data;
      if (response.success && response.data) {
        toast({
          variant: "success",
          title: "✅ Estado",
          description: `${message} - ID: ${id || "N/A"}`,
        });
        queryClient.invalidateQueries({ queryKey: ["items"] });

        return { success: true, itemId: id, message: message };
      } else {
        toast({
          variant: "destructive",
          title: "❌ Error al crear el item",
          description: "Ha ocurrido un error inesperado",
        });
        return { success: false, message: "Ha ocurrido un error inesperado" };
      }
    },
    // onError: (error: Error) => {
    //   toast({
    //     variant: "destructive",
    //     title: "❌ Error al crear el item",
    //     description: error.message || "Ha ocurrido un error inesperado",
    //   });
    //   return { success: false, error: error.message };
    // },
  });

  return {
    items: sortedItems,
    isLoading,
    error,
    updateItem: updateMutation.mutateAsync,
    createItem: createMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    isCreating: createMutation.isPending,
    handleTableChange,
  };
};
