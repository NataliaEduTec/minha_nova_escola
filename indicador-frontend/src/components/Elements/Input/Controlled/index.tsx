import Input from "../index.tsx";
import {Controller} from "react-hook-form";

type Props = {
    name: string,
    control?: any
    placeholder?: string
    type?: string
    onChange?: (e:  React.ChangeEvent<HTMLInputElement>) => void
    defaultValue?: any;
}

export default function InputControlled ({name, control, placeholder, type, onChange, defaultValue}: Props) {
    return <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { ...field } }) => (
            <Input
                type={type? type: "text"}
                id={name}
                placeholder={placeholder}
                {...field}
                {...(onChange ? { onChange } : {})}
                className="input w-full input-bordered"
            />
        )}
    />
}