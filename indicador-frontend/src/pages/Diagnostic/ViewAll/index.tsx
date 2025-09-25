import React, {useEffect, useState} from "react";
import Delete from "@/components/Modal/Delete";
import Search from "@/components/General/Search";
import useModal from "@/hooks/useModal";
import {toast, TypeOptions} from "react-toastify";
import ListDiagnostics from "@/components/Diagnostic/List";
import { createDiagnostic, deleteDiagnostic, getAllDiagnostics } from "@/services/diagnostics";
import { TDiagnostic } from "@/components/Diagnostic/Form/schema";
import { useNavigate } from "react-router-dom";
import Loading from "@/components/General/Loading";
import { getAllDisciplines, getAllInstitutions, getAllSeries } from "@/services/ExternalAPI/simples";
import { showToast } from "@/components/General/Notification";

type Props = React.HTMLAttributes<HTMLDivElement> & {
    handleModalRegisterEmployee?: () => void
}

export default function ViewAllDiagnostics ({ style }: Props) {
    const navigate = useNavigate();

    const {modalRef: modalDeleteRef, openModal: handleOpenModalDelete, closeModal: handleCloseModalDelete } = useModal();

    const [searchValue, setSearchValue] = useState<string>("")
    const [reload, setReload] = useState<boolean>(true)
    const [id, setId] = useState<string>("")
    const [diagnostics, setDiagnostics] = useState<TDiagnostic[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const setSeriesInstituitionsAndDisciplinesName = async (diagnostics: TDiagnostic[]) => {
        const [institutionsData, series, disciplines] = await Promise.all([
            getAllInstitutions(),
            getAllSeries(),
            getAllDisciplines()
        ]);

        const institutions = institutionsData.data || [];

        return diagnostics.map(diagnostic => {
            return {
                ...diagnostic,
                institutionName: institutions.find(i => i.id_instituicao.toString() === diagnostic.institution_id)?.nome_instituicao,
                seriesName: series.find(s => s.id_curso.toString() === diagnostic.series_id)?.sigla_curso,
                disciplineName: disciplines.find(d => d.id_disciplina.toString() === diagnostic.discipline_id)?.descricao_disciplina,
            };
        });
    }

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        setLoading(true)

        if (searchValue) {
            timeout = setTimeout(() => {
                getAllDiagnostics(`?name=${searchValue}`).then(async (i) => {
                    const mappedDiagnostics = await setSeriesInstituitionsAndDisciplinesName(i);
                    setDiagnostics(mappedDiagnostics ?? [])
                    setLoading(false)
                })
            }, 500);
        } else {
            getAllDiagnostics("").then(async (i) => {
                const mappedDiagnostics = await setSeriesInstituitionsAndDisciplinesName(i);
                setDiagnostics(mappedDiagnostics ?? [])
                setLoading(false)
            })
        }

        return () => clearTimeout(timeout);
    }, [searchValue, reload]);

    const deleteById = async (id: string): Promise<void> => {
        const idToast = toast.loading("Aguarde, por favor...")

        if (!id) {
            toast.update(idToast, {
                render: "Não foi possível encontrar o identificador",
                type: "error",
                isLoading: false,
                autoClose: 3000
            })
        }

        if (await deleteDiagnostic(id, idToast)){
            handleCloseModalDelete()
            setReload(!reload)
            setId("")
        }
    }

    const handleEdit = async (id: string) => {
        navigate(`/indicadores/diagnosticos?diagnosticId=${id}`)
    }

    const handleDelete = (id: string) => {
        setId(id)
        handleOpenModalDelete()
    }

    const handleDuplicate = async (id: string) => {
        const idToast = toast.loading("Duplicando, aguarde...")
        console.log(id)

        const diagnostic = diagnostics.filter(d => d.id === id)[0]

        diagnostic.diagnostic_student = [
            {
                id: "",
                diagnostic_id: "",
                student_id: "1",
                tabulated: false,
                a_e_e: "",
                questions: [],
            }
        ]
        diagnostic.user = undefined
        console.log(diagnostic)

        const data = {
            ...diagnostic,
            class_id: diagnostic.class_id?.toString(),
            discipline_id:  diagnostic.discipline_id?.toString(),
            schoolYear:  diagnostic.schoolYear?.toString(),
            institution_id:  diagnostic.institution_id?.toString(),
            series_id:  diagnostic.series_id?.toString(),
            questionnaire: diagnostic.diagnostic_questionnaire
        }

        const result = await createDiagnostic(data)
        console.log(result)

        toast.update(idToast, {
            render: result.render,
            type: result.type as TypeOptions,
            isLoading: false,
            autoClose: 3000
        })

        
        if (result.type === "success" && result?.data) {
            const newDiagnosticId = result?.data.id

            showToast("Redirecionando...", "info")

            setTimeout(() => handleEdit(newDiagnosticId), 3000)
            return
        }
    }

    return (
        <main style={style} className={"w-full h-full flex justify-center items-center"}>
            <Delete ref={modalDeleteRef} onDelete={() => deleteById(id)} onClick={handleCloseModalDelete} />

            <section className={"w-full max-w-screen-xl max-h-[98vh] h-[95%] bg-white rounded-xl p-3 overflow-x-auto"}>
                <Search
                    onChange={(e) => setSearchValue(e.target.value)}
                />

                {loading ? (
                    <Loading />
                ) : (
                    <ListDiagnostics
                        items={diagnostics}
                        onEdit={(id) => handleEdit(id as string)}
                        onDuplicate={(id) => handleDuplicate(id as string)} 
                        onDelete={(id) => handleDelete(id as string)} />
                )}

            </section>
        </main>
    )
}
