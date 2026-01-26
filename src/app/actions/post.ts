'use server';

import { getSession } from "@/lib/session";
import { CreatePostState, CreatePostSchema, PostType, UpdatePostState, UpdatePostSchema } from "@/lib/definitions";
import { ZodError } from "zod";
import { createPost, getPosts, updatePost } from "@/lib/post";


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

export const getFeed = async () => {
    try {
        const s = await getSession();
        const posts = await getPosts(s?.payload.id as string, 20);

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

export const update = async (state: UpdatePostState, formData: FormData): Promise<UpdatePostState> => {
    try {
        const s = await getSession();

        if (!s?.payload.id) throw new Error('No session available');

        const data = Object.fromEntries(formData);
        const parsedData = UpdatePostSchema.parse(data);

        await updatePost({
            userId: String(s.payload.id),
            postId: parsedData.id,
            content: parsedData.content
        });

        return {
            ok: true,
            message: `Post content updated successfully.`,
            errors: {}
        };

    } catch (e) {
        if (e instanceof ZodError) {}
    };
};

export const like = async(id: string, state: boolean) => {
    try {
        const s = await getSession();

        if (!s?.payload.id) throw new Error('No session available');

        await updatePost({
            userId: String(s.payload.id),
            postId: id,
            like: state ? '+' : '-'
        });

        return {
            ok: true,
            message: `Post ${state ? 'liked' : 'unliked'} successfully.`,
            errors: {}
        };
    } catch (e) {
        return {
            ok: false,
            message: e instanceof Error ? e.message : "Unknown error"
        };
    };
};

export const repost = async(id: string, state: boolean) => {
    try {
        const s = await getSession();

        if (!s?.payload.id) throw new Error('No session available');

        await updatePost({
            userId: String(s.payload.id),
            postId: id,
            repost: state ? '+' : '-'
        });

        return {
            ok: true,
            message: `Post ${state ? 'reposted' : 'unreposted'} successfully.`,
            errors: {}
        }
    } catch (e) {
        return {
            ok: false,
            message: e instanceof Error ? e.message : "Unknown error"
        };
    }
};

// export const share = async(id: string, state: boolean) => {
//     try {
//         const s = await getSession();

//         if (!s?.payload.id) throw new Error('No session available');

//         await updatePost({
//             userId: String(s.payload.id),
//             postId: id,
//             share: state ? '+' : '-'
//         });
//         console.log('updatePost - share')

//         return {
//             ok: true,
//             message: `Post ${state ? 'shared' : 'unshared'}`,
//             errors: {}
//         };
//     } catch (e) {
//         return {
//             ok: false,
//             message: e instanceof Error ? e.message : "Unknown error"
//         };
//     };
// };