import { z } from "zod";
import {TLoginFormValues} from "../../../../services/auth.ts";

export const schema = z.object({
    name: z
        .string({
            required_error: "Usuário deve ser preenchido.",
        }),
    password: z
        .string({
            required_error: "A senha deve ser preenchida.",
        })
});

export function getDefaultValues<T extends Record<string, any>>(): T {
    return {} as T;
}

export const defaultValues: TLoginFormValues = getDefaultValues<TLoginFormValues>();

export type FormData = z.infer<typeof schema>;