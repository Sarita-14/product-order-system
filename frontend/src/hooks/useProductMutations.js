
// Custom React Query hooks for product create, update and delete operations.
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "../api/resources";

// Create product
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values) => productsApi.create(values),

    onSuccess: () => {
      // Refresh products list after successful creation.
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// Update product
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }) => productsApi.update(id, values),

    onSuccess: () => {
      // Refresh products list after successful update.
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// Delete product
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => productsApi.remove(id),

    onSuccess: () => {
      // Refresh products list after successful deletion.
      queryClient.invalidateQueries({ queryKey: ["products"] });
      //This tells React Query that the products data may be outdated
    },
  });
}
