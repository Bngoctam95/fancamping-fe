import axios from 'services/axios.customize'

export const loginAPI = (email: string, password: string) => {
    const urlBackend = "/auth/login";
    return (
        axios.post<IBackendRes<ILogin>>(urlBackend, { email, password })
    )
}