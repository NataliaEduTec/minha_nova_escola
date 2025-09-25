import { ScaleLoader } from "react-spinners";

type Props = {
    children?: React.ReactNode
}

export default function Loading({children = "Aguarde, por favor..."}: Props) {
    return (
        <div className="flex justify-center flex-col gap-4 items-center h-full">
            {children}
            <ScaleLoader color="#353866" />
        </div>
    );
}
