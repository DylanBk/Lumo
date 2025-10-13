'use client';

import { logout } from "@/app/actions/auth";

import { useTransition } from "react";
import { LoaderCircle } from "lucide-react";


const DangerZone = () => {
    const [isPending, startTransition] = useTransition();

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
                    disabled={isPending}>
                    {isPending ? 
                        <LoaderCircle
                            className="animate-spin duration-200"
                        />
                    :
                        'Logout'}
                </button>

                <button className="danger">Delete Account</button>
            </div>
        </section>
    );
};

export default DangerZone;