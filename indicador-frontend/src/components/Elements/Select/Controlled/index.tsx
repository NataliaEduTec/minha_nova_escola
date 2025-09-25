import {Controller} from "react-hook-form";
import Select from "../index.tsx";

type Props = {
    name: string,
    control?: any
    placeholder?: string
    type?: string
    onChange?: (e:  React.ChangeEvent<HTMLSelectElement>) => void
    children?: React.ReactNode
}

export default function SelectControlled ({name, control, onChange, children}: Props) {
    return <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field: { ...field } }) => (
            <Select
                id={name}
                {...field}
                onChange={onChange}
            >
                {children}
            </Select>
        )}
    />
}