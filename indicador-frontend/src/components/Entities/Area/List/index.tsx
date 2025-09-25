import ListItems, {IdentifierList} from "../../../General/ListItems";
import {TAreasFormValues} from "../../../../services/areas.ts";

type UserListProps = {
    areas: TAreasFormValues[];
    children?: React.ReactNode
    onEdit?: (id: IdentifierList) => void;
    onDelete? : (id: IdentifierList) => void;

};

export default function List({ areas, onEdit, onDelete }: UserListProps) {
    return (
        <div className="w-full mx-auto">
            {areas.map((area) => (
                <ListItems
                    key={area.id}
                    identifier={area.id}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    >
                    <span className="text-lg font-semibold text-gray-800">{area.name}</span>
                    <span className="text-sm text-gray-600">Cor: {area.color}</span>
                </ListItems>
            ))}
        </div>
    );
}
