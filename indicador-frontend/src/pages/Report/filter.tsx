import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {ArrowLeft, Filter, Search} from 'lucide-react';
import SelectSearchable, {SelectOption} from "../../components/Elements/Select/Searchable";
import AreasApi, {TAreasFormValuesPT} from "../../services/areas.ts";
import {showToast} from "../../components/General/Notification";
import EmployeeApi, {TEmployeeFormValues} from "../../services/employee.ts";
import InstallationApi, {TInstallationFormValues} from "../../services/installations.ts";

interface FilterCriteria {
    startDate: string;
    endDate: string;
    id_area: string;
    id_employee: string;
    id_installation: string;
}

export default function ReportFilter() {
    const navigate = useNavigate();

    const [optionsInstallations, setOptionsInstallations] = useState<SelectOption[]>([])
    const [selectedInstallation, setSelectedInstallation] = useState('');
    const [installations, setInstallations] = useState<TInstallationFormValues[]>([])

    const [optionsArea, setOptionsArea] = useState<SelectOption[]>([])
    const [selectedArea, setSelectedArea] = useState('');
    const [areas, setAreas] = useState<TAreasFormValuesPT[]>([])

    const [optionsEmployee, setOptionsEmployee] = useState<SelectOption[]>([])
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [employees, setEmployees] = useState<TEmployeeFormValues[]>([])

    const getAllEmployees = async (): Promise<TEmployeeFormValues[] | undefined> => {
        const response = await EmployeeApi.getAll<TEmployeeFormValues[]>()

        if (response.status !== "success"){
            showToast(response.message, response.status)
            return
        }

        return response.data
    }

    const getAllAreas = async (): Promise<TAreasFormValuesPT[] | undefined> => {
        const response = await AreasApi.getAll<TAreasFormValuesPT[]>()

        if (response.status !== "success") {
            showToast("Erro ao buscar areas","error")
            return
        }

        return response.data
    }

    const getAllInstallation = async (): Promise<TInstallationFormValues[] | undefined> => {
        const response = await InstallationApi.getAll<TInstallationFormValues[]>()

        if (response.status !== "success"){
            showToast(response.message, response.status)
            return
        }

        return response.data
    }

    useEffect(() => {
        getAllInstallation().then(i => setInstallations(i ?? []))
    }, []);

    useEffect(() => {
        getAllEmployees().then(c => setEmployees(c ?? []))
    }, []);

    useEffect(() => {
        getAllAreas().then(a => setAreas(a ?? []))
    }, []);

    useEffect(() => {
        if (installations) {
            setOptionsInstallations(installations.map(area => ({
                label: area.nome,
                value: area?.id_instalacao?.toString() ? area?.id_instalacao?.toString() : ""
            })))
        }
    }, [installations]);

    useEffect(() => {
        if (employees) {
            setOptionsEmployee(employees.map(employee => ({
                label: employee.name,
                value: employee?.id_funcionario?.toString() || ""
            })))
        }
    }, [employees]);

    useEffect(() => {
        setOptionsArea(areas.map(area => ({
            label: area.nome,
            value: area.id_area.toString()
        })))
    }, [areas]);

    const [filters, setFilters] = useState<FilterCriteria>({
        startDate: '',
        endDate: '',
        id_area: '',
        id_employee: '',
        id_installation: '',
    });

    useEffect(() => {
        setFilters(prevState => ({
            ...prevState,
            id_installation: selectedInstallation,
            id_employee: selectedEmployee,
            id_area: selectedArea,
        }));
    }, [selectedInstallation, selectedEmployee, selectedArea, setFilters]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(filters as any).toString();
        navigate(`/relatorio/reservas?${params}`);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen w-screen bg-base-200 p-8 z-[10010]">

            <div className="max-w-7xl mx-auto">
                <div onClick={() => navigate(-1)} className="btn btn-outline btn-sm">
                    <ArrowLeft className="w-4 h-4 mr-2"/>
                    Voltar
                </div>
                <div className="max-w-2xl mx-auto bg-base-100 rounded-box shadow-xl p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <Filter className="w-6 h-6"/>
                        <h1 className="text-2xl font-bold">Filtro de reservas</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Data inicial</span>
                                </label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={filters.startDate}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Data final</span>
                                </label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={filters.endDate}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <div className="form-control">
                                <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                                    Funcionário
                                </label>
                                <SelectSearchable
                                    options={optionsEmployee}
                                    value={selectedEmployee}
                                    onChange={setSelectedEmployee}
                                    className="w-full"
                                />
                            </div>

                            <div className="form-control">
                                <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                                    Área
                                </label>
                                <SelectSearchable
                                    options={optionsArea}
                                    value={selectedArea}
                                    onChange={setSelectedArea}
                                    className="w-full"
                                />
                            </div>

                            <div className="mb-4 md:col-span-2">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Nome da Instalação
                                </label>
                                <SelectSearchable
                                    options={optionsInstallations}
                                    value={selectedInstallation}
                                    onChange={setSelectedInstallation}
                                    className="w-full"
                                />
                            </div>

                        </div>

                        <div className="flex justify-end">
                            <button type="submit" className="btn btn-primary">
                                <Search className="w-4 h-4 mr-2"/>
                                Filtrar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}