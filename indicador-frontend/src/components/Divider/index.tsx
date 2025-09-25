import React from "react";

type Props = React.HTMLAttributes<HTMLDivElement>

export default function Divider ({ children }: Props) {
    return (
        <div className="relative flex items-center my-6">
            <div className="flex-grow border-t-[2px] border-gray-300 opacity-60"></div>
            <span className={`text-gray-500 font-semibold ${children ? "mx-4" : ""}`}>{children}</span>
            <div className="flex-grow border-t-[2px] border-gray-300 opacity-60"></div>
        </div>
    );
}