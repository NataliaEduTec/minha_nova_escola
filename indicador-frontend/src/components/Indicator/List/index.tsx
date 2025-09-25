import ListItems, {IdentifierList} from "../../General/ListItems";
import {TIndicatorFormValues} from "@/services/indicator.ts";


type ListProps = {
    items: TIndicatorFormValues[];
    children?: React.ReactNode
    onEdit?: (id: IdentifierList) => void;
    onDelete? : (id: IdentifierList) => void;
};

export default function List({ items, onEdit, onDelete }: ListProps) {
    return (
        <div className="w-full mx-auto">
            {items.map((item) => (
                <ListItems
                    key={item.id}
                    identifier={item.id}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    className="flex-col gap-2"
                    >
                    <span className="text-lg font-semibold text-gray-800">{item.code}</span>
                    {
                        item.series.length > 0 && (
                            <p className="text-sm text-gray-600">
                                Série(s): 
                                {item.series.map((s, index) => {
                                    if (!s.description) return null;
                                    return (
                                        <span key={index} className="mx-1 p-1 rounded-sm text-black bg-blue-200">
                                            {s.description}
                                        </span>
                                    );
                                })}
                            </p>
                        )
                    }
                    {
                        item.disciplines.length > 0 && (
                            <p className="text-sm text-gray-600 mt-2">
                                Disciplina(s): 
                                {item.disciplines.map((d, index) => {
                                    if (!d.description) return null;
                                    return (
                                        <span key={index} className="mx-1 p-1 rounded-sm text-black bg-blue-200">
                                            {d.description}
                                        </span>
                                    );
                                })}
                            </p>
                        )
                    }
                </ListItems>
            ))}

            {items.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                    Nenhum Registro encontrado.
                </div>
            )}
        </div>
    );
}
