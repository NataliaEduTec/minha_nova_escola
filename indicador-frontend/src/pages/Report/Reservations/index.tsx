import {useSearchParams} from 'react-router-dom';
import {useEffect, useState} from "react";
import ReservationsApi, {TReservationsFormValues} from "../../../services/reservations.ts";
import {showToast} from "../../../components/General/Notification";
import ReportHeader from "../../../components/General/ReportHeader";

export default function ReportResults() {

    const [searchParams] = useSearchParams();

    const [reservations, setReservations] = useState<TReservationsFormValues[]>([])

    useEffect(() => {
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const idArea = searchParams.get('id_area');
        const idEmployee = searchParams.get('id_employee');
        const idInstallation = searchParams.get('id_installation');

        const params = `?data_inicio=${startDate}&data_fim=${endDate}&id_area=${idArea}&id_instalacao=${idInstallation}&id_funcionario=${idEmployee}`

        getAll(params).then(i => setReservations(i ?? []))

    }, [searchParams]);

    const getAll = async (params?: string): Promise<TReservationsFormValues[] | undefined> => {
        const response = await ReservationsApi.getAll<TReservationsFormValues[]>(params)

        if (response.status !== "success"){
            showToast(response.message, response.status)
            return
        }

        return response.data
    }

    return (
        <div className="min-h-screen w-screen z-[10010] bg-base-200 p-8">
            <div className="max-w-7xl mx-auto">
                <ReportHeader title={"Relatório de Reservas"} />

                <div className="bg-base-100 rounded-box shadow-md overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                        <tr>
                            <th>Data</th>
                            <th>Hora inicial</th>
                            <th>Hora final</th>
                            <th>Funcionário</th>
                            <th>Instalação</th>
                        </tr>
                        </thead>
                        <tbody>
                        {reservations.map(report => (
                            <tr key={report.id_reserva}>
                                <td>{
                                    report.inicio_reserva.split(" ")[0].split("-").reverse().join("/")
                                }</td>
                                <td className="capitalize">{
                                    report.inicio_reserva.split(" ")[1].slice(0, 5)
                                }</td>
                                <td className="capitalize">{
                                    report.termino_reserva.split(" ")[1].slice(0, 5)
                                }</td>
                                <td>
                                    <span>
                                      {report?.funcionario?.name || ""}
                                    </span>
                                </td>
                                <td>
                                    <span>
                                      {report?.instalacao?.nome || ""}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {reservations.length === 0 && (
                    <div className="text-center py-8 bg-base-100 rounded-box mt-4">
                        <p className="text-gray-500">Nenhum resultado encontrado</p>
                    </div>
                )}
            </div>
        </div>
    );
}