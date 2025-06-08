import { fetchAccountAPI } from "services/api";
import { createContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Tent } from "lucide-react";

interface IAppContext {
    isAuthenticated: boolean;
    user: IUser | null;
    setIsAuthenticated: (v: boolean) => void;
    setUser: (v: IUser | null) => void;
    isLoading: boolean;
    setIsLoading: (v: boolean) => void;
}

type TProps = {
    children: React.ReactNode
}

const CurrentAppContext = createContext<IAppContext | null>(null);

const AppProvider = (props: TProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchAccount = async () => {

            const res = await fetchAccountAPI();
            if (res?.data) {
                setUser(res.data);
                setIsAuthenticated(true);
            }
            setIsLoading(false);
        };
        fetchAccount();
    }, [])

    return (
        <>
            {isLoading === false ?
                <CurrentAppContext.Provider value={{
                    isAuthenticated, user, setIsAuthenticated, setUser,
                    isLoading, setIsLoading
                }}>
                    {props.children}
                </CurrentAppContext.Provider>
                :
                <div style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px"
                }}>
                    <Tent className="text-primary text-4xl" />
                    <span className="font-montserrat font-bold text-2xl text-primary">
                        {t('siteName')}
                    </span>
                </div>
            }
        </>
    );
};

export { CurrentAppContext, AppProvider };