import React from "react";

export default interface IHeader extends React.HTMLAttributes<HTMLHeadingElement> {
    children?: string
    ref?: React.Ref<HTMLHeadingElement>
}