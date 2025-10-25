'use server';

import { redirect } from "next/navigation";

import { SignupSchema, LoginSchema, UpdateUserSchema, AuthFormState, UpdateUserState, SessionPayload } from "@/lib/definitions";
import { createUser, deleteUser, getUser, loginUser, updateUser } from "@/lib/user";
import { deleteSession, getSession, updateSession } from "@/lib/session";

import bcrypt from 'bcrypt';
import { ZodError } from "zod";
import { uploadAvatar } from "@/lib/aws";


export const signup = async (state: AuthFormState, formData: FormData) => {
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
        };
        return {
            ok: false,
            message: e instanceof Error ? e.message : "Unknown error",
            errors: {},
            data: Object.fromEntries(formData)
        };
    };
};

export const login = async (state: AuthFormState, formData: FormData) => {
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
                };
            };

            return {
                ok: false,
                message: "",
                errors,
                data: Object.fromEntries(formData)
            };
        };
        return {
            ok: false,
            message: e instanceof Error ? e.message : "Unknown error",
            errors: {},
            data: Object.fromEntries(formData)
        };
    };
}

export const update = async (state: UpdateUserState, formData: FormData) => {
    try {
        const s = await getSession();
        const id = s?.payload.id as string;

        if (!id) throw new Error('No session available');

        const attr = formData.get('attr') as string;

        if (attr === 'avatar') {
            const allowedFiles = process.env.AVATAR_ALLOWED_FILES!;
            const allowedFilesArray = allowedFiles.split(',');
            const file = formData.get('avatar') as File;

            if (!file) throw new Error('No file uploaded');
            if (!(file.type in allowedFilesArray)) throw new Error('File type not allowed');
            if (file.size > (5 * 1024 * 1024)) throw new Error('File must be 5000mb or less');

            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const mimeType = file.type || 'image/png';

            const res = await uploadAvatar(id, buffer, mimeType);

            if (!res) throw new Error('Error uploading avatar to S3');

            const avatar = `${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_DOMAIN}/${id}.png?t=${Date.now()}`;
            await updateSession('avatar', avatar);

            return {
                ok: true,
                message: "Avatar updated successfully",
                errors: {}
            };
        };

        const data = Object.fromEntries(formData);
        const parsedData = UpdateUserSchema.parse(data);
        const val = parsedData[attr as keyof typeof parsedData];

        if (parsedData.password) {
        const user = await getUser(id);
        const check = await bcrypt.compare(parsedData.password, user.password);
        if (!check) {
            return {
            ok: false,
            message: "",
            errors: { password: "Incorrect password" }
            };
        }
        }

        await updateUser(id, attr, val as string);
        await updateSession(attr as keyof SessionPayload, val as string);

        return {
        ok: true,
        message: `User updated ${parsedData.attr}`,
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
        };

        return { ok: false, message: "", errors };
        } else {
            const msg = e instanceof Error ? e.message : 'Unknown Error';

            return {
                ok: false,
                message: msg,
                errors: {[String(formData.get('attr'))]: [msg]}
            };
        };
    };
};

export const remove = async () => {
    const s = await getSession();

    await deleteUser(s?.payload.id as string);
    redirect('/signup');
};

export const logout = async () => {
    await deleteSession();
    redirect('/login');
};