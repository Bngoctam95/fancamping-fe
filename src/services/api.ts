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

export const createUserAPI = (name: string, email: string, password: string, phone: string, role?: string) => {
    const urlBackend = 'users';
    return axios.post<IBackendRes<IUserTable>>(urlBackend, { name, email, password, phone, role });
};

export const updateUserAvatarAPI = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return axios.post<IBackendRes<IUserAvatar>>('users/upload/avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const getEquipmentCategoriesAPI = () => {
    const urlBackend = 'products/categories?type=product';
    return axios.get<IBackendRes<IEquipmentCategory>>(urlBackend);
};

export const createEquipmentCategoryAPI = (name: string, slug: string, description: string, type: string) => {
    const urlBackend = 'products/categories';
    return axios.post<IBackendRes<IEquipmentCategory>>(urlBackend, { name, slug, description, type });
};

export const deleteEquipmentCategoryAPI = (_id: string) => {
    const urlBackend = `products/categories/${_id}`;
    return axios.delete<IBackendRes<IDeleteEquipmentCategory>>(urlBackend);
};

export const updateEquipmentCategoryAPI = (_id: string, name: string, slug: string, description: string) => {
    const urlBackend = `products/categories/${_id}`;
    return axios.put<IBackendRes<IEquipmentCategory>>(urlBackend, { name, slug, description });
};

export const getPostCategoriesAPI = () => {
    const urlBackend = 'posts/categories?type=post';
    return axios.get<IBackendRes<IEquipmentCategory>>(urlBackend);
};

export const createPostCategoryAPI = (name: string, slug: string, description: string, type: string) => {
    const urlBackend = 'posts/categories';
    return axios.post<IBackendRes<IEquipmentCategory>>(urlBackend, { name, slug, description, type });
};

export const deletePostCategoryAPI = (_id: string) => {
    const urlBackend = `posts/categories/${_id}`;
    return axios.delete<IBackendRes<IDeleteEquipmentCategory>>(urlBackend);
};

export const updatePostCategoryAPI = (_id: string, name: string, slug: string, description: string) => {
    const urlBackend = `posts/categories/${_id}`;
    return axios.put<IBackendRes<IEquipmentCategory>>(urlBackend, { name, slug, description });
};

export const getProductsAPI = (query: string) => {
    const urlBackend = `products?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IProductTable>>>(urlBackend);
};

export const getProductDetailAPI = (_id: string) => {
    const urlBackend = `products/${_id}`;
    return axios.get<IBackendRes<IProductTable>>(urlBackend);
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

export const updateProductAPI = (
    _id: string,
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
    const urlBackend = `products/${_id}`;
    return axios.put<IBackendRes<IProductTable>>(urlBackend, {
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

// API upload blog thumbnail
export const uploadPostThumbnailAPI = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return axios.post<IBackendRes<string>>('posts/upload/thumbnail', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

// API upload blog content image
export const uploadPostImageAPI = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return axios.post<IBackendRes<string>>('posts/upload/content-image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const createPostAPI = (
    title: string,
    subTitle: string,
    thumbnail: string,
    categoryId: string,
    tags: string[],
    content: string,
    type: string,
    slug: string,
    status: string
) => {
    const urlBackend = 'posts';
    return axios.post<IBackendRes<IPostTable>>(urlBackend, {
        title,
        subTitle,
        thumbnail,
        categoryId,
        tags,
        content,
        type,
        slug,
        status,
    });
};

export const getMyBlogsAPI = () => {
    const urlBackend = 'posts/my-posts';
    return axios.get<IBackendRes<IPostTable[]>>(urlBackend);
};

export const getAllPostsAPI = (query: string) => {
    const urlBackend = `posts?${query}`;
    return axios.get<IBackendRes<IPostTable[]>>(urlBackend);
};

export const getPostByIdAPI = (_id: string) => {
    const urlBackend = `posts/${_id}`;
    return axios.get<IBackendRes<IPostTable>>(urlBackend);
};

export const updatePostAPI = (
    _id: string,
    title: string,
    subTitle: string,
    thumbnail: string,
    categoryId: string,
    tags: string[],
    content: string,
    type: string,
    slug: string,
    status: string
) => {
    const urlBackend = `posts/${_id}`;
    return axios.put<IBackendRes<IPostTable>>(urlBackend, {
        title,
        subTitle,
        thumbnail,
        categoryId,
        tags,
        content,
        type,
        slug,
        status,
    });
};

export const updatePostStatusAPI = (_id: string, status: string) => {
    const urlBackend = `posts/${_id}`;
    return axios.put<IBackendRes<IPostTable>>(urlBackend, { status });
};

export const deletePostAPI = (_id: string) => {
    const urlBackend = `posts/${_id}`;
    return axios.delete<IBackendRes<IPostTable>>(urlBackend);
};
