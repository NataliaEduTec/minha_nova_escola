import Button from "../../Elements/Button";
import {ChevronLeft} from "lucide-react";

export default function Back () {

    const handleBack = () => {
        window.history.back();
    }

    return (
        <Button onClick={handleBack} className={
            `p-3 rounded-lg shadow-md focus:outline-none focus:ring-0 mt-2 flex
                        transition-transform transform active:scale-95 
                        border-opacity-20
                        
                         border border-[var(--principal-color)]
                            hover:bg-[var(--principal-color)]
                            hover:text-white text-center h-auto`
        }>
            <ChevronLeft />
            <span className={`md:inline-block ml-1`}>Voltar</span>
        </Button>
    );
}