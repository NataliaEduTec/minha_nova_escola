import {useRef} from "react"

export default function useModal () {
    const modalRef = useRef<{ openDialog: () => void; closeDialog: () => void } | null>(null)

    return {
        modalRef,
        openModal: () => modalRef.current?.openDialog(),
        closeModal: () => modalRef.current?.closeDialog(),
    }
}
