import Modal from "../index.tsx";
import {forwardRef} from "react";
import Button from "../../Elements/Button";

type Props = React.HTMLAttributes<HTMLButtonElement> & {
    onClick?: () => void;
    onDelete?: () => void;
};

const Delete = forwardRef(({ onClick, onDelete }: Props, ref) => {
    return (
        <Modal ref={ref} dialogClassName={"max-w-xl"}>
            <h2 className={`text-center mb-4`}>Deseja Confirmar a exclusão?</h2>
            <div className="mt-6 flex justify-end md:space-x-4">
                <Button
                    type="button"
                    onClick={onClick}
                    className="w-1/2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 md:inline-block hidden"
                >
                    Não
                </Button>
                <Button
                    type="submit"
                    onClick={onDelete}
                    className={
                        `w-full px-4 py-2 bg-[--color-red-dark] text-white rounded-md hover:bg-[--color-red]
                        md:w-1/2
                    `}
                >
                    Sim
                </Button>
            </div>
        </Modal>
    );
})

export default Delete;