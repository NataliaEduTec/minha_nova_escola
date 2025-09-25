import {useEffect, useState} from "react";
import {showToast} from "../../../components/General/Notification";
import ReportHeader from "../../../components/General/ReportHeader";
import InstallationApi, {TInstallationFormValues} from "../../../services/installations.ts";

export default function InstallationsReportResults() {

    const [installations, setInstallations] = useState<TInstallationFormValues[]>([])

    useEffect(() => {
        getAll().then(i => setInstallations(i ?? []))
    }, []);

    const getAll = async (): Promise<TInstallationFormValues[] | undefined> => {
        const response = await InstallationApi.getAll<TInstallationFormValues[]>()

        if (response.status !== "success"){
            showToast(response.message, response.status)
            return
        }

        return response.data
    }

    return (
        <div className="min-h-screen w-screen z-[10010] bg-base-200 p-8">
            <div className="max-w-7xl mx-auto">
                <ReportHeader title={"Relatório de Instalações"} />

                <div className="bg-base-100 rounded-box shadow-md">
                    <table className="table table-zebra">
                        <thead>
                        <tr>
                            <th>Área</th>
                            <th>Nome</th>
                            <th>Cor</th>
                            <th>Capacidade de pessoas</th>
                            <th>Horas máxima de reserva</th>
                        </tr>
                        </thead>
                        <tbody>
                        {installations.map(report => (
                            <tr key={report.id_instalacao}>
                                <td>{
                                    report?.area?.nome || ""
                                }</td>
                                <td></td>
                                <td className={`capitalize h-full`}>
                                   <span >
                                    {report.cor}
                                   </span>

                                </td>
                                <td className="capitalize">{
                                    report.capacidade_pessoas
                                }</td>
                                <td>
                                    {report?.horas_max_reserva}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {installations.length === 0 && (
                    <div className="text-center py-8 bg-base-100 rounded-box mt-4">
                        <p className="text-gray-500">Nenhum resultado encontrado</p>
                    </div>
                )}
            </div>
        </div>
    );
}