import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen bg-gray-100 text-gray-800 z-[1001]">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-lg mb-6">Página não encontrada</p>
            <Link
                to="/indicadores/diagnosticos"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
            >
                Voltar para a Página Inicial
            </Link>
        </div>
    );
}