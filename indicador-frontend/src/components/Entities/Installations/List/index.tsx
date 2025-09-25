import ListItems, {IdentifierList} from "../../../General/ListItems";
import {TInstallationFormValues} from "../../../../services/installations.ts";

type ListProps = {
    items: TInstallationFormValues[];
    children?: React.ReactNode
    onEdit?: (id: IdentifierList) => void;
    onDelete? : (id: IdentifierList) => void;
};

export default function List({ items, onEdit, onDelete }: ListProps) {
    return (
        <div className="w-full mx-auto">
            {items.map((user) => (
                <ListItems
                    key={user.id_instalacao}
                    identifier={user.id_instalacao}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    >
                    <span className="text-lg font-semibold text-gray-800">{user.nome}</span>
                </ListItems>
            ))}
        </div>
    );
}
