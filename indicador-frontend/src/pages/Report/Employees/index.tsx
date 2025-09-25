import {useEffect, useState} from "react";
import {showToast} from "../../../components/General/Notification";
import ReportHeader from "../../../components/General/ReportHeader";
import EmployeeApi, {TEmployeeFormValues} from "../../../services/employee.ts";

export default function EmployeesReportResults() {

    const [employees, setEmployees] = useState<TEmployeeFormValues[]>([])

    useEffect(() => {
        getAll().then(i => setEmployees(i ?? []))
    }, []);

    const getAll = async (): Promise<TEmployeeFormValues[] | undefined> => {
        const response = await EmployeeApi.getAll<TEmployeeFormValues[]>()

        if (response.status !== "success"){
            showToast(response.message, response.status)
            return
        }

        return response.data
    }

    return (
        <div className="min-h-screen w-screen z-[10010] bg-base-200 p-8">
            <div className="max-w-7xl mx-auto">
                <ReportHeader title={"Relatório de Funcionários"} />

                <div className="bg-base-100 rounded-box shadow-md">
                    <table className="table table-zebra">
                        <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Função</th>
                            <th>Registro</th>
                            <th><p>Máximo de reservas mensais</p></th>
                            <th><p className={"w-full"}>Máximo de equipamentos por reserva</p></th>
                        </tr>
                        </thead>
                        <tbody>
                        {employees.map(report => (
                            <tr key={report.id_funcionario}>
                                <td>{
                                    // report.nome
                                }</td>
                                <td className="capitalize">{
                                    report.funcao
                                }</td>
                                <td className="capitalize">{
                                    report.registro
                                }</td>
                                <td>
                                    {report?.max_reservas_mensais}
                                </td>
                                <td>
                                    {report?.max_equipamentos_reserva}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {employees.length === 0 && (
                    <div className="text-center py-8 bg-base-100 rounded-box mt-4">
                        <p className="text-gray-500">Nenhum resultado encontrado</p>
                    </div>
                )}
            </div>
        </div>
    );
}