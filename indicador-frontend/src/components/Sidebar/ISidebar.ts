import React from "react";

export default interface ISidebar extends React.HTMLAttributes<HTMLDivElement> {
    employer?: string;
    style?: React.CSSProperties
}