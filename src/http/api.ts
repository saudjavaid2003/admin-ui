// import type { AxiosResponse } from 'axios';
// import type { 
//     CreateTenantData, 
//     CreateUserData, 
//     Credentials, 
//     OrderStatus, 
//     Category, 
//     Product, 
//     Tenant, 
//     User 
// } from '../types';
// import { api } from './client';

// export const AUTH_SERVICE = '/api/auth';
// const CATALOG_SERVICE = '/api/catalog';
// // const ORDER_SERVICE = '/api/order';

// // --- Auth Service ---

// export const login = (credentials: Credentials) =>
//     api.post(`${AUTH_SERVICE}/auth/login`, credentials);

// export const self = (): Promise<AxiosResponse<User>> => 
//     api.get(`${AUTH_SERVICE}/auth/self`);

// export const logout = () => 
//     api.post(`${AUTH_SERVICE}/auth/logout`);

// export const getUsers = (queryString: string): Promise<AxiosResponse<User[]>> => 
//     api.get(`${AUTH_SERVICE}/users?${queryString}`);

// export const getTenants = (queryString: string): Promise<AxiosResponse<Tenant[]>> =>
//     api.get(`${AUTH_SERVICE}/tenants?${queryString}`);

// export const createUser = (user: CreateUserData) => 
//     api.post(`${AUTH_SERVICE}/users`, user);

// export const createTenant = (tenant: CreateTenantData) =>
//     api.post(`${AUTH_SERVICE}/tenants`, tenant);

// export const updateUser = (user: CreateUserData, id: string) =>
//     api.patch(`${AUTH_SERVICE}/users/${id}`, user);


// // --- Catalog Service ---

// /** * Typed to Category[] so your Table knows exactly what fields exist 
//  */
// export const getCategories = (): Promise<AxiosResponse<Category[]>> => 
//     api.get(`${CATALOG_SERVICE}/categories`);

// export const getProducts = (queryParam: string): Promise<AxiosResponse<Product[]>> =>
//     api.get(`${CATALOG_SERVICE}/products?${queryParam}`);

// export const createProduct = (product: FormData) =>
//     api.post(`${CATALOG_SERVICE}/products`, product, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//     });

// export const getCategory = (id: string): Promise<AxiosResponse<Category>> => 
//     api.get(`${CATALOG_SERVICE}/categories/${id}`);

// export const updateProduct = (product: FormData, id: string) => {
//     return api.put(`${CATALOG_SERVICE}/products/${id}`, product, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//     });
// };

// /** * Compatible with CategoryForm: 
//  * It takes the transformed data (without the DB-generated _id)
//  */
// export const createCategory = (data: Omit<Category, '_id'>) => 
//     api.post(`${CATALOG_SERVICE}/categories`, data);


// // --- Order Service (Kept commented as per your original file) ---
// // export const getOrders = (queryString: string) => api.get(`${ORDER_SERVICE}/orders?${queryString}`);
// // export const getSingle = (orderId: string, queryString: string) =>
// //     api.get(`${ORDER_SERVICE}/orders/${orderId}?${queryString}`);
// // export const changeStatus = (orderId: string, data: { status: OrderStatus }) =>
// //     api.patch(`${ORDER_SERVICE}/orders/change-status/${orderId}`, data);
import type { CreateTenantData, CreateUserData, Credentials } from '../types';
import  {api}  from './client';

export const AUTH_SERVICE = '/api/auth';
const CATALOG_SERVICE = '/api/catalog';
// const ORDER_SERVICE = '/api/order';

// Auth service
export const login = (credentials: Credentials) =>
    api.post(`${AUTH_SERVICE}/auth/login`, credentials);

export const self = () => api.get(`${AUTH_SERVICE}/auth/self`);
export const logout = () => api.post(`${AUTH_SERVICE}/auth/logout`);
// export const getUsers=()=> api.get(`${AUTH_SERVICE}/auth/users`);
export const getUsers = (queryString: string) => api.get(`${AUTH_SERVICE}/users?${queryString}`);
export const getTenants = (queryString: string) =>
    api.get(`${AUTH_SERVICE}/tenants?${queryString}`);
export const createUser = (user: CreateUserData) => api.post(`${AUTH_SERVICE}/users`, user);
export const createTenant = (tenant: CreateTenantData) =>
    api.post(`${AUTH_SERVICE}/tenants`, tenant);
export const updateUser = (user: CreateUserData, id: string) =>
    api.patch(`${AUTH_SERVICE}/users/${id}`, user);

// Catelog service
export const getCategories = () => api.get(`${CATALOG_SERVICE}/categories`);
export const getProducts = (queryParam: string) =>
    api.get(`${CATALOG_SERVICE}/products?${queryParam}`);
export const createProduct = (product: FormData) =>
    api.post(`${CATALOG_SERVICE}/products`, product, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
export const getCategory = (id: string) => api.get(`${CATALOG_SERVICE}/categories/${id}`);
export const updateProduct = (product: FormData, id: string) => {
    return api.put(`${CATALOG_SERVICE}/products/${id}`, product, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

// // Order service
// export const getOrders = (queryString: string) => api.get(`${ORDER_SERVICE}/orders?${queryString}`);
// export const getSingle = (orderId: string, queryString: string) =>
//     api.get(`${ORDER_SERVICE}/orders/${orderId}?${queryString}`);
// export const changeStatus = (orderId: string, data: { status: OrderStatus }) =>
//     api.patch(`${ORDER_SERVICE}/orders/change-status/${orderId}`, data);