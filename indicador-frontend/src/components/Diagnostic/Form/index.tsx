import SelectSearchable, {SelectOption} from "@/components/Elements/Select/Searchable";
import {
    schoolYear
} from "@/lib/utils.ts";
import {useEffect, useMemo, useState} from "react";
import {
    getAllInstitutions,
    getClassBySchoolYearAndSeries, getDisciplinesBySeries,
    getSeriesByInstitution, getStudentsByClassAndSchoolYear
} from "@/services/ExternalAPI/simples.ts";
import {showToast} from "@/components/General/Notification";
import {getAllDiagnostics} from "@/services/diagnostics.ts";
import {TDiagnostic} from "@/components/Diagnostic/Form/schema.ts";
import {TExternalClasses, TExternalDisciplines} from "@/types/simples_externalAPI.ts";

type Props = {
    selectedDiagnostic: string;
    setSelectedDiagnostic: (diagnostic: string) => void;
    setDiagnostics: (diagnostics: TDiagnostic[]) => void;
    setClasses: (classes: TExternalClasses[]) => void;
    setSeriesName: (name: string) => void;
    setSelectedClass?: (classData: TExternalClasses | null) => void;
    setDisciplineNameSelected?: (discipline: TExternalDisciplines | null) => void;
};

export default function FormDiagnostic({selectedDiagnostic, setSelectedDiagnostic, setDiagnostics, setClasses, setSeriesName, setSelectedClass, setDisciplineNameSelected}: Props) {
    const [institutions, setInstitutionss] = useState<SelectOption[]>([]);
    const [selectedInstitution, setSelectedInstitution] = useState<string>("");

    const [series, setSeries] = useState<SelectOption[]>([]);
    const [selectedSeries, setSelectedSeries] = useState<string>("");

    const [classes, setClassesOptions] = useState<SelectOption[]>([]);
    const [selectedClasses, setSelectedClasses] = useState<string>("");

    useEffect(() => {
        if (setSelectedClass) {
            const classSelected = classes.find(c => c.value === selectedClasses);
            if (classSelected) {
                setSelectedClass({
                    id_turma: parseInt(classSelected.value),
                    descricao_turma: classSelected.label,
                    turno_turma: "",
                });
                return;
            }

            setSelectedClass(null);
        }
    }, [selectedClasses, classes, setSelectedClass]);

    const [disciplines, setDisciplines] = useState<SelectOption[]>([]);
    const [selectedDisciplines, setSelectedDisciplines] = useState<string>("");

    useEffect(() => {
        if (setDisciplineNameSelected) {
            const disciplineSelected = disciplines.find(d => d.value === selectedDisciplines);
            if (disciplineSelected) {
                setDisciplineNameSelected({
                    id_disciplina: parseInt(disciplineSelected.value),
                    descricao_disciplina: disciplineSelected.label,
                });
                return;
            }

            setDisciplineNameSelected(null);
        }
    }, [selectedDisciplines, disciplines, setDisciplineNameSelected]);

    const [selectedSchoolYear, setSelectedSchoolYear] = useState<string>("");
    const schoolYears = useMemo(() => {
        return schoolYear().map(year => ({
            label: year.toString(),
            value: year.toString()
        }));
    }, []);

    const [diagnostics, setDiagnosticsOptions] = useState<SelectOption[]>([]);

    useEffect(() => {
        getAllInstitutions().then(response => {
            if (response.type === "success") {
                const options = response.data.map(institution => ({
                    label: institution.nome_instituicao,
                    value: institution.id_instituicao.toString()
                }));
                setInstitutionss(options);
            } else {
                console.error(response.render);

                showToast(response.render, "error");
            }
        }).catch(error => {
            console.log(error)
        })
    }, [])

    useEffect(() => {
        setSeries([]);
        setSelectedSeries("")
        if (!selectedInstitution) {
            return
        }

        getSeriesByInstitution(selectedInstitution).then(response => {
            if (response.type === "success") {
                const options = response.data.map(data => ({
                    label: data.sigla_curso,
                    value: data.id_curso.toString()
                }));
                setSeries(options);
            } else {
                console.error(response.render);
                setSeries([])
                showToast(response.render, "error");
            }
        }).catch(error => {
            console.log(error)
        })
    }, [selectedInstitution])

    useEffect(() => {
        setClassesOptions([]);
        setClasses([]);
        setSelectedClasses("")
        if (!selectedSeries || !selectedSchoolYear || !selectedInstitution) {
            return
        }

        getClassBySchoolYearAndSeries(selectedSchoolYear, selectedSeries, selectedInstitution).then(response => {
            if (response.type === "success") {
                const options = response.data.map(data => ({
                    label: data.descricao_turma,
                    value: data.id_turma.toString()
                }));
                setClasses(response.data);
                setClassesOptions(options);
            } else {
                console.error(response.render);
                setClasses([]);
                setClassesOptions([])
                showToast(response.render, "error");
            }
        }).catch(error => {
            console.log(error)
        })
    }, [selectedSeries, selectedSchoolYear, selectedInstitution, setClasses])

    useEffect(() => {
        setDisciplines([]);
        setSelectedDisciplines("")
        if (!selectedSeries) {
            return
        }

        getDisciplinesBySeries(selectedSeries).then(disciplines => {
            if (disciplines.length) {
                const options = disciplines.map(data => ({
                    label: data.descricao_disciplina,
                    value: data.id_disciplina.toString()
                }));
                setDisciplines(options);
            }
        })
    }, [selectedSeries, setDisciplines])

    useEffect(() => {
        if (!selectedClasses || !selectedSchoolYear) {
            return
        }

        getStudentsByClassAndSchoolYear(selectedClasses, selectedSchoolYear).then(response => {
            if (response.type === "success") {
                // const users = response.data.map(data => ({
                //     name: data.nome_aluno,
                //     id: data.matricula_aluno
                // }));

            } else {
                console.error(response.render);
                showToast(response.render, "error");
            }
        }).catch(error => {
            console.log(error)
        })
    }, [selectedClasses, selectedSchoolYear])

    useEffect(() => {
        setDiagnosticsOptions([]);
        setDiagnostics([])
        if (!selectedInstitution || !selectedSchoolYear || !selectedSeries || !selectedDisciplines) {
            return;
        }

        const params = `?institution_id=${selectedInstitution}&school_year=${selectedSchoolYear}&series_id=${selectedSeries}&discipline_id=${selectedDisciplines}&class_id=${selectedClasses}`;

        getAllDiagnostics(params).then(diagnostics => {
            if (diagnostics.length) {
                const options = diagnostics.map(diagnostic => ({
                    label: diagnostic.name,
                    value: diagnostic.id
                }));

                setDiagnosticsOptions(options);
                setDiagnostics(diagnostics);
            }
        })

    }, [selectedInstitution, selectedSchoolYear, selectedSeries, selectedClasses, selectedDisciplines, setDiagnostics]);

    useEffect(() => {
        
        for (const serie of series) {
            if (serie.value === selectedSeries) {
                setSeriesName(serie.label);
                return
            }
        }
    }, [selectedSeries, series, setSeriesName]);

    return (
        <form
            className={`overflow-auto w-full bg-white min-w-60 rounded transition-all min-h-[32rem] h-auto print:hidden`}>
            <section className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-4`}>
                <div className={`col-span-2`}>
                    <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
                        Instituição
                    </label>
                    <SelectSearchable id={"institution"} options={institutions} value={selectedInstitution}
                                      onChange={setSelectedInstitution}/>
                </div>
                <div>
                    <label htmlFor="schoolYear" className="block text-sm font-medium text-gray-700">
                        Ano Letivo
                    </label>
                    <SelectSearchable id="schoolYear" options={schoolYears} value={selectedSchoolYear}
                                      onChange={setSelectedSchoolYear}/>
                </div>
                <div>
                    <label htmlFor="series" className="block text-sm font-medium text-gray-700">
                        Série
                    </label>
                    <SelectSearchable id="series" options={series} value={selectedSeries}
                                      onChange={setSelectedSeries}/>
                </div>
                <div>
                    <label htmlFor="classes" className="block text-sm font-medium text-gray-700">
                        Turma
                    </label>
                    <SelectSearchable id="classes" options={classes} value={selectedClasses}
                                      onChange={setSelectedClasses}/>

                </div>
                <div>
                    <label htmlFor="disciplines" className="block text-sm font-medium text-gray-700">
                        COMPONENTE/ÁREA
                    </label>
                    <SelectSearchable id="disciplines" options={disciplines} value={selectedDisciplines}
                                      onChange={setSelectedDisciplines}/>
                </div>

            </section>
            <section className={`grid-cols-1 md:grid-cols-2 gap-4 p-4 hidden`}>
                <div className={`col-span-2`}>
                    <label htmlFor="diagnostics" className="block text-sm font-medium text-gray-700">
                        Diagnósticos
                    </label>
                    <SelectSearchable id={"diagnostics"} options={diagnostics} value={selectedDiagnostic}
                                      onChange={setSelectedDiagnostic}/>
                </div>

            </section>
        </form>
    );
}