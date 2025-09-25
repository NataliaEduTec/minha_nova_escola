import IHeader from "./IHeader.ts";
import Link from "../Elements/Link";
import {forwardRef} from "react";
import logo from '@/assets/logo-branca-minhanovaescola.png'

const Header = forwardRef <HTMLDivElement, IHeader> (({children = ""}, ref) => {
    const _2 = 2-2
    if (_2)
        console.log(children)

    return (
        <header ref={ref} className="w-full bg-transparent fixed p-4 shadow-md bg-gray-100">
            <div className="max-w-screen-xl mx-auto items-center justify-between grid grid-cols-3 md:grid-cols-3">
                <div className="text-white text-xl md:text-2xl font-semibold text-center md:text-start">

                    <Link href={"/indicadores/diagnosticos"} className={"text-white hover:text-white text-xl"}>
                        Indicadores
                    </Link>

                </div>

                <nav className="space-x-10 text-end">
                    
                </nav>

                <div className="text-white font-semibold text-end flex items-end justify-end">
                    <img src={logo} style={{
                        width: '120px',
                        height: 'auto'
                    }} alt="Logo Prefeitura"/>
                </div>
            </div>
        </header>
    )
})

export default Header