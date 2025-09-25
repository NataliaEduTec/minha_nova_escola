import ListItems, {IdentifierList} from "../../General/ListItems";
import { TDiagnostic } from "../Form/schema";

type ListProps = {
    items: TDiagnostic[];
    children?: React.ReactNode
    onEdit?: (id: IdentifierList) => void;
    onDelete? : (id: IdentifierList) => void;
    onDuplicate? : (id: IdentifierList) => void;
};

export default function ListDiagnostics({ items, onEdit, onDelete, onDuplicate }: ListProps) {
    const classNameDefault = "mx-1 p-1 rounded-sm text-black bg-blue-100"

    return (
        <div className="w-full mx-auto">
            {items.map((item) => (
                <ListItems
                    key={item.id}
                    identifier={item.id}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDuplicate={onDuplicate}
                    >
                    <div className="flex flex-col gap-2">
                        <span className="text-lg font-semibold text-gray-800">{item.name}</span>
                        <div className="flex flex-row gap-2">
                            {
                                item?.user?.name && (
                                    <p>Criado por: <span className={classNameDefault}>{item?.user?.name}</span></p>
                                )
                            }
                            {
                                item?.created_at && (
                                    <p>em <span className={classNameDefault}>{
                                        new Date(item?.created_at).toLocaleDateString(
                                            "pt-BR",
                                            {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }
                                        )
                                    }</span></p>
                                )
                            }
                        </div>
                    </div>
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
