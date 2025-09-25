import {ICloseButton} from "./IButton.ts";

export default function Button({children, className, onClick, title = "", style, type}: ICloseButton) {
    return <button
        style={style}
        className={
            `px-3 py-1.5 hover:text-white rounded-lg shadow-md focus:outline-none focus:ring-0
            transition-transform transform active:scale-95 
            border border-opacity-20
            ${className}`
        }
        onClick={onClick}
        title={title}
        type={type || "button"}
    >
        {children}
    </button>
}