import axios from 'services/axios.customize';

export const loginAPI = (email: string, password: string) => {
    const urlBackend = 'auth/login';
    return axios.post<IBackendRes<ILogin>>(urlBackend, { email, password });
};

export const registerAPI = (name: string, email: string, password: string, phone: string) => {
    const urlBackend = 'auth/register';
    return axios.post<IBackendRes<IRegister>>(urlBackend, { name, email, password, phone });
};

export const fetchAccountAPI = () => {
    const urlBackend = 'auth/profile';
    return axios.get<IBackendRes<IUser>>(urlBackend);
};

export const logoutAPI = () => {
    const urlBackend = 'auth/logout';
    return axios.post<IBackendRes<IUser>>(urlBackend);
};

export const getUsersAPI = (query: string) => {
    const urlBackend = `users?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend);
};

export const deleteUserAPI = (_id: string) => {
    const urlBackend = `users/${_id}`;
    return axios.delete<IBackendRes<IDeleteUser>>(urlBackend);
};

export const updateUserAPI = (_id: string, name: string, phone: string) => {
    const urlBackend = `users/${_id}`;
    return axios.put<IBackendRes<IRegister>>(urlBackend, { name, phone });
};

export const createUserAPI = (name: string, email: string, password: string, phone: string) => {
    const urlBackend = 'users';
    return axios.post<IBackendRes<IUserTable>>(urlBackend, { name, email, password, phone });
};

export const getEquipmentCategoriesAPI = () => {
    const urlBackend = 'products/categories';
    return axios.get<IBackendRes<IEquipmentCategory>>(urlBackend);
};

export const createEquipmentCategoryAPI = (name: string, slug: string, description: string) => {
    const urlBackend = 'products/categories';
    return axios.post<IBackendRes<IEquipmentCategory>>(urlBackend, { name, slug, description });
};

export const deleteEquipmentCategoryAPI = (_id: string) => {
    const urlBackend = `products/categories/${_id}`;
    return axios.delete<IBackendRes<IDeleteEquipmentCategory>>(urlBackend);
};

export const updateEquipmentCategoryAPI = (_id: string, name: string, slug: string, description: string) => {
    const urlBackend = `products/categories/${_id}`;
    return axios.put<IBackendRes<IEquipmentCategory>>(urlBackend, { name, slug, description });
};

export const getProductsAPI = (query: string) => {
    const urlBackend = `products?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IProductTable>>>(urlBackend);
};

export const deleteProductAPI = (_id: string) => {
    const urlBackend = `products/${_id}`;
    return axios.delete<IBackendRes<IProductTable>>(urlBackend);
};

export const createProductAPI = (
    name: string,
    slug: string,
    shortDescription: string,
    description: string,
    categoryId: string,
    tags: string[],
    price: number,
    inventory: IInventory,
    thumbnail: string,
    slider: string[]
) => {
    const urlBackend = 'products';
    return axios.post<IBackendRes<IProductTable>>(urlBackend, {
        name,
        slug,
        shortDescription,
        description,
        categoryId,
        tags,
        price,
        inventory,
        thumbnail,
        slider,
    });
};

// API upload thumbnail
export const uploadProductThumbnailAPI = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return axios.post<IBackendRes<string>>('products/upload/thumbnail', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

// API upload slider images
export const uploadProductSliderAPI = (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append('files', file);
    });

    return axios.post<IBackendRes<string[]>>('products/upload/slider', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
