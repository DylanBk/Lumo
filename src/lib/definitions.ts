import z from "zod";


// ==========
// ZOD SCHEMA

// user schema

export const SignupSchema = z.object({
    email: z
        .email({message: "Invalid email address"}),
    username: z
        .string()
        .min(3, {message: "Username must be at least 3 characters."})
        .max(32, "Username must be at most 32 characters."),
    password: z
        .string()
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            {message: "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."}
        ),
    'confirm-password': z.string()
        .min(8)
        .max(32)
}).refine(data => data.password === data['confirm-password'], {
    message: "Passwords do not match.",
    path: ['confirm-password']
});

export const LoginSchema = z.object({
    email: z
        .email({message: "Invalid email address"}),
    password: z
        .string().min(1, {message: "Password is required."}),
});

// export const UserAvatarSchema = z.object({
//     avatar: z
//         .instanceof(File)
//         .refine((file) => file.type.startsWith('image/'), "Only images are allowed.")
//         .refine((file) => file.size <= (5 * 1024 * 1024), "Max size is 5MB."),
// });

export const UpdateUserSchema = z.object({
    attr: z
        .string()
        .refine((val) => ["avatar", "username", "email", "password"].includes(val), {
        message: "Invalid attribute to update.",
        }),

    avatar: z
        .instanceof(File)
        .refine((file) => file.type.startsWith('image/'), "Only images are allowed.")
        .refine((file) => file.size <= (5 * 1024 * 1024), "Max size is 5MB.")
        .optional(),
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters." })
        .max(32, { message: "Username must be at most 32 characters." })
        .optional(),
    email: z.string().email({ message: "Invalid email address" }).optional(),
    password: z
        .string()
        .optional(),
    "new-password": z
        .string()
        .min(8)
        .max(32)
        .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
            message:
            "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
        }
        )
        .optional()
});

export const DeleteUserSchema = z.object({
    email: z
        .email({message: "Invalid email address"}),
    password: z
        .string().min(1, {message: "Password is required."}),
});


// post schema

export const CreatePostSchema = z.object({
    content: z
        .string()
        .min(1, {message: "Post must be at least 1 character long."})
        .max(400, {message: "Post must be at most 400 characters long."})
    // TODO?: add tags to filter posts by?
});

export const UpdatePostSchema = z.object({
    attr: z
        .string()
        .refine((val) => ['content', 'like', 'repost', 'comment'].includes(val), {
        message: "Invalid attribute to update.",
    }),

    id: z
        .string(),
    content: z
        .string()
        .min(1, {message: "Post must be at least 1 character long."})
        .max(400, {message: "Post must be at most 400 characters long."})
        .optional(),
    like: z
        .string()
        .refine((val) => ['+', '-'].includes(val), {
            message: "Invalid like operation.",
        })
        .optional(),
    repost: z
        .string()
        .refine((val) => ['+', '-'].includes(val), {
            message: "Invalid repost operation.",
        })
        .optional(),
    comment: z
        .string()
        .refine((val) => ['+', '-'].includes(val), {
            message: "Invalid comment operation.",
        })
        .optional()
});

// ========
// TS TYPES

// user types

export type SignupForm = {
    email: string;
    username: string;
    password: string;
    'confirm-password': string;
};

export type LoginForm = {
    email: string;
    password: string;
};

export type AuthFormState =
    | {
        errors?: {
            email?: string[];
            username?: string[];
            password?: string[];
        };
        message?: string;
    }
    | undefined;

export type UpdateUserState =
    | {
        ok: boolean;
        errors?: {
            email?: string;
            username?: string;
            password?: string;
            'new-password'?: string;
        };
        message?: string;
    }
    | undefined;

export type DeleteUserState =
    | {
        errors?: {
            email?: string;
            password?: string;
        };
        message?: string;
    }
    | undefined;

export type SessionPayload = {
    id: string;
    email: string;
    username: string;
    role: string;
    avatar: string;
    expiresAt: Date;
};


// post types

export type PostType = {
    id: number;
    content: string;
    author_id: number;
    author_name: string;
    likes: number;
    reposts: number;
    shares: number;
    comments: number;
    created_at: Date;
    liked?: boolean;
    reposted?: boolean;
    shared?: boolean;
};

export type CreatePostState =
    | {
        ok: boolean;
        errors?: {
            content?: string;
        };
        message?: string;
    }
    | undefined;

export type UpdatePostState =
    | {
        ok: boolean;
        errors?: {
            authorId?: string | null;
            content?: string | null;
        };
        message?: string;
    }
    | undefined;