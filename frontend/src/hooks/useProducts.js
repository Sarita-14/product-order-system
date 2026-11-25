
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../api/resources";

// Fetch products and manage them using React Query
function useProducts() {
  return useQuery({//used to fetch server data
    queryKey: ["products"],//Unique identity of the cached data. Here, the key is products
    queryFn: productsApi.list, //Function that makes the API request
  });
}
// Create a new product
export function useCreateProduct() {
  const queryClient = useQueryClient();
  //gives us access to the central React Query client that we configured in main.jsx

  return useMutation({
    mutationFn: productsApi.create,//Calls your existing POST API
    //tells React Query which function should run when we want to create a product
    onSuccess: () => {
      // Refresh product list after successful creation
      queryClient.invalidateQueries({
        //refresh the product list
        queryKey: ["products"],
      });
    },
  });
}

// Update an existing product
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }) => productsApi.update(id, values),

    onSuccess: () => {
      // Refresh product list after successful update
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}

// Delete an existing product
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => productsApi.remove(id),

    onSuccess: () => {
      // Refresh product list after successful deletion
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}

export default useProducts;

