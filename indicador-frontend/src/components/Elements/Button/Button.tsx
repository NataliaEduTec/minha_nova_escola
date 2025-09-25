import IButton from "./IButton.ts";

export default function Button({value, className, onClick}: IButton) {
    return <button
        className={
            `px-6 py-3 text-white bg-[--primary-color] rounded-lg shadow-md hover:bg-[--primary-color-dark] focus:outline-none focus:ring-2
            focus:ring-[--primary-color] focus:ring-offset-2 transition-transform transform active:scale-95 ${className}`
        }
        onClick={onClick}
    >
        {value}
    </button>
}