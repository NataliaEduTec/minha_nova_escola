//import cityHall from '@/assets/prefeitura-img.png'
//import education from '@/assets/centro-educacional.png'
//import cpmModel from '@/assets/modelo-cpm.png'
import cityHall from '@/assets/logo-verde-minhanovaescola.png'
import Divider from "@/components/Divider";

export default function QuestionnaireHeader() {
    const classNameUnderscore = `flex-grow border-t-[2px] border-gray-800 opacity-60`

    return (
        <div className="">
            <div className="py-2 border border-gray-300">
                <div className="flex justify-center items-center px-1">
                    <div className="pt-2">
                        <img src={cityHall} alt="Logo Prefeitura Questionário"
                        style={{
                            width: '180px',
                            height: 'auto',

                        }}
                        />
                    </div>

                   {/* <div className="flex justify-between items-center">
                        <img src={education} alt="" className={`max-w-28`}/>
                        <img src={cpmModel} alt="" className={`max-w-28`}/>
                    </div>
                    */}

                </div>

                <Divider/>

                <h2 className={`text-center font-bold text-xl`}>CENTRO EDUCACIONAL JOSÉ DE ARAÚJO BATISTA - CEJAB</h2>
                <div className={`px-2`}>
                    <p className={`mb-2 w-full relative flex items-end`}>
                        <span>Componente Curricular:</span>
                        <span className={classNameUnderscore}></span>
                        <span> Professor (a):</span>
                        <span className={classNameUnderscore}></span>
                    </p>
                    <p className={`mb-2 w-full relative flex items-end`}>
                        Série/Ano: <span className={classNameUnderscore}></span>
                        Data: ___/____/____
                        <span className={classNameUnderscore}></span>unidade
                    </p>
                    <p className={`mb-2 w-full relative flex items-end`}>
                        Aluno (a): <span className={classNameUnderscore}></span>
                    </p>
                </div>
            </div>

            <div className={`my-4 py-6 border-l-8 border-t border-gray-800`}>
                <h2 className={`text-center font-medium text-xl`}>
                    1ª AVALIAÇÃO DIAGNÓSTICA DE MATEMÁTICA – 2025 9º ANO
                </h2>
            </div>

            <div className="p-2 border border-gray-300">
                <p>Caro(a) aluno(a),</p>
                <p>Sua participação nesta <strong>Avaliação Diagnóstica</strong>, é muito importante para avançarmos na qualidade da educação do nosso município.</p>
                <p>Responda com calma, procurando não deixar nenhuma questão em branco.</p>
                <p>Contamos com o seu esforço e dedicação!</p>
            </div>

            
        </div>
    );
}