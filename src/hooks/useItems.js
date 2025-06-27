import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { itemService } from "@/services/Invoices/itemService";

export const useItems = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Query para obtener items
  const {
    data: items = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["items"],
    queryFn: itemService.getItems,
  });

  // Mutation para actualizar items
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => itemService.updateItem(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast({
        title: "Item actualizado",
        description: data.data.message || "Item actualizado correctamente",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error al actualizar el item",
        description: error.message,
      });
    },
  });

  // Mutation para crear items
  const createMutation = useMutation({
    mutationFn: (data) => itemService.createItem(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast({
        title: "Item creado",
        description: data.data.message,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error al crear el item",
        description: error.message,
      });
    },
  });

  return {
    items,
    isLoading,
    error,
    updateItem: updateMutation.mutate,
    createItem: createMutation.mutate,
    isUpdating: updateMutation.isPending,
    isCreating: createMutation.isPending,
  };
};