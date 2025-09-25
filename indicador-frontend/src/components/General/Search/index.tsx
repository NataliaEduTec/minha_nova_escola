import Input from "../../Elements/Input";
import Button from "../../Elements/Button";

type Props = {
    handleOpenModalRegister?: () => void
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    children?: React.ReactNode
    hiddenCodeInput?: boolean
}

export default function Search ({handleOpenModalRegister, onChange, children, hiddenCodeInput}: Props) {

    return (
        <section className={`grid ${!hiddenCodeInput ? "grid-cols-3 md:grid-cols-2" : ""} gap-4 mb-4`}>
            <Input
                onChange={(e) => {
                    if (onChange) onChange(e)
                }}

                placeholder={`Pesquisar`} className={`col-span-2 md:col-span-1 ${hiddenCodeInput ? "hidden" : ""}`}/>

            <section
                className={`grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:w-[40%] sm:min-w-[230px] bg-blak justify-center items-center`}>

                <Button className={
                    `p-3 h-full border border-[var(--principal-color)]
                            hover:bg-[var(--principal-color)] hover:text-white
                            hidden sm:inline-block`
                }>
                    Pesquisar
                </Button>

                {handleOpenModalRegister && !children ? (
                    <Button
                        onClick={handleOpenModalRegister}
                        className={`p-3 h-full border border-[--color-green]
                            hover:bg-[--color-green]
                            text-[--color-green] hover:text-white`
                        }>
                        Cadastrar
                    </Button>
                ) : (
                    children
                )
                }

            </section>
        </section>
    );
}