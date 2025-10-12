'use server';

import { redirect } from "next/navigation";

import { SignupSchema, LoginSchema } from "@/lib/definitions";
import { createUser, loginUser } from "@/lib/auth";
import { AuthFormState } from "@/lib/definitions";
import { ZodError } from "zod";

export async function signup(state: AuthFormState, formData: FormData) {
    try {
        const data = Object.fromEntries(formData.entries());
        const parsedData = SignupSchema.parse(data);

        await createUser(parsedData.email, parsedData.username, parsedData.password);

        return {
            ok: true,
            message: `New user created`,
            errors: {}
        };
    } catch (e) {
        if (e instanceof ZodError) {
            const errors: Record<string, string[]> = {};
            for (const err of e.issues) {
                const field = err.path[0];
                if (typeof field === "string") {
                    if (!errors[field]) errors[field] = [];
                    errors[field].push(err.message);
                };
            };

            return {
                ok: false,
                message: "",
                errors,
                data: Object.fromEntries(formData)
            };
        }
        return {
            ok: false,
            message: e instanceof Error ? e.message : "Unknown error",
            errors: {},
            data: Object.fromEntries(formData)
        };
    };
};

export async function login(state: AuthFormState, formData: FormData) {
    try {
        const data = Object.fromEntries(formData.entries());
        const parsedData = LoginSchema.parse(data);

        const user = await loginUser(parsedData.email, parsedData.password);

        return {
            ok: true,
            message: `Logged into: ${user}`,
            errors: {}
        };
    } catch (e) {
        if (e instanceof ZodError) {
            const errors: Record<string, string[]> = {};
            for (const err of e.issues) {
                const field = err.path[0];
                if (typeof field === "string") {
                    if (!errors[field]) errors[field] = [];
                    errors[field].push(err.message);
                }
            }
            return {
                ok: false,
                message: "",
                errors,
                data: Object.fromEntries(formData)
            };
        }
        return {
            ok: false,
            message: e instanceof Error ? e.message : "Unknown error",
            errors: {},
            data: Object.fromEntries(formData)
        };
    };
}