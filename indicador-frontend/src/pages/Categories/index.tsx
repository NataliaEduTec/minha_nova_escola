import React, {useEffect, useState} from "react";
import List from "../../components/Entities/Categories/List";
import Form from "../../components/Entities/Categories/Form";
import Modal from "../../components/Modal";
import Delete from "../../components/Modal/Delete";
import Search from "../../components/General/Search";
import useModal from "../../hooks/useModal";
import {showToast} from "../../components/General/Notification";
import {toast} from "react-toastify";
import CategoriesApi, {TCategoriesFormValues} from "../../services/categories.ts";

type Props = React.HTMLAttributes<HTMLDivElement>

export default function Categories ({ style }: Props) {
    const {modalRef, openModal: handleOpenModal, closeModal: handleCloseModal } = useModal();
    const {modalRef: modalDeleteRef, openModal: handleOpenModalDelete, closeModal: handleCloseModalDelete } = useModal();

    const [searchValue, setSearchValue] = useState<string>("")
    const [reload, setReload] = useState<boolean>(true)
    const [idCategory, setID] = useState<number>(0)
    const [categories, setCategories] = useState<TCategoriesFormValues[]>([])
    const [isLoadingForm, setIsLoadingForm] = useState<boolean>(false)
    const [category, setCategory] = useState<TCategoriesFormValues>({id_categoria: 0, nome: ""})

    useEffect(() => {
        console.log(searchValue)
    }, [searchValue]);

    useEffect(() => {
        getAll().then(c => setCategories(c ?? []))
    }, [reload]);

    const getAll = async (): Promise<TCategoriesFormValues[] | undefined> => {
        const response = await CategoriesApi.getAll<TCategoriesFormValues[]>()

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

        const response = await CategoriesApi.deleteById(id)

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

        const response = await CategoriesApi.getUnique<TCategoriesFormValues>(id)
        setIsLoadingForm(false)

        if (response.status !== "success"){
            showToast(response.message, response.status)
            handleCloseModal()
            return
        }

        setCategory(response.data)
    }

    return (
        <main style={style} className={"w-full h-full flex justify-center items-center"}>

            <Modal ref={modalRef} dialogClassName={"max-w-xl"}>
                <Form
                      onClick={() => {
                          setIsLoadingForm(false)
                          handleCloseModal()
                      }}
                      idCategory={idCategory}

                      loading={isLoadingForm}
                      reload={() => setReload(!reload)}
                      category={category}
                />
            </Modal>

            <Delete ref={modalDeleteRef} onDelete={() => deleteById(idCategory)} onClick={handleCloseModalDelete} />

            <section className={"w-full max-w-screen-xl max-h-[98vh] h-[95%] bg-white rounded-xl p-3 overflow-x-auto"}>
                <Search
                    handleOpenModalRegister={() => {
                        setCategory({id_categoria: 0, nome: ""})
                        setID(0)
                        handleOpenModal()
                        setIsLoadingForm(false)
                    }}
                    onChange={(e) => setSearchValue(e.target.value)}
                />

                <List
                    items={categories}
                    onEdit={(id) => handleEdit(id as number)}
                    onDelete={(id) => {
                        setID(id as number)
                        handleOpenModalDelete()
                    }} />
            </section>
        </main>
    )
}
