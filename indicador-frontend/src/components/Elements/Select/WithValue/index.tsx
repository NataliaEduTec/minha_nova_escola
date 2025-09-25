import { useState} from 'react';
import { Search, X, Plus } from 'lucide-react';

export interface SelectedItem {
    id: number;
    name: string;
    value: string;
}

interface Item {
    id: number;
    name: string;
}


type SelectItemWithValueProps = {
    items: Item[];
    setItems?: (items: Item[]) => void;
    selectedItems: SelectedItem[];
    setSelectedItems: (items: SelectedItem[]) => void;
}

export default function SelectItemWithValue({items, selectedItems, setSelectedItems}: SelectItemWithValueProps) {
    //
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [itemValue, setItemValue] = useState('');

    // useEffect(() => {
    //     setItems([{
    //         id: 0,
    //         name: "Teste"
    //     }])
    // }, [setItems]);

    const availableItems = items.filter(item =>
        !selectedItems.some(selected => selected.name === item.name) &&
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (item: Item) => {
        setSelectedItem(item);
        setIsOpen(false);
        setSearchTerm('');
    };

    const handleAddItem = () => {
        if (selectedItem && itemValue) {
            setSelectedItems([...selectedItems, { id: selectedItem.id, name: selectedItem.name, value: itemValue }]);
            setSelectedItem(null);
            setItemValue('');
        }
    };

    const handleRemoveItem = (itemToRemove: SelectedItem) => {
        setSelectedItems(selectedItems.filter(item => item.name !== itemToRemove.name));
    };

    return (
                <div>
                    <div className="grid grid-cols-5 gap-4 mb-6">
                        <div className="relative flex-1 col-span-5">
                            <div
                                className="w-full border rounded-lg px-4 py-2 flex items-center cursor-pointer bg-white"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                {
                                    !isOpen ? (
                                        <Search className="w-4 h-4 text-gray-400 mr-2" />
                                    ) : (
                                        <X className="w-4 h-4 text-gray-400 mr-2 hover:text-red-500" />
                                    )
                                }

                                <input
                                    type="text"
                                    className="flex-1 focus:outline-none"
                                    placeholder="Pesquise..."
                                    value={selectedItem?.name || searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setSelectedItem(null);
                                        setIsOpen(true);
                                    }}
                                    onClick={(e) => { if(isOpen) e.stopPropagation() }}
                                />
                            </div>

                            {isOpen && (
                                <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto z-10">
                                    {availableItems.length > 0 ? (
                                        availableItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => handleSelect({id: item.id, name: item.name})}
                                            >
                                                {item.name}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2 text-gray-500">Nenhum registro encontrado</div>
                                    )}
                                </div>
                            )}
                        </div>

                        <input
                            type="text"
                            className="border rounded-lg p-3 col-span-4"
                            placeholder="Digite um valor"
                            value={itemValue}
                            onChange={(e) => setItemValue(e.target.value)}
                        />

                        <button
                            className="bg-blue-500 text-white p-3 flex justify-center rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!selectedItem || !itemValue}
                            onClick={handleAddItem}
                        >
                            <Plus className="w-6 h-6 text-white font-bold" />
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {selectedItems.map((item) => (
                            <div
                                key={item.name}
                                className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2"
                            >
                                <div>
                                    <span className="font-medium">{item.name}</span>
                                    <span className="text-gray-500 ml-2">({item.value})</span>
                                </div>
                                <button
                                    onClick={() => handleRemoveItem(item)}
                                    className="text-gray-400 hover:text-red-500"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
    );
}