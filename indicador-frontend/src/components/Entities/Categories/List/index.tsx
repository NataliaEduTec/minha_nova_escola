import ListItems, {IdentifierList} from "../../../General/ListItems";
import {TCategoriesFormValues} from "../../../../services/categories.ts";

type ListProps = {
    items: TCategoriesFormValues[];
    children?: React.ReactNode
    onEdit?: (id: IdentifierList) => void;
    onDelete? : (id: IdentifierList) => void;
};

export default function List({ items, onEdit, onDelete }: ListProps) {
    return (
        <div className="w-full mx-auto">
            {
                !items.length && <h1 className={`text-center mt-8`}>Nenhum registro...</h1>
            }
            {items.map((item) => (
                <ListItems
                    key={item.id_categoria}
                    identifier={item.id_categoria}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    >
                    <span className="text-lg font-semibold text-gray-800">{item.nome}</span>
                </ListItems>
            ))}
        </div>
    );
}
