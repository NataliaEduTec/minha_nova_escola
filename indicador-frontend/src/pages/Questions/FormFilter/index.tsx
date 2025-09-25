import SelectSearchable, { SelectOption } from "@/components/Elements/Select/Searchable";
import { useState } from "react";

type Props = {
    indicator: string;
    selectedSeries: string;
    selectedDisciplines: string;
    series: SelectOption[];
    disciplines: SelectOption[];
    indicators: SelectOption[];
    institutions: SelectOption[];
    selectedInstitution: string;
    schoolYears: SelectOption[];
    selectedSchoolYear: string;
    classes: SelectOption[];
    selectedClasses: string;
    setIndicator: (value: string) => void;
    setSelectedSeries: (value: string) => void;
    setSelectedDisciplines: (value: string) => void;
    setSelectedInstitution: (value: string) => void;
    setSelectedSchoolYear: (value: string) => void;
    setSelectedClasses: (value: string) => void;
}

export default function FormFilter({
    selectedSeries, 
    selectedDisciplines, 
    indicator,
    series,
    disciplines,
    indicators,
    institutions,
    selectedInstitution,
    selectedSchoolYear,
    schoolYears,
    classes,
    selectedClasses,
    setIndicator, 
    setSelectedSeries, 
    setSelectedDisciplines,
    setSelectedInstitution,
    setSelectedSchoolYear,
    setSelectedClasses,
}: Props) {

    const [questionLevel, setQuestionLevel] = useState<string>("1")

    return (
        <section className={`w-full flex justify-between flex-wrap mb-8`}>

            <h1 className={`text-2xl font-bold text-center w-full mt-4`}>Filtros</h1>
            <nav className={`w-full flex justify-center my-10`}>
                <div className={`max-w-full w-4/5 grid md:grid-cols-2 gap-3 align-center justify-center`}>
                    <div className={`col-span-2`}>
                        <label htmlFor={`instituition`}>Instituição</label>
                        <SelectSearchable
                            id={`instituition`}
                            className={`min-w-[16rem_!important]`}
                            options={institutions}
                            value={selectedInstitution} 
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
                        <label htmlFor={`series`}>Series</label>
                        <SelectSearchable
                            id={`series`}
                            className={`min-w-[16rem_!important]`}
                            options={series}
                            value={selectedSeries} 
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
                        <label htmlFor={`series`}>Disciplinas</label>
                        <SelectSearchable
                            id={`series`}
                            className={`min-w-[16rem_!important]`}
                            options={disciplines}
                            value={selectedDisciplines} 
                            onChange={setSelectedDisciplines}/>
                    </div>
                    <div>
                        <label htmlFor={`indicator`}>Indicador</label>
                        <SelectSearchable
                            id={`indicator`}
                            className={`min-w-[16rem_!important]`}
                            options={indicators}
                            value={indicator} 
                            onChange={setIndicator}/>
                    </div>

                    <div>
                        <label htmlFor={`levelDifficulte`}>Nível de Dificuldade</label>
                        <SelectSearchable id={`levelDifficulte`} className={`min-w-[16rem_!important]`} options={[
                            {
                                label: "Fácil",
                                value: "0"
                            },
                            {
                                label: "Médio",
                                value: "1"
                            },
                            {
                                label: "Difícil",
                                value: "2"
                            },
                        ]} value={questionLevel} onChange={setQuestionLevel}/>
                    </div>
                </div>
            </nav>
        </section>
    )
}