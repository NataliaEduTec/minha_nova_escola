import Input from "../../Elements/Input";
import SelectItemWithValue, {SelectedItem} from "../../Elements/Select/WithValue";
import {useCallback, useEffect, useState} from "react";
import SelectSearchable, {SelectOption} from "../../Elements/Select/Searchable";
import InstallationApi, {TInstallationFormValues} from "../../../services/installations.ts";
import {showToast} from "../../General/Notification";
import {SubmitHandler, useForm} from "react-hook-form";
import {defaultValues, FormData, schema} from "./schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "react-toastify";
import {TCategoriesFormValues} from "../../../services/categories.ts";
import {TAreasFormValuesPT} from "../../../services/areas.ts";
import ReservationsApi, {TReservationsFormValues} from "../../../services/reservations.ts";
import EmployeeApi, {TEquipmentFormValues} from "../../../services/equipment.ts";
import TextAreaControlled from "../../Elements/Textarea/Controlled";
import Loading from "../../General/Loading";

type Props = React.FormHTMLAttributes<HTMLElement>& {
    loading?: boolean
    reservation?: TReservationsFormValues
    idReservation?: number
    handleCloseModal: () => void
    categories?: TCategoriesFormValues[]
    areas?: TAreasFormValuesPT[]
    reset?: boolean
    reloadReservations?: boolean
    setReloadReservations: (v: boolean) => void
    permission: boolean
    setPermission: (v: boolean) => void
}

