import React from "react";

export default interface InterfaceInput extends React.InputHTMLAttributes<HTMLInputElement> {
    type?: string;
    placeholder?: string;
    value?: string;
    className?: string
    id?: string;
}