export { };

declare global {

    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        message_key: string;
        statusCode: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        result: T[]
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
        fullName: string;
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

}
