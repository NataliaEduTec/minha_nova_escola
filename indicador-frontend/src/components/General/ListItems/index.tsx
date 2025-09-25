import Button from "../../Elements/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare, faRotate, faTrashCan} from "@fortawesome/free-solid-svg-icons";

export type IdentifierList = number | string;

type Props = React.HTMLAttributes<HTMLDivElement> & {
    children?: React.ReactNode
    onEdit?: (id: IdentifierList) => void;
    onDelete?: (id: IdentifierList) => void;
    onDuplicate?: (id: IdentifierList) => void;
    identifier?: IdentifierList
    editable?: boolean;
    className?: string;
}

export default function ListItems ({children, editable = true, onEdit, onDelete, onDuplicate, identifier, className}: Props) {
    return (
        <div
            className={`flex justify-between items-center bg-white border-b border-gray-200 py-4 px-6 hover:bg-gray-50 transition`}
        >
            <div className={`flex ${className}`}>
                {children}
            </div>
            <div className="flex space-x-2">
                {editable && onDuplicate && <Button
                    onClick={() => identifier && onDuplicate(identifier)}
                    className="px-4 py-2 text-white rounded-md bg-orange-400 hover:bg-orange-500"
                    title={`Reutilizar`}
                >
                    <FontAwesomeIcon icon={faRotate} className={"text-inherit text-xl hover:text-white"}/>
                </Button>}

                {editable && <Button
                    onClick={() => (onEdit && identifier) && onEdit(identifier)}
                    className="px-4 py-2 bg-[--principal-color] text-white rounded-md hover:bg-[--principal-color-light]"
                    title={`Editar`}
                >
                    <FontAwesomeIcon icon={faPenToSquare} className={"text-inherit text-xl hover:text-white"}/>
                </Button>}
                
                {(onDelete && identifier) && <Button
                    onClick={() => onDelete(identifier)}
                    className="px-4 py-2 bg-[--color-red-dark-light] text-white rounded-md hover:bg-[--color-red]"
                    title={`Excluir`}
                >
                    <FontAwesomeIcon icon={faTrashCan} className={"text-inherit text-xl hover:text-white"}/>
                </Button>}
            </div>
        </div>
    )
}