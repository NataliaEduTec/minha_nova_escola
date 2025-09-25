import ILink from "./ILink.ts";

export default function Link ({ children, className, ...props }: ILink) {
    return <a
        {...props}
        className={
            `text-blue-600 cursor-pointer hover:text-blue-800 no-underline hover:underline focus:outline-none 
             transition-all focus: ${className}`
        }
    >
        {children}
    </a>
}