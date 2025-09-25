import React from 'react';
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import {Link} from "react-router-dom";

interface ReservasPorLocalSubmenuProps {
    isOpen: boolean;
    onToggle: (e: React.MouseEvent) => void;
    title: string
    links: {
        label: string,
        to: string,
    }[]
}

export default function Dropdown({ isOpen, onToggle, title, links }: ReservasPorLocalSubmenuProps) {

    const classContainerLink = `hover:bg-gray-300 flex items-center w-full leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900`

    return (
        <div>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    onToggle(e);
                }}
                className="w-full flex items-center justify-between p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
            >
                <div className="flex items-center">
                    <MapPin className="h-4 w-4 inline-block mr-2" />
                    <span>{title}</span>
                </div>
                {isOpen ? (
                    <ChevronUp className="h-3 w-3" />
                ) : (
                    <ChevronDown className="h-3 w-3" />
                )}
            </button>
            {isOpen &&
                links.map((l, i) => (
                        <div role="button" key={i}
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
                                to={l.to}
                                // onClick={() => setIsVisibility(false)}
                                className={`w-full p-3`}
                            >
                                {l.label}
                            </Link>
                        </div>

                        // <div className="ml-6 mt-2 space-y-2">
                        //     <a href="#" className="block p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                        //         Sala A
                        //     </a>
                        //     <a href="#" className="block p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                        //         Sala B
                        //     </a>
                        //     <a href="#" className="block p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                        //         Auditório
                        //     </a>
                        // </div>
                    )
                )
            }
        </div>
    );
}