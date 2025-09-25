import React from "react";

type Props = React.InputHTMLAttributes<HTMLTextAreaElement>

export default function Textarea ({...props}: Props) {
    return (
        <textarea
            className={`w-full textarea textarea-bordered`}
            {...props}

        ></textarea>
    )
}