export default function FormResevations ({
    loading,
    reservation,
    idReservation,
    handleCloseModal,
    reset,
    reloadReservations,
    setReloadReservations,
    permission,
    setPermission
}: Props) {

    const [optionsInstallations, setOptionsInstallations] = useState<SelectOption[]>([])
    const [selectedInstallation, setSelectedInstallation] = useState('');
    const [installations, setInstallations] = useState<TInstallationFormValues[]>([])
    const [equipments, setEquipments] = useState<TEquipmentFormValues[]>([])
    const [equipmentsOption, setEquipamentsOption] = useState([
        { id: 1, name: 'Microfone', },
    ])
    const [selectedEquipaments, setSelectedEquipaments] = useState<SelectedItem[]>([]);
    const [dateReservation, setDateReservation] = useState<string>("");
    const [initialTimeReservation, setInitialTimeReservation] = useState<string>("");
    const [finalTimeReservation, setFinalTimeReservation] = useState<string>("");
    const [employeeName, setEmployeeName] = useState<string>("");

    const { handleSubmit, formState: { errors }, control, setValue } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            ...defaultValues,
            id_reserva: 0,
        },
        mode: "onChange",
    });

    useEffect(() => {
        getAllInstallation().then(i => setInstallations(i ?? []))
    }, []);

    useEffect(() => {
        getAllEquipments().then(i => setEquipments(i ?? []))
    }, []);

    useEffect(() => {
        setEquipamentsOption(equipments.map(e => ({
            id: e.id_equipamento || 0,
            name: e.nome
        })))
    }, [equipments]);

    useEffect(() => {
        setValue("id_instalacao", parseInt(selectedInstallation))
    }, [selectedInstallation, setValue]);

    useEffect(() => {
        setValue("inicio_reserva", `${dateReservation}T${initialTimeReservation}`)
    }, [dateReservation, initialTimeReservation, setValue]);

    useEffect(() => {
        setValue("termino_reserva", `${dateReservation}T${finalTimeReservation}`)
    }, [dateReservation, finalTimeReservation, setValue]);

    useEffect(() => {
        setValue("equipamentos", selectedEquipaments.map(e => ({
            id_equipamento: e.id,
            quantidade: parseInt(e.value)
        })))
    }, [selectedEquipaments, setValue]);

    useEffect(() => {
        if (!idReservation) {
            setEmployeeName("")
        }
    }, [idReservation])

    useEffect(() => {
        if (reservation) {

            const equipmentsSelected = equipments
                .map(e => {
                    if (reservation.reserva_equipamentos?.some(r => r.equipamento_id_equipamento === e.id_equipamento))
                        return {
                            ...e,
                            ...reservation.reserva_equipamentos[reservation.reserva_equipamentos?.findIndex(r => r.equipamento_id_equipamento === e.id_equipamento)]
                        }
                    return {...e}
                }).filter(e => reservation.reserva_equipamentos?.some(r => r.equipamento_id_equipamento === e.id_equipamento))
                .map(e => ({
                    id: e.id_equipamento || 0,
                    name: e.nome,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    value: e?.quantidade || ""
                }))

            const funcao = localStorage.getItem("funcao_app")

            if (funcao !== "Admin")
                setPermission(localStorage.getItem("id_funcionario_app") !== String(reservation.funcionario?.id_funcionario))

            setSelectedEquipaments(equipmentsSelected)
            setSelectedInstallation(reservation?.instalacao_id_instalacao?.toString() || "")

            setDateReservation(reservation?.inicio_reserva?.split(" ")[0])
            setInitialTimeReservation(reservation?.inicio_reserva?.split(" ")[1] + "Z")
            setFinalTimeReservation(reservation?.termino_reserva?.split(" ")[1] + "Z")
            setValue("descricao", reservation?.descricao || "")
            setEmployeeName(reservation?.funcionario?.name || "")
        }
    }, [equipments, reservation, setEmployeeName, setSelectedEquipaments, setSelectedInstallation, setDateReservation, setInitialTimeReservation, setFinalTimeReservation])

    const handleReset = useCallback(() => {
        setValue("descricao", "")
        setSelectedInstallation("")
        setDateReservation("")
        setInitialTimeReservation("")
        setFinalTimeReservation("")
        setSelectedEquipaments([])
    }, [setValue, setSelectedInstallation, setDateReservation, setInitialTimeReservation, setFinalTimeReservation, setSelectedEquipaments])

    useEffect(() => {
        handleReset()
    }, [reset, handleReset])

    const getAllInstallation = async (): Promise<TInstallationFormValues[] | undefined> => {
        const response = await InstallationApi.getAll<TInstallationFormValues[]>()

        if (response.status !== "success"){
            showToast(response.message, response.status)
            return
        }

        return response.data
    }

    const getAllEquipments = async (): Promise<TEquipmentFormValues[] | undefined> => {
        const response = await EmployeeApi.getAll<TEquipmentFormValues[]>()

        if (response.status !== "success"){
            showToast(response.message, response.status)
            return
        }

        return response.data
    }

    useEffect(() => {
        if (installations) {
            setOptionsInstallations(installations.map(area => ({
                label: area.nome,
                value: area?.id_instalacao?.toString() ? area?.id_instalacao?.toString() : ""
            })))
        }
    }, [installations]);

    const onSubmit: SubmitHandler<TReservationsFormValues> = async (data) => {
        if (idReservation){
            await update(idReservation, data)
            return
        }
        await register(data)
    }

    const update = async (id: number, data: TReservationsFormValues) => {
        const toastId = toast.loading("Aguarde, por favor...")

        if (data.descricao === "") data.descricao = null

        try {
            const response = await ReservationsApi.update(id, data)

            toast.update(toastId, {
                render: response.message,
                type: response.status,
                autoClose: 3000,
                isLoading: false,
            })

            if (response.status === "success") {
                setReloadReservations(!reloadReservations)
                handleReset()
                handleCloseModal()
            }
        } catch (e) {
            console.error(e)

            toast.update(toastId, {
                render: "Houver um erro interno",
                type: "error",
                autoClose: 3000,
                isLoading: false,
            })
        }
    }

    const register = async (data: TReservationsFormValues) => {

        const toastId = toast.loading("Aguarde, por favor...")

        if (data.descricao === "") data.descricao = null

        try {
            const response = await ReservationsApi.create(data)

            toast.update(toastId, {
                render: response.message,
                type: response.status,
                autoClose: 3000,
                isLoading: false,
            })

            if (response.status === "success") {
                setReloadReservations(!reloadReservations)
                handleReset()
            }
        } catch (e) {
            console.error(e)

            toast.update(toastId, {
                render: "Houver um erro interno",
                type: "error",
                autoClose: 3000,
                isLoading: false,
            })
        }
    }

    if(loading)
        return (
            <Loading />
        )

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-lg font-bold mb-4">Reservas {employeeName ? " - " + employeeName : ""}</h2>
            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nome da Instalação
                </label>
                <SelectSearchable
                    options={optionsInstallations}
                    value={selectedInstallation}
                    onChange={setSelectedInstallation}
                    className="w-full"
                />
                {errors.id_instalacao && <p className="text-red-500">{errors.id_instalacao.message}</p>}
            </div>

            <p className={`text-[--color-red-dark-light] text-center mt-5 mb-3`}>* Prazo máximo de reserva 15 dias *</p>

            <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Data da reserva
                </label>

                <Input
                    disabled={permission}
                    type="date"
                    id="date"
                    name="date"
                    value={dateReservation || ""}
                    onChange={(e) => setDateReservation(e.target.value)}
                    className="input w-full input-bordered"
                />
                {!dateReservation && errors.inicio_reserva && <p className="text-red-500">{errors.inicio_reserva.message}</p>}
            </div>
            <div className={"grid grid-cols-2 gap-2"}>
                <div className="mb-4">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Hora inicial
                    </label>
                    <Input
                        disabled={permission}
                        type="time"
                        id="hour_initial"
                        name="hour_initial"
                        value={initialTimeReservation?.replace("Z", "") || ""}
                        onChange={(e) => setInitialTimeReservation(e.target.value + ":00Z")}
                        className="input w-full input-bordered "
                    />
                    {!initialTimeReservation && errors.inicio_reserva && <p className="text-red-500">{errors.inicio_reserva.message}</p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Hora final
                    </label>
                    <Input
                        disabled={permission}
                        type="time"
                        id="hour_final"
                        name="hour_final"
                        value={finalTimeReservation?.replace("Z", "") || ""}
                        onChange={(e) => setFinalTimeReservation(e.target.value + ":00Z")}
                        className="input w-full input-bordered "
                    />
                    {!finalTimeReservation && errors.termino_reserva && <p className="text-red-500">{errors.termino_reserva.message}</p>}
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Descrição
                </label>
                <TextAreaControlled control={control} disabled={permission} name={"descricao"} />
                {errors.descricao && <p className="text-red-500">{errors.descricao.message}</p>}
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                    Equipamentos (opcional)
                </label>

                <SelectItemWithValue
                    items={equipmentsOption}
                    selectedItems={selectedEquipaments}
                    setSelectedItems={setSelectedEquipaments}
                />
                {errors.equipamentos && <p className="text-red-500">{errors.equipamentos.message}</p>}
            </div>

            <div>

            </div>

            <div className="flex justify-end space-x-4 mt-4">
                <button
                    type="button"
                    onClick={() => handleCloseModal()}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500"
                >
                    Cancelar
                </button>

                {!permission && (
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                    >
                        Enviar
                    </button>
                )}

            </div>
        </form>
    );
}