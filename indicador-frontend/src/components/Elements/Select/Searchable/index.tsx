import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

export interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    searchPlaceholder?: string;
    id?: string;
    getText?: (text: string) => void;
    setNoItemSearched?: (noItemSearched: boolean) => void;
}

export default function SelectSearchable({
                                   options,
                                   value,
                                   onChange,
                                   placeholder = 'Selecione uma opção',
                                   searchPlaceholder = 'Pesquise...',
                                   className = '',
                                   id = '',
                                   getText,
                                   setNoItemSearched,
                               }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const selectRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const selectedOption = options.find(option => option.value === value);

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (!setNoItemSearched) return;

        if (filteredOptions.length === 0 && setNoItemSearched) {
            setNoItemSearched(true);
        }

        if (isOpen && filteredOptions.length !== 0) {
            setNoItemSearched(false);
        }
    }, [filteredOptions.length, isOpen, setNoItemSearched]);

    const handleOpen = () => {
        setIsOpen(true);
        setSearchTerm('');
    };

    return (
        <div ref={selectRef} className={`relative ${className}`}>
            <button
                type="button"
                onClick={handleOpen}
                id={id}
                className="w-full bg-white border border-gray-300 rounded-lg p-3 text-left shadow-sm
                 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                 transition-colors duration-200"
            >
                <div className="flex items-center justify-between">
                    <span className={`block truncate ${!selectedOption ? 'text-gray-500' : 'text-gray-900'}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <div className="flex items-center space-x-2">
                        {
                            value && (
                            <X onClick={() => {
                                onChange('')
                                setTimeout(() => setIsOpen(false), 0)
                            }} className={`w-5 h-5 text-gray-400`} />
                        )}
                        <ChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                            isOpen ? 'transform rotate-180' : ''
                        }`}
                    />
                    </div>
                </div>
            </button>

            {isOpen && (
                <div className={`absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg`}>
                    <div className="px-3 py-2 border-b border-gray-200">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value)
                                    if (getText) getText(e.target.value)
                                }}
                                placeholder={searchPlaceholder}
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <ul className="py-1 max-h-60 overflow-auto">
                        {filteredOptions.length === 0 ? (
                            <li className="px-4 py-2 text-sm text-gray-500 text-center">Nenhum resultado encontrado</li>
                        ) : (
                            filteredOptions.map((option) => (
                                <li
                                    key={option.value}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                        setSearchTerm('');
                                    }}
                                    className={`px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors duration-150
                            ${option.value === value ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}
                            ${option.value === value ? 'font-medium' : 'font-normal'}`}
                                >
                                    {option.label}
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}