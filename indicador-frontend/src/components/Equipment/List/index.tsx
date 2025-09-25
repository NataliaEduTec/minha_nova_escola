import ListItems, {IdentifierList} from "../../General/ListItems";
import {TEquipmentFormValues} from "../../../services/equipment";


type ListProps = {
    items: TEquipmentFormValues[];
    children?: React.ReactNode
    onEdit?: (id: IdentifierList) => void;
    onDelete? : (id: IdentifierList) => void;
};

export default function List({ items, onEdit, onDelete }: ListProps) {
    return (
        <div className="w-full mx-auto">
            {
                !items.length && <h1 className={`text-center mt-8`}>Nenhum registro encontrado...</h1>
            }
            {items.map((item) => (
                <ListItems
                    key={item.id_equipamento}
                    identifier={item.id_equipamento}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    >
                    <span className="text-lg font-semibold text-gray-800">{item.nome}</span>
                </ListItems>
            ))}
        </div>
    );
}
