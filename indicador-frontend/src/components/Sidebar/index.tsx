import ISidebar from "./ISidebar.ts";
import Button from "../Elements/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBars } from '@fortawesome/free-solid-svg-icons';
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import LoginApi from "../../services/auth.ts";
import {toast} from "react-toastify";

interface MenuName {
    [key: string]: boolean
}

export default function Sidebar ({ employer = "Menu", style }: ISidebar) {

    const navigate = useNavigate();

    const [IsVisibility, setIsVisibility] = useState<boolean>(false)
    const [openMenus, setOpenMenus] = useState<MenuName>({
        admin: false,
        reservas: false,
        relatorio: false,
    });

    const classContainerLink = `hover:bg-gray-300 flex items-center w-full leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900`

    const toggleSubmenu = (menuName: string) => {
        setOpenMenus((prevState: MenuName) => {
            for (const menu in prevState) {
                if (menu === menuName) continue;
                prevState[menu] = false
            }

            return {
                ...prevState,
                [menuName]: !prevState[menuName],
            }
        });
    };

    const handleLogout = async () => {
        const toastId = toast.loading("Aguarde, por favor...")

        try {
            const response = await LoginApi.logout()

            toast.update(toastId, {
                render: response.message,
                type: response.status,
                autoClose: 3000,
                isLoading: false,
            })

            if (response.status === "success") {
                localStorage.removeItem("funcao_app")
                localStorage.removeItem("id_funcionario_app")
                navigate("/login")
            }
        } catch (e) {
            console.error(e)

            toast.update(toastId, {
                render: "Houver um erro interno",
                type: "error",
                autoClose: 3000,
                isLoading: false,
            })
        }
    }

    return (
        <>
            <Button
                style={{
                    top: 12
                }}

                onClick={() => setIsVisibility(true)}

                className={"max-h-8 left-0 fixed text-white bg-[var(--principal-color)] border-white px-4 py-1.5 hover:bg-white hover:text-[var(--principal-color)]"}>
                <FontAwesomeIcon icon={faBars} className={"text-inherit text-xl hover:text-[var(--principal-color)]"}/>
            </Button>

            <div
                style={{
                    ...style,
                    top: 0,
                }}
                className={`
                fixed left-0 z-50 bottom-0 flex w-full max-w-[20rem] flex-col -rounded-tr-xl -rounded-br-xl 
                bg-white bg-clip-border p-4 text-gray-700 shadow-xl shadow-blue-gray-900
                overflow-y-auto
                transform transition-transform duration-300 ease-in-out 
                ${IsVisibility ? "translate-x-0" : "-translate-x-full"}
                `}>
                <div className="p-4 mb-2">
                    <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                        {employer}
                    </h5>
                </div>
                <div className={"absolute right-5 top-8"}>
                    <Button
                        onClick={() => setIsVisibility(false)}

                        className={"text-[var(--color-red)] hover:bg-[var(--color-red)] border-[var(--color-red)]"}>
                        <FontAwesomeIcon icon={faXmark} className={"text-inherit text-xl hover:text-white"}/>
                    </Button>
                </div>
                <nav
                    className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
                        <div className="relative block w-full">
                        <div role="button"
                             className="flex items-center w-full p-0 leading-tight transition-all rounded-lg outline-none bg-blue-gray-50/50 text-start text-blue-gray-700 hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
                            <button type="button" onClick={() => toggleSubmenu("admin")}
                                    className="flex items-center justify-between w-full p-3 font-sans text-xl antialiased font-semibold leading-snug text-left transition-colors border-b-0 select-none border-b-blue-gray-100 text-blue-gray-900 hover:text-blue-gray-900">
                                <div className="grid mr-4 place-items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                         aria-hidden="true"
                                         className="w-5 h-5">
                                        <path fillRule="evenodd"
                                              d="M2.25 2.25a.75.75 0 000 1.5H3v10.5a3 3 0 003 3h1.21l-1.172 3.513a.75.75 0 001.424.474l.329-.987h8.418l.33.987a.75.75 0 001.422-.474l-1.17-3.513H18a3 3 0 003-3V3.75h.75a.75.75 0 000-1.5H2.25zm6.04 16.5l.5-1.5h6.42l.5 1.5H8.29zm7.46-12a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6zm-3 2.25a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0V9zm-3 2.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5z"
                                              clipRule="evenodd"></path>
                                    </svg>
                                </div>
                                <p className="block mr-auto font-sans text-base antialiased font-normal leading-relaxed text-blue-gray-900">
                                    Administrativo
                                </p>
                                <span
                                    className={`ml-4 transition-transform duration-300 ease-in-out  ${openMenus["admin"] ? "rotate-180" : ""}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="2.5"
                                         stroke="currentColor" aria-hidden="true"
                                         className="w-4 h-4 mx-auto transition-transform">
                                      <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path>
                                    </svg>
                                </span>
                            </button>
                        </div>
                        <div className={`overflow-hidden transition-transform duration-300 ease-in-out ${
                            openMenus["admin"] ? "translate-x-0 h-auto opacity-100 open-menu" : "-translate-x-48 opacity-0 close-menu"
                        }`}>
                            <div
                                className="block w-full py-1 font-sans text-sm antialiased font-light leading-normal text-gray-700">
                                <nav
                                    className="flex min-w-[240px] flex-col gap-1 p-0 font-sans text-base font-normal text-blue-gray-700">

                                    <div role="button"
                                         className={`${classContainerLink}`}>
                                        <div className="grid mr-4 place-items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth="3"
                                                 stroke="currentColor" aria-hidden="true" className="w-5 h-3">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M8.25 4.5l7.5 7.5-7.5 7.5"></path>
                                            </svg>
                                        </div>

                                        <Link
                                            to="/indicadores/funcionarios"
                                            onClick={() => setIsVisibility(false)}
                                            className={`w-full p-3`}
                                        >
                                            Funcionários
                                        </Link>

                                    </div>

                                    <div role="button"
                                         className={`${classContainerLink}`}>
                                        <div className="grid mr-4 place-items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth="3"
                                                 stroke="currentColor" aria-hidden="true" className="w-5 h-3">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M8.25 4.5l7.5 7.5-7.5 7.5"></path>
                                            </svg>
                                        </div>

                                        <Link
                                            to="/indicadores/indicadores"
                                            onClick={() => setIsVisibility(false)}
                                            className={`w-full p-3`}
                                        >
                                            Indicadores
                                        </Link>

                                    </div>

                                    <div role="button"
                                         className={`${classContainerLink}`}>
                                        <div className="grid mr-4 place-items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth="3"
                                                 stroke="currentColor" aria-hidden="true" className="w-5 h-3">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M8.25 4.5l7.5 7.5-7.5 7.5"></path>
                                            </svg>
                                        </div>

                                        <Link
                                            to="/indicadores/questoes"
                                            onClick={() => setIsVisibility(false)}
                                            className={`w-full p-3`}
                                        >
                                            Questões
                                        </Link>
                                    </div>

                                    <div role="button"
                                         className={`${classContainerLink}`}>
                                        <div className="grid mr-4 place-items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth="3"
                                                 stroke="currentColor" aria-hidden="true" className="w-5 h-3">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M8.25 4.5l7.5 7.5-7.5 7.5"></path>
                                            </svg>
                                        </div>

                                        <Link
                                            to="/indicadores/questionario"
                                            onClick={() => setIsVisibility(false)}
                                            className={`w-full p-3`}
                                        >
                                            Questionário
                                        </Link>
                                    </div>
                                </nav>
                            </div>
                        </div>
                        </div>

                    <div className="relative block w-full">
                        <div role="button"
                             className="flex items-center w-full p-0 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
                            <button type="button" onClick={() => toggleSubmenu("reservas")}
                                    className="flex items-center justify-between w-full p-3 font-sans text-xl antialiased font-semibold leading-snug text-left transition-colors border-b-0 select-none border-b-blue-gray-100 text-blue-gray-700 hover:text-blue-gray-900">
                                <div className="grid mr-4 place-items-center">

                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                         className="w-5 h-5">
                                        <path
                                            d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"/>
                                        <path fillRule="evenodd"
                                              d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
                                              clipRule="evenodd"/>
                                    </svg>

                                </div>
                                <p className="block mr-auto font-sans text-base antialiased font-normal leading-relaxed text-blue-gray-900">
                                    Diagnósticos
                                </p>
                                <span
                                    className={`ml-4 transition-transform duration-300 ease-in-out  ${openMenus["reservas"] ? "rotate-180" : ""}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="2.5"
                                         stroke="currentColor" aria-hidden="true"
                                         className="w-4 h-4 mx-auto transition-transform">
                                      <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path>
                                    </svg>
                                </span>
                            </button>
                        </div>
                        <div className={`overflow-hidden transition-transform duration-300 ease-in-out ${
                            openMenus["reservas"] ? "translate-x-0 h-auto opacity-100 open-menu" : "-translate-x-48  close-menu opacity-0"
                        }`}>
                            <div
                                className="block w-full py-1 font-sans text-sm antialiased font-light leading-normal text-gray-700">
                                <nav
                                    className="flex min-w-[240px] flex-col gap-1 p-0 font-sans text-base font-normal text-blue-gray-700">

                                    <div role="button"
                                         className={`${classContainerLink}`}>
                                        <div className="grid mr-4 place-items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth="3"
                                                 stroke="currentColor" aria-hidden="true" className="w-5 h-3">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M8.25 4.5l7.5 7.5-7.5 7.5"></path>
                                            </svg>
                                        </div>

                                        <Link
                                            to="/indicadores/diagnosticos/consultar"
                                            onClick={() => setIsVisibility(false)}
                                            className={`w-full p-3`}
                                        >
                                            Consultar Diagnósticos
                                        </Link>
                                    </div>

                                    <div role="button"
                                         className={`${classContainerLink}`}>
                                        <div className="grid mr-4 place-items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth="3"
                                                 stroke="currentColor" aria-hidden="true" className="w-5 h-3">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M8.25 4.5l7.5 7.5-7.5 7.5"></path>
                                            </svg>
                                        </div>

                                        <Link
                                            to="/indicadores/diagnosticos"
                                            onClick={() => setIsVisibility(false)}
                                            className={`w-full p-3`}
                                        >
                                            Gerenciar Diagnósticos
                                        </Link>
                                    </div>


                                </nav>
                            </div>
                        </div>
                    </div>

                    <div className="relative block w-full">
                        <div role="button"
                             className="flex items-center w-full p-0 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
                            <button type="button" onClick={() => toggleSubmenu("relatorio")}
                                    className="flex items-center justify-between w-full p-3 font-sans text-xl antialiased font-semibold leading-snug text-left transition-colors border-b-0 select-none border-b-blue-gray-100 text-blue-gray-700 hover:text-blue-gray-900">
                                <div className="grid mr-4 place-items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                         aria-hidden="true"
                                         className="w-5 h-5">
                                        <path fillRule="evenodd"
                                              d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z"
                                              clipRule="evenodd"></path>
                                    </svg>
                                </div>
                                <p className="block mr-auto font-sans text-base antialiased font-normal leading-relaxed text-blue-gray-900">
                                    Relatório
                                </p>
                                <span
                                    className={`ml-4 transition-transform duration-300 ease-in-out  ${openMenus["relatorio"] ? "rotate-180" : ""}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="2.5"
                                     stroke="currentColor" aria-hidden="true"
                                     className="w-4 h-4 mx-auto transition-transform">
                                  <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path>
                                </svg>
                            </span>
                            </button>
                        </div>
                        <div className={`overflow-hidden transition-transform duration-300 ease-in-out ${
                            openMenus["relatorio"] ? "translate-x-0 h-auto opacity-100 open-menu" : "-translate-x-48  close-menu opacity-0"
                        }`}>
                            <div
                                className="block w-full py-1 font-sans text-sm antialiased font-light leading-normal text-gray-700">
                                <nav
                                    className="flex min-w-[240px] flex-col gap-1 p-0 font-sans text-base font-normal text-blue-gray-700">
                                    <div role="button"
                                         className={`${classContainerLink}`}>
                                        <div className="grid mr-4 place-items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth="3"
                                                 stroke="currentColor" aria-hidden="true" className="w-5 h-3">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M8.25 4.5l7.5 7.5-7.5 7.5"></path>
                                            </svg>
                                        </div>
                                        <Link
                                            to="/indicadores/relatorio/analise-dos-diagnosticos"
                                            onClick={() => setIsVisibility(false)}
                                            className={`w-full p-3`}
                                        >
                                            Análise dos diagnósticos
                                        </Link>
                                    </div>

                                </nav>
                            </div>
                        </div>
                    </div>

                    <div role="button"
                         onClick={() => handleLogout()}
                         className={`flex items-center w-full leading-tight transition-all rounded-lg outline-none text-start hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 active:bg-opacity-80 py-3 px-2 text-[var(--color-red-dark-light)] hover:text-white hover:bg-[var(--color-red)]`}>
                        <div className="grid mr-4 place-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                 aria-hidden="true"
                                 className="w-5 h-5">
                                <path fillRule="evenodd"
                                      d="M12 2.25a.75.75 0 01.75.75v9a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM6.166 5.106a.75.75 0 010 1.06 8.25 8.25 0 1011.668 0 .75.75 0 111.06-1.06c3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788a.75.75 0 011.06 0z"
                                      clipRule="evenodd"></path>
                            </svg>
                        </div>
                        Sair
                    </div>
                </nav>
            </div>
        </>
    )
}