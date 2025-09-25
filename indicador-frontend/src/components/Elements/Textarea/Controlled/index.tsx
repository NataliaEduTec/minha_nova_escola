import Textarea from "../index.tsx";
import {Controller} from "react-hook-form";

type Props = {
    name: string,
    control?: any
    placeholder?: string
    disabled?: boolean
}

export default function TextAreaControlled ({name, control, placeholder, disabled = false}: Props) {
    return <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field: { ...field } }) => (
            <Textarea
                id={name}
                placeholder={placeholder}
                disabled={disabled}
                {...field}
            />
        )}
    />
}