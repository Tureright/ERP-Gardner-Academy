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
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      itemService.updateItem(id, data),
    onSuccess: (response) => {  
      console.log("response actualizar item: ", response)    
      // Verificar si la respuesta tiene el formato esperado
      if (response.success && response.data) {
        toast({
          title: "✅ Item actualizado exitosamente",
          description: response.data.message || "Item actualizado correctamente",
        });

        queryClient.invalidateQueries({ queryKey: ["items"] });      

        return { success: true, message: response.data.message };
      } else {
        toast({
          variant: "destructive",
          title: "❌ Error al actualizar el item",
          description: response.errorResponse.message || "Ha ocurrido un error inesperado",
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
      // Verificar si la respuesta tiene el formato esperado
      if (response.success && response.data) {
        toast({
          title: "✅ Item creado exitosamente",
          description: `${response.data.message} - ID: ${response.data.id || 'N/A'}`,
        });
        queryClient.invalidateQueries({ queryKey: ["items"] });

        return { success: true, itemId: response.data.id, message: response.data.message };
      } else {
        toast({
          variant: "destructive",
          title: "❌ Error al crear el item",
          description: response.errorResponse.message || "Ha ocurrido un error inesperado",
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
    items,
    isLoading,
    error,
    updateItem: updateMutation.mutateAsync,
    createItem: createMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    isCreating: createMutation.isPending,
  };
};
