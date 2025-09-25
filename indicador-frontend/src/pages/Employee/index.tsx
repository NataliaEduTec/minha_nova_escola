import React, {useEffect, useState} from "react";
import List from "../../components/Employee/List";
import Form from "../../components/Employee/Form";
import Modal from "../../components/Modal";
import Delete from "../../components/Modal/Delete";
import Search from "../../components/General/Search";
import useModal from "../../hooks/useModal";
import EmployeeApi, {TEmployeeFormValues} from "../../services/employee.ts";
import {showToast} from "../../components/General/Notification";
import {toast} from "react-toastify";
import {defaultValues} from "../../components/Employee/Form/schema";

type Props = React.HTMLAttributes<HTMLDivElement> & {
    handleModalRegisterEmployee?: () => void
}

export default function Employee ({ style }: Props) {
    const {modalRef, openModal: handleOpenModal, closeModal: handleCloseModal } = useModal();
    const {modalRef: modalDeleteRef, openModal: handleOpenModalDelete, closeModal: handleCloseModalDelete } = useModal();

    const [searchValue, setSearchValue] = useState<string>("")
    const [reload, setReload] = useState<boolean>(true)
    const [idCategory, setID] = useState<number>(0)
    const [employees, setEmployees] = useState<TEmployeeFormValues[]>([])
    const [isLoadingForm, setIsLoadingForm] = useState<boolean>(false)
    const [employee, setEmployee] = useState<TEmployeeFormValues>(defaultValues)

    useEffect(() => {
        console.log(searchValue)
    }, [searchValue]);

    useEffect(() => {
        getAll().then(c => setEmployees(c ?? []))
    }, [reload]);
    
    useEffect(() => {
        console.log(employees)
    }, [employees]);

    const getAll = async (): Promise<TEmployeeFormValues[] | undefined> => {
        const response = await EmployeeApi.getAll<TEmployeeFormValues[]>()

        console.log(response)

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

        const response = await EmployeeApi.deleteById(id)

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

        const response = await EmployeeApi.getUnique<TEmployeeFormValues>(id)
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

            <Modal ref={modalRef} dialogClassName={"max-w-3xl"}>
                <Form
                    onClick={() => {
                        setIsLoadingForm(false)
                        handleCloseModal()
                    }}

                    handleCloseModal={handleCloseModal}

                    idEmployee={idCategory}

                    loading={isLoadingForm}
                    reload={() => setReload(!reload)}
                    employee={employee}
                />
            </Modal>

            <Delete ref={modalDeleteRef} onDelete={() => deleteById(idCategory)} onClick={handleCloseModalDelete} />

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
                    items={employees}
                    onEdit={(id) => handleEdit(id as number)}
                    onDelete={(id) => handleDelete(id as number)} />
            </section>
        </main>
    )
}
