// Backend resources. Only call the methods the backend actually has:
//   productsApi -> list, get, create, update, remove
//   ordersApi   -> list, get, create   (no update/cancel route yet)
//   usersApi    -> list, get, create   (users = customers who place orders)
import { createResource } from "./client";

export const productsApi = createResource("/products");
export const ordersApi = createResource("/orders");
export const usersApi = createResource("/users");
