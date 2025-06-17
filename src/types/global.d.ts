export {};

declare global {
    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        message_key: string;
        statusCode: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        totalPages: number;
        limit: number;
        page: number;
        total: number;
        items: T[];
    }

    interface ILogin {
        access_token: string;
        user: {
            email: string;
            phone: string;
            name: string;
            role: string;
            avatar: string;
            id: string;
            isActive: boolean;
        };
    }

    interface IRegister {
        _id: string;
        email: string;
        name: string;
    }

    interface IUser {
        email: string;
        phone: string;
        name: string;
        role: string;
        avatar: string;
        id: string;
        isActive: boolean;
    }

    interface IUserAvatar {
        avatar: string;
    }

    interface IUserTable {
        _id: string;
        name: string;
        email: string;
        phone: string;
        role: string;
        avatar: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }

    interface IProductTable {
        _id: string;
        name: string;
        slug: string;
        description: string;
        shortDescription: string;
        thumbnail: string;
        slider: string[];
        price: number;
        inventory: {
            total: number;
            available: number;
            _id: string;
        };
        categoryId: {
            _id: string;
            name: string;
            slug: string;
        };
        tags: string[];
        ratings: {
            average: number;
            count: number;
            _id: string;
        };
        status: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }

    interface IDeleteEquipmentCategory {
        statusCode: number;
        message: string;
        message_key: string;
        data: IEquipmentCategory;
    }
    interface IDeleteUser {
        statusCode: number;
        message: string;
        message_key: string;
        data: null;
    }

    interface IEquipmentCategory {
        _id: string;
        name: string;
        slug: string;
        description: string;
        image: string;
        isActive: boolean;
        order: number;
        createdAt: Date;
        updatedAt: Date;
    }

    interface IInventory {
        total: number;
        available: number;
    }

    interface IPostTable {
        _id: string;
        title: string;
        subTitle: string;
        thumbnail: string;
        content: string;
        tags: string[];
        authorId: {
            _id: string;
            name: string;
            email: string;
        };
        type: string;
        categoryId: {
            _id: string;
            name: string;
            slug: string;
        };
        published: boolean;
        likeCount: number;
        commentCount: number;
        viewCount: number;
        slug: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }
}
