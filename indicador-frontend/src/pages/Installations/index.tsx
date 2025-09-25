import React, {useEffect, useState} from "react";
import List from "../../components/Entities/Installations/List";
import Form from "../../components/Entities/Installations/Form";
import Modal from "../../components/Modal";
import Delete from "../../components/Modal/Delete";
import Search from "../../components/General/Search";
import useModal from "../../hooks/useModal";
import {defaultValues} from "../../components/Entities/Installations/Form/schema";
import CategoriesApi, {TCategoriesFormValues} from "../../services/categories.ts";
import {showToast} from "../../components/General/Notification";
import {toast} from "react-toastify";
import InstallationApi, {TInstallationFormValues} from "../../services/installations.ts";
import AreasApi, {TAreasFormValuesPT} from "../../services/areas.ts";

type Props = React.HTMLAttributes<HTMLDivElement> & {
    handleModalRegisterEmployee?: () => void
}

export default function Installations ({ style }: Props) {
    const {modalRef, openModal: handleOpenModal, closeModal: handleCloseModal } = useModal();
    const {modalRef: modalDeleteRef, openModal: handleOpenModalDelete, closeModal: handleCloseModalDelete } = useModal();

    const [searchValue, setSearchValue] = useState<string>("")
    const [reload, setReload] = useState<boolean>(true)
    const [idInstallation, setID] = useState<number>(0)
    const [installations, setInstallation] = useState<TInstallationFormValues[]>([])
    const [isLoadingForm, setIsLoadingForm] = useState<boolean>(false)
    const [employee, setEmployee] = useState<TInstallationFormValues>(defaultValues)
    const [categories, setCategories] = useState<TCategoriesFormValues[]>([])
    const [areas, setAreas] = useState<TAreasFormValuesPT[]>([])

    useEffect(() => {
        console.log(searchValue)
    }, [searchValue]);

    useEffect(() => {
        getAll().then(i => setInstallation(i ?? []))
    }, [reload]);

    useEffect(() => {
        getAllCategories().then(c => setCategories(c ?? []))
    }, []);

    useEffect(() => {
        getAllAreas().then(a => setAreas(a ?? []))
    }, []);

    const getAllCategories = async (): Promise<TCategoriesFormValues[] | undefined> => {
        const response = await CategoriesApi.getAll<TCategoriesFormValues[]>()

        if (response.status !== "success"){
            showToast("Erro ao buscar areas","error")
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

    const getAll = async (): Promise<TInstallationFormValues[] | undefined> => {
        const response = await InstallationApi.getAll<TInstallationFormValues[]>()

        if (response.status !== "success"){
            showToast(response.message, response.status)
            return
        }

        return response.data
    }

    const deleteById = async (id: number): Promise<void> => {
        const idToast = toast.loading("Aguarde, por favor...")

        if (!id) {
            toast.update(idToast, {
                render: "Não foi possível encontrar o identificador",
                type: "error",
                isLoading: false,
                autoClose: 3000
            })
        }

        const response = await InstallationApi.deleteById(id)

        toast.update(idToast, {
            render: response.message,
            type: response.status,
            isLoading: false,
            autoClose: 3000
        })

        if (response.status === "success"){
            handleCloseModalDelete()
            setReload(!reload)
            setID(0)
        }
    }

    const handleEdit = async (id: number) => {
        setIsLoadingForm(true)
        handleOpenModal()
        setID(id)

        const response = await InstallationApi.getUnique<TInstallationFormValues>(id)
        setIsLoadingForm(false)

        if (response.status !== "success"){
            showToast(response.message, response.status)
            handleCloseModal()
            return
        }

        setEmployee(response.data)
    }

    const handleDelete = (id: number) => {
        setID(id)
        handleOpenModalDelete()
    }

    return (
        <main style={style} className={"w-full h-full flex justify-center items-center"}>

            <Modal ref={modalRef} dialogClassName={"max-w-3xl h-full md:max-h-[70%]"}>
                <Form
                    onClick={() => {
                        setIsLoadingForm(false)
                        handleCloseModal()
                    }}

                    handleCloseModal={handleCloseModal}

                    idInstalation={idInstallation}

                    loading={isLoadingForm}
                    reload={() => setReload(!reload)}
                    installation={employee}
                    categories={categories}
                    areas={areas}
                />
            </Modal>

            <Delete ref={modalDeleteRef} onDelete={() => deleteById(idInstallation)} onClick={handleCloseModalDelete} />

            <section className={"w-full max-w-screen-xl max-h-[98vh] h-[95%] bg-white rounded-xl p-3 overflow-x-auto"}>
                <Search
                    handleOpenModalRegister={() => {
                        setEmployee(defaultValues)
                        setID(0)
                        handleOpenModal()
                        setIsLoadingForm(false)
                    }}
                    onChange={(e) => setSearchValue(e.target.value)}
                />

                <List
                    items={installations}
                    onEdit={(id) => handleEdit(id as number)}
                    onDelete={(id) => handleDelete(id as number)} />
            </section>
        </main>
    )
}
