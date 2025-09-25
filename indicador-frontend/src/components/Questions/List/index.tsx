import Input from "@/components/Elements/Input";
import ListItems, {IdentifierList} from "../../General/ListItems";
import {TQuestionFormValues} from "@/services/questions.ts";
import {useEffect} from "react";


type EmployeeListProps = {
    items: TQuestionFormValues[] & { isSelected?: boolean}[];
    children?: React.ReactNode
    editable?: boolean;
    onEdit?: (id: IdentifierList) => void;
    onDelete? : (id: IdentifierList) => void;
    onChangeSelectItem?: (id: IdentifierList, checked: boolean) => void;
};

export default function List({ items, editable = true, onEdit, onDelete, onChangeSelectItem }: EmployeeListProps) {

    useEffect(() => {
        console.log(onEdit);
    }, [onEdit]);


    return (
        <div className="w-full mx-auto mt-5">
            {items.map((item) => (
                <ListItems
                    editable={editable}
                    key={item.id}
                    identifier={item.id}
                    // onEdit={onEdit}
                    onDelete={onDelete}
                >
                    <Input 
                        type="checkbox"
                        className="w-[20px_!important] h-[20px_!important] bg-[transparent_!important] focus:outline-none cursor-pointer"
                        onChange={(e) => onChangeSelectItem && onChangeSelectItem(item.id, e.target.checked)}
                        // checked={item.isSelected || false}
                        />
                    <span className="text-lg font-semibold text-gray-800 w-4/5" dangerouslySetInnerHTML={{__html: item.content}}></span>
                </ListItems>
            ))}
        </div>
    );
}
