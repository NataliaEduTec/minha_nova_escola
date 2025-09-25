import React, {useEffect, useState} from "react";
import List from "../../components/Entities/Area/List";
import Form from "../../components/Entities/Area/Form";
import Modal from "../../components/Modal";
import Delete from "../../components/Modal/Delete";
import Search from "../../components/General/Search";
import useModal from "../../hooks/useModal";
import AreasApi, {TAreasFormValues, TAreasFormValuesPT} from "../../services/areas.ts";
import {showToast} from "../../components/General/Notification";
import {toast} from "react-toastify";
import {defaultColorPicker} from "../../components/General/ColorPicker";

type Props = React.HTMLAttributes<HTMLDivElement>

export default function Area ({ style }: Props) {
    const {modalRef, openModal: handleOpenModal, closeModal: handleCloseModal } = useModal();
    const {modalRef: modalDeleteRef, openModal: handleOpenModalDelete, closeModal: handleCloseModalDelete } = useModal();

    const [searchValue, setSearchValue] = useState<string>("")
    const [reloadAreas, setReloadAreas] = useState<boolean>(true)
    const [idArea, setIDArea] = useState<number>(0)
    const [areas, setAreas] = useState<TAreasFormValues[]>([])
    const [isLoadingForm, setIsLoadingForm] = useState<boolean>(false)
    const [area, setArea] = useState<TAreasFormValues>({color: defaultColorPicker, description: null, id: 0, name: ""})


    useEffect(() => {
        console.log(searchValue)
    }, [searchValue]);

    useEffect(() => {
        getAll().then(a => setAreas(a ?? []))
    }, [reloadAreas]);

    const getAll = async (): Promise<TAreasFormValues[] | undefined> => {
        const response = await AreasApi.getAll<TAreasFormValuesPT[]>()

        if (response.status !== "success"){
            showToast(response.message, response.status)
            return
        }

        return response.data.map(area => ({
            id: area.id_area,
            name: area.nome,
            color: area.cor,
            description: area.descricao,
        }))
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

        const response = await AreasApi.deleteById(id)

        toast.update(idToast, {
            render: response.message,
            type: response.status,
            isLoading: false,
            autoClose: 3000
        })

        if (response.status === "success"){
            handleCloseModalDelete()
            setReloadAreas(!reloadAreas)
            setIDArea(0)
        }
    }

    const handleEdit = async (id: number) => {
        setIsLoadingForm(true)
        handleOpenModal()
        setIDArea(id)

        const response = await AreasApi.getUnique<TAreasFormValuesPT>(id)
        setIsLoadingForm(false)

        if (response.status !== "success"){
            showToast(response.message, response.status)
            handleCloseModal()
            return
        }

        const area = response.data

        setArea({
            id: area.id_area,
            name: area.nome,
            color: area.cor,
            description: area.descricao,
        })
    }

    return (
        <main style={style} className={"w-full h-full flex justify-center items-center"}>

            <Modal ref={modalRef} dialogClassName={"max-w-3xl"}>
                <Form
                    onClick={() => {
                        setIsLoadingForm(false)
                        handleCloseModal()
                    }}
                    idArea={idArea}

                    loading={isLoadingForm}
                    reload={() => setReloadAreas(!reloadAreas)}
                    area={area}
                />
            </Modal>

            <Delete
                ref={modalDeleteRef}

                onDelete={() => deleteById(idArea)}

                onClick={() => {
                    setIDArea(0)
                    handleCloseModalDelete()
                }}
            />

            <section className={"w-full max-w-screen-xl max-h-[98vh] h-[95%] bg-white rounded-xl p-3 overflow-x-auto"}>
                <Search
                    handleOpenModalRegister={() => {
                        setArea({color: defaultColorPicker, description: null, id: 0, name: ""})
                        setIDArea(0)
                        handleOpenModal()
                        setIsLoadingForm(false)
                    }}
                    onChange={(e) => setSearchValue(e.target.value)}
                />

                <List
                    areas={areas}
                    onEdit={(id) => handleEdit(id as number)}
                    onDelete={(id) => {
                        setIDArea(id as number)
                        handleOpenModalDelete()
                    }} />
            </section>
        </main>
    )
}
