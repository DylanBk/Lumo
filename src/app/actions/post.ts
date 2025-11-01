'use server';

import { getSession } from "@/lib/session";
import { CreatePostState, CreatePostSchema, PostType } from "@/lib/definitions";
import { ZodError } from "zod";
import { createPost, getPosts } from "@/lib/post";


export const create = async (state: CreatePostState, formData: FormData) => {
    try {
        const data = Object.fromEntries(formData.entries());
        const parsedData = CreatePostSchema.parse(data);

        const s = await getSession();

        if (!s?.payload.id) throw new Error('No session available');

        await createPost(s?.payload.id as string, s?.payload.username as string, parsedData.content);

        return {
            ok: true,
            message: 'New post created',
            errors: {}
        };
    } catch (e) {
        if (e instanceof ZodError) {
            const errors: Record<string, string[]> = {};
            for (const err of e.issues) {
                const field = err.path[0];
                if (typeof field === 'string') {
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

export const get = async (id: string) => {
};

export const getAll = async () => {
    try {
        const posts = await getPosts();

        return {
            ok: true,
            data: posts as PostType[]
        };
    } catch (e) {
        return {
            ok: false,
            message: e instanceof Error ? e.message : "Unknown error"
        };
    }
};