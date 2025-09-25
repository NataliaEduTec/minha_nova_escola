import React from "react";

export default interface IButton {
    value: string;
    onClick?: () => void;
    className?: string;
    type?: string;
}

export interface ICloseButton extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    children?: React.ReactNode
    className?: string;
}


