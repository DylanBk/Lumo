'use client';

import { logout, remove } from "@/app/actions/user";

import { useActionState, useCallback, useEffect, useState, useTransition } from "react";
import {FocusTrap} from "focus-trap-react";

import { LoaderCircle } from "lucide-react";


const initialState = {
    ok: false,
    message: "",
    errors: {
        email: '',
        password: ''
    }
};

const DangerZone = () => {
    const [isLoading, startTransition] = useTransition();
    const [isModal, setIsModal] = useState<boolean>(false);
    const [state, action, isPending] = useActionState(remove, initialState);

        const handleCancel = useCallback(() => {
            state.ok = false;
            state.message = "";
            state.errors = {};
            setIsModal(false);
        }, [state]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (isModal) {
                if (e.key === 'Escape') setIsModal(false);
            };
        };

        document.addEventListener('keydown', handleEsc);

        return () => document.removeEventListener('keydown', handleEsc);
    }, [isModal, handleCancel]);

    const handleLogout = async () => {
        startTransition(() => {
            logout();
        });
    };

    return (
        <section>
            <h2>Danger Zone</h2>

            <div className="flex flex-col gap-8 mt-8">
                <button
                    className="danger"
                    onClick={handleLogout}
                    disabled={isLoading}>
                    {isLoading ? 
                        <LoaderCircle
                            className="animate-spin duration-200"
                        />
                    :
                        'Logout'}
                </button>

                <button
                    className="danger"
                    onClick={() => setIsModal(true)}>
                    Delete Account
                </button>

                { isModal &&
                    <div className="modal">
                        <FocusTrap>
                            <div className="modal-content">
                                <h2>Delete Account</h2>

                                <form action={action}>
                                    <div>
                                        <label htmlFor="email">Email:</label>
                                        <input name="email" type="email" placeholder="example@domain.com" required />
                                    </div>

                                    <div>
                                        <label htmlFor="password">Password:</label>
                                        <input name="password" type="password" placeholder="********" required />
                                    </div>

                                    <div className="items-start">
                                        <label htmlFor="confirm">I confirm that I wish for all data related to my account to be permanently deleted.</label>
                                        <input name="confirm" type="checkbox" required />
                                    </div>

                                    <p className="error">
                                        {state?.errors.email || state?.errors.password &&
                                        String(state.errors.email || state.errors.password)}
                                    </p>

                                    <p className="error">
                                        {state?.message && state.message}
                                    </p>

                                    <div className="w-full flex flex-row justify-center gap-8">
                                        <button
                                            className="bg-surface-muted text-text-primary"
                                            onClick={handleCancel}
                                            disabled={isPending}>
                                            Cancel
                                        </button>

                                        <button
                                            className="danger"
                                            type="submit"
                                            disabled={isPending}>
                                            Delete
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </FocusTrap>
                    </div>
                }
            </div>
        </section>
    );
};

export default DangerZone;