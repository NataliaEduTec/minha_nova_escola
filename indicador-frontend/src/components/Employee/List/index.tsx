import ListItems, {IdentifierList} from "../../General/ListItems";
import {TEmployeeFormValues} from "../../../services/employee";


type EmployeeListProps = {
    items: TEmployeeFormValues[];
    children?: React.ReactNode
    onEdit?: (id: IdentifierList) => void;
    onDelete? : (id: IdentifierList) => void;
};

export default function List({ items, onEdit, onDelete }: EmployeeListProps) {
    return (
        <div className="w-full mx-auto">
            {items.map((item) => (
                <ListItems
                    key={item.id_funcionario}
                    identifier={item.id_funcionario}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    >
                    <span className="text-lg font-semibold text-gray-800">{item.name}</span>
                </ListItems>
            ))}
        </div>
    );
}
