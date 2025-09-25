import {useEffect, useState} from "react";
import {showToast} from "../../../components/General/Notification";
import ReportHeader from "../../../components/General/ReportHeader";
import EquipmentApi, {TEquipmentFormValues} from "../../../services/equipment.ts";

export default function EquipmentsReportResults() {

    const [equipments, setEquipments] = useState<TEquipmentFormValues[]>([])

    useEffect(() => {
        getAll().then(i => setEquipments(i ?? []))
    }, []);

    const getAll = async (): Promise<TEquipmentFormValues[] | undefined> => {
        const response = await EquipmentApi.getAll<TEquipmentFormValues[]>()

        if (response.status !== "success"){
            showToast(response.message, response.status)
            return
        }

        return response.data
    }

    return (
        <div className="min-h-screen w-screen z-[10010] bg-base-200 p-8">
            <div className="max-w-7xl mx-auto">
                <ReportHeader title={"Relatório de Equipamentos"} />

                <div className="bg-base-100 rounded-box shadow-md">
                    <table className="table table-zebra">
                        <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Quantidade total</th>
                            <th>Quantidade disponivel por dia</th>
                            <th>Cor</th>
                        </tr>
                        </thead>
                        <tbody>
                        {equipments.map(report => (
                            <tr key={report.id_equipamento}>
                                {/*<td>{report.nome}</td>*/}
                                <td>{report.quantidade_total}</td>
                                <td>{report.quantidade_disponivel_por_dia}</td>

                                <td className={`capitalize h-full`}>
                                   <span>
                                    {report.cor}
                                   </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {equipments.length === 0 && (
                    <div className="text-center py-8 bg-base-100 rounded-box mt-4">
                        <p className="text-gray-500">Nenhum resultado encontrado</p>
                    </div>
                )}
            </div>
        </div>
    );
}