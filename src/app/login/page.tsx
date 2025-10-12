'use client';

import Link from "next/link";
import { useActionState, useEffect } from "react";

import { login } from "../actions/auth";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";


const initialState = {
    ok: false,
    message: "",
    errors: {
        email: [],
        password: []
    }
};


const Login = () => {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(login, initialState);

    useEffect(() => {
        if (state.ok) router.push('/');
        // TODO: add toast ui with success message
    });

    return (
        <main>
            <form className="auth" action={formAction}>
                <h2>Sign In</h2>

                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="example@domain.com"
                        defaultValue={state.data?.email || ""}
                        required
                    />
                    {state.errors?.email && <p className="error">{String(state.errors.email.join(", "))}</p>}
                </div>

                <div>
                    <label htmlFor="password">Password: </label>
                    <input
                        name="password"
                        type="password"
                        placeholder="********"
                        minLength={8}
                        maxLength={32}
                        required
                    />
                    {state.errors?.password && <p className="error">{String(state.errors.password.join(", "))}</p>}
                </div>

                <button
                    className="primary"
                    type="submit"
                    disabled={isPending}>
                    {isPending ? (
                        <LoaderCircle
                            className="animate-spin duration-200"
                        />
                    ) : (
                        "Login"
                    )}
                </button>

                {/* TODO: should remove for production */}
                {/* {state.message && <p className="error">{state.message}</p>} */}

                <p>Don&apos;t have an account? <Link href='/signup'>Sign Up</Link></p>
            </form>
        </main>
    );
};

export default Login;