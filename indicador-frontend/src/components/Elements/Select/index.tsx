type Props = React.HTMLAttributes<HTMLSelectElement>

export default function Select ({children, ...props}: Props) {
    return (
        <select
            {...props}
            className="select select-bordered w-full">
            {children}
        </select>
    )
}