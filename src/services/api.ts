import axios from 'services/axios.customize'

export const loginAPI = (email: string, password: string) => {
    const urlBackend = "/auth/login";
    return (
        axios.post<IBackendRes<ILogin>>(urlBackend, { email, password })
    )
}

export const registerAPI = (name: string, email: string, password: string, phone: string) => {
    const urlBackend = "/auth/register";
    return (
        axios.post<IBackendRes<IRegister>>(urlBackend, { name, email, password, phone })
    )
}

export const fetchAccountAPI = () => {
    const urlBackend = "/auth/profile";
    return (
        axios.get<IBackendRes<IUser>>(urlBackend)
    )
}

export const logoutAPI = () => {
    const urlBackend = "/auth/logout";
    return (
        axios.post<IBackendRes<IUser>>(urlBackend)
    )
}
