import {HTMLAttributes, useEffect, useState} from "react";
import QuestionBank from "@/components/QuestionBank.tsx";
import Back from "@/components/General/Back";
import SelectSearchable, { SelectOption } from "@/components/Elements/Select/Searchable";
import { getIndicatorsBySeriesAndDiscipline } from "@/services/indicator";
import { getAllSeries, getDisciplinesBySeries } from "@/services/ExternalAPI/simples";

type Props = HTMLAttributes<HTMLDivElement>

export default function Page ({ style }: Props) {
    const [indicator, setIndicator] = useState<string>("");
    const [indicators, setIndicators] = useState<SelectOption[]>([]);

    const [series, setSeries] = useState<SelectOption[]>([]);
    const [selectedSeries, setSelectedSeries] = useState<string>("");
    
    const [disciplines, setDisciplines] = useState<SelectOption[]>([]);
    const [selectedDisciplines, setSelectedDisciplines] = useState<string>("");

    useEffect(() => {
        getAllSeries().then(series => {
            if (series.length) {
                const options = series.map(s => ({
                    label: s.sigla_curso,
                    value: s.id_curso.toString(),
                }))

                setSeries(options)
            }
        })
    }, []);

    useEffect(() => {
        setDisciplines([])
        if (!selectedSeries) return;

        getDisciplinesBySeries(selectedSeries).then(disciplines => {
            if (disciplines.length) {
                const options = disciplines.map(discipline => ({
                    label: discipline.descricao_disciplina,
                    value: discipline.id_disciplina.toString()
                }))

                setDisciplines(options)
            }
        })
    }, [selectedSeries])

    useEffect(() => {
        setIndicators([])
        if (!selectedSeries || !selectedDisciplines) return;

        getIndicatorsBySeriesAndDiscipline(selectedSeries, selectedDisciplines).then(indicators => {
            if (indicators?.length) {
                const options = indicators.map(indicator => ({
                    label: indicator.code,
                    value: indicator.id,
                }))

                setIndicators(options)
            }
        })
    }, [selectedSeries, selectedDisciplines])

    const [selectedIndicator, setSelectedIndicator] = useState<SelectOption[]>([]);
    const [selectedSeriesId, setSelectedSeriesId] = useState<SelectOption[]>([]);
    const [selectedDisciplinesId, setSelectedDisciplinesId] = useState<SelectOption[]>([]);

    useEffect(() => {
        setSelectedIndicator(indicators.filter(i => {
            return i.value === indicator
        }))
    }, [indicator, indicators])

    useEffect(() => {
        setSelectedSeriesId(series.filter(s => {
            return s.value === selectedSeries
        }))
    }, [selectedSeries, series])

    useEffect(() => {
        setSelectedDisciplinesId(disciplines.filter(d => {
            return d.value === selectedDisciplines
        }))
    }, [selectedDisciplines, disciplines])

    return (
        <main style={style} className={"w-full h-full flex justify-center items-center"}>
            <section className={"md:w-[98%] w-full max-w-screen-2xl max-h-[98vh] h-[95%] bg-white rounded-xl p-3 overflow-x-auto"}>
                <section className={`w-full flex justify-between flex-wrap`}>
                    <div><Back /></div>

                    <nav className={`w-full flex justify-center my-10`}>
                        <div className={`max-w-full w-4/5 grid md:grid-cols-2 gap-3 align-center justify-center`}>
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
                                ]} value={"1"} onChange={(v) => console.log(v)}/>
                            </div>
                        </div>
                    </nav>
                </section>
                <QuestionBank
                    indicator={indicator}
                    series={selectedSeries}
                    discipline={selectedDisciplines}
                    selectedIndicator={selectedIndicator}
                    selectedSeries={selectedSeriesId}
                    selectedDisciplines={selectedDisciplinesId} />
            </section>
        </main>
    )
}
