import Button from "../../components/Elements/Button/Button.tsx";
import {SubmitHandler, useForm} from "react-hook-form";
import {defaultValues, FormData, schema} from "../../components/Login/Form/schema";
import {zodResolver} from "@hookform/resolvers/zod";
import InputControlled from "../../components/Elements/Input/Controlled";
import LoginApi, {TLoginFormValues, TLoginValuesResponse} from "../../services/auth.ts";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const { handleSubmit, formState: { errors }, control } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            ...defaultValues,
        },
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<TLoginFormValues> = async (data) => {
        const toastId = toast.loading("Aguarde, por favor...")

        try {
            const response = await LoginApi.login<TLoginValuesResponse>(data)

            toast.update(toastId, {
                render: response.message,
                type: response.status,
                autoClose: 3000,
                isLoading: false,
            })

            if (response.status === "success") {
                navigate("/indicadores/diagnosticos")
            }
        } catch (e) {
            console.error(e)

            toast.update(toastId, {
                render: "Houver um erro interno",
                type: "error",
                autoClose: 3000,
                isLoading: false,
            })
        }
    }

    return (
        <section className={`w-full h-full flex justify-center items-center`}>

            <main className={
                `mt-16 w-[98%] max-w-md h-full max-h-[34rem] shadow-xl bg-white rounded-xl border-4 border-opacity-50 border-gray-200
                flex justify-center items-center
                f`
            }>
                <form className={"grid grid-cols-1 gap-8 p-4 w-[90%]"} onSubmit={handleSubmit(onSubmit)}>
                    <h1 className={"text-center font-medium text-xl"}>Login</h1>
                    <div className={"w-full"}>
                        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                            Usuário
                        </label>

                        <InputControlled control={control} placeholder={"Usuário"} name={"name"} />
                        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                    </div>
                    <div className={"w-full"}>
                        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                            Senha
                        </label>
                        <InputControlled control={control} placeholder={"Informe sua Senha"} type={"password"} name={"password"} />
                        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                    </div>
                    <Button value={"Entrar"} type={"submit"} />

                    {/*<Divider/>*/}


                    {/*<Link children={"Esqueceu a Senha?"} href={"#"} className={"text-center"}/>*/}
                </form>
            </main>

        </section>
    );
}

export default Login;
