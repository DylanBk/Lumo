'use client';

import Link from "next/link";
import { useActionState, useEffect } from "react";

import { signup } from "../actions/auth";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";


const initialState = {
    ok: false,
    message: "",
    errors: {
        email: [],
        username: [],
        password: [],
        "confirm-password": []
    }
};

const Signup = () => {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(signup, initialState);

    useEffect(() => {
        if (state.ok) router.push('/login');
    }, [router, state.ok]);

    return (
        <main>
            <form className="auth" action={formAction}>
                <h2>Create Account</h2>

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
                    <label htmlFor="username">Username:</label>
                    <input
                        name="username"
                        type="text"
                        placeholder="John Smith"
                        minLength={3}
                        maxLength={32}
                        defaultValue={state.data?.username || ""}
                        required
                    />
                    {state.errors?.username && <p className="error">{String(state.errors.username.join(", "))}</p>}
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

                <div>
                    <label htmlFor="confirm-password">Confirm Password:</label>
                    <input
                        name="confirm-password"
                        type="password"
                        placeholder="********"
                        minLength={8}
                        maxLength={32}
                        required
                    />
                    {state.errors?.["confirm-password"] && <p className="error">{String(state.errors["confirm-password"].join(", "))}</p>}
                </div>

                <button className="primary" disabled={isPending}>
                    {isPending ? (
                        <LoaderCircle className="icon animate-spin duration-200" />
                    ) : (
                        "Sign Up"
                    )}
                </button>

                {/* TODO: should remove for production */}
                {/* {state.message && <p className="error">{state.message}</p>} */}

                <p>Already have an account? <Link href='/login'>Login</Link></p>
            </form>
        </main>
    );
};

export default Signup;