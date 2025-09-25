import { createContext, useContext, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import LoginApi from "@/services/auth.ts";

type AuthContextType = {
    isAuthenticated: boolean | null;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children, headerHeight }: { children: React.ReactNode, headerHeight?: number }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await LoginApi.check();

                if (response.data && response.data?.error && response.data?.error === "401") {
                    setIsAuthenticated(false);
                    return;
                }

                setIsAuthenticated(true);
            } catch (error) {
                console.error("Erro ao verificar autenticação:", error);
                setIsAuthenticated(true);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading }}>
            <Sidebar style={{top: headerHeight}}/>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
};
