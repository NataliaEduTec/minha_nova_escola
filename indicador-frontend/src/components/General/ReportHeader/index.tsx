import {ArrowLeft, FileText, Printer} from "lucide-react";
import {useNavigate} from "react-router-dom";
import React from "react";

type Props = React.HTMLAttributes<HTMLDivElement> & {
    title: string
}

export default function ReportHeader({title, className = ""}: Props) {

    const navigate = useNavigate();

    const handlePrint = () => {
        window.print();
    };

    return <div className={`flex justify-between items-center mb-8 ${className}`}>
        <div onClick={() => navigate(-1)} className="btn btn-outline btn-sm no-printable">
            <ArrowLeft className="w-4 h-4 mr-2"/>
            Voltar
        </div>
        <div className="flex items-center gap-3 max-w-[50%] text-center">
            <FileText className="w-6 h-6"/>
            <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        <div>
            <button
                onClick={handlePrint}
                className="btn btn-outline btn-sm no-printable"
                title="Imprimir"
            >
                <Printer className="w-4 h-4"/>
                Imprimir
            </button>
        </div>
    </div>
}