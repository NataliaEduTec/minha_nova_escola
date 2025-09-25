import InterfaceInput from "./InterfaceInput.ts";

export default function Input({ type, placeholder, className, id, ...props }: InterfaceInput) {
    return <input
        id={id}
        type={type ? type : "text"}
        className={
            `w-full text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm 
            placeholder-gray-400 focus:outline-none focus:border-[--primary-color]
            focus:ring-1 focus:ring-[--primary-color] transition-all ${className} p-3`
        }
        placeholder={placeholder}
        {...props}
    />
}
