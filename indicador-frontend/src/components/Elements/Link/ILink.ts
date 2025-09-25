import React from "react";

export default interface ILink extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    children: React.ReactNode;
}