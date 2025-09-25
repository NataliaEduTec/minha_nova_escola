import { Navigate } from 'react-router-dom';
import Loading from "../components/General/Loading";
import {useAuth} from "../context/Auth.tsx";

interface ProtectedRouteProps {
    children: React.ReactNode;
    // isAuthenticated: boolean | null
    // isLoading: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) => {

    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="z-[1000] min-h-screen bg-white flex items-center justify-center h-screen w-screen">
                <Loading />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}

export default ProtectedRoute;