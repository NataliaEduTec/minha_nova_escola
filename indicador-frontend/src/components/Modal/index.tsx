import {forwardRef, useImperativeHandle, useRef} from "react";
import Button from "../Elements/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";

type ModalProps = React.HTMLAttributes<HTMLDialogElement> & {
    dialogClassName?: string
    classNameDiv?: string;
}

const Modal = forwardRef(({ children, dialogClassName = "max-w-md", classNameDiv = "min-h-screen" }: ModalProps, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const openDialog = () => {
        dialogRef.current?.showModal();
    };

    const closeDialog = () => {
        dialogRef.current?.close();
    };

    useImperativeHandle(ref, () => ({
        openDialog,
        closeDialog,
    }));

    return (
        <div className={`flex flex-col items-center justify-center ${classNameDiv}`}>

            <dialog
                ref={dialogRef}
                className={`rounded-lg p-6 shadow-lg bg-white border-2 border-gray-200 w-11/12 transform transition-all duration-300 scale-95 open:scale-100 ${dialogClassName}`}
            >
                <div className={"absolute right-1 top-1"}>
                    <Button
                        onClick={closeDialog}

                        className={"text-[var(--color-red)] hover:bg-[var(--color-red)] shadow-none border-none"}>
                        <FontAwesomeIcon icon={faXmark} className={"text-inherit text-xl hover:text-white"}/>
                    </Button>
                </div>
                {children}
            </dialog>
        </div>
    );
})

export default Modal;
