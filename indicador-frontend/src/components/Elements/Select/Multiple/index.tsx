import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';

export interface Option {
    value: string;
    label: string;
}

interface MultiSelectProps {
    options: Option[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
}

export default function MultiSelect({ options, value, onChange, placeholder = 'Escolha...' }: MultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOptions = options.filter(option => value.includes(option.value));
    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (optionValue: string) => {
        const newValue = value.includes(optionValue)
            ? value.filter(v => v !== optionValue)
            : [...value, optionValue];
        onChange(newValue);
    };

    const removeOption = (optionValue: string, e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(value.filter(v => v !== optionValue));
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <div
                className="min-h-[42px] p-3 bg-white border border-gray-300 rounded-lg shadow-sm cursor-pointer flex flex-wrap gap-1.5 relative"
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedOptions.length > 0 ? (
                    selectedOptions.map(option => (
                        <span
                            key={option.value}
                            className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-blue-100 text-blue-800"
                        >
                            {option.label}
                            <button
                                type={"button"}
                                onClick={(e) => removeOption(option.value, e)}
                                className="ml-1 hover:text-blue-900"
                            >
                            <X size={14} />
                          </button>
                        </span>
                    ))
                ) : (
                    <span className="text-gray-500">{placeholder}</span>
                )}
                <button className="ml-auto" type={"button"}>
                    <ChevronDown
                        size={20}
                        className={`text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
                    />
                </button>
            </div>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <div className="p-2">
                        <input
                            type="text"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Pesquise..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <ul className="max-h-60 overflow-auto py-1">
                        {filteredOptions.map(option => (
                            <li
                                key={option.value}
                                className={`px-3 py-2 cursor-pointer flex items-center text-sm
                  ${value.includes(option.value) ? 'bg-blue-50' : 'hover:bg-gray-100'}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleOption(option.value);
                                }}
                            >
                                <div className={`w-4 h-4 border rounded mr-2 flex items-center justify-center
                  ${value.includes(option.value) ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}
                                >
                                    {value.includes(option.value) && <Check size={12} className="text-white" />}
                                </div>
                                {option.label}
                            </li>
                        ))}
                        {filteredOptions.length === 0 && (
                            <li className="px-3 py-2 text-sm text-gray-500">Nenhuma opção encontrada...</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}