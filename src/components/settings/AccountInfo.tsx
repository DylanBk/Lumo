'use client';

import Image from "next/image";
import { SessionPayload } from "@/lib/definitions";

import { SquarePen } from "lucide-react";


type Props = {
    userData: SessionPayload;
    onEdit: (attr: string) => void;
};

const AccountInfo = (props: Props) => {
    const userData = props.userData;

    const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
        const attr = e.currentTarget.value;
        props.onEdit(attr);
    };

    return (
        <section className="flex flex-col gap-5">
            <h2>Account Information</h2>

            <div className="flex flex-row gap-16 mt-8">
                <div className="w-fit flex flex-col items-center">
                    <div className="relative">
                        <Image
                            height={256}
                            width={256}
                            className="h-64 w-64 border border-border rounded-full"
                            src={userData.avatar}
                            alt="Your avatar"
                            placeholder="empty"
                        />

                        <button
                            className="primary absolute right-4 bottom-4"
                            onClick={handleEdit}
                            value='avatar'>
                            <SquarePen className="h-4 w-4" />
                        </button>
                    </div>

                    <p>{userData.username || 'Unavailable'}</p>
                    <p className="text-sm">{
                        userData.role === '1' ? 'Owner'
                        : userData.role === '2' ? 'Administrator'
                        : userData.role === '3' ? 'Moderator'
                        : userData.role === '4' ? 'User'
                        : userData.role === '5' ? 'Suspended'
                        : userData.role === '6' ? 'Banned'
                        : `${userData.role}`
                    }</p>
                </div>

                <div className="flex flex-col gap-8">
                    <div className="w-full flex flex-col items-end">
                        <h6 className="mr-auto text-text-primary">Username:</h6>

                        <div className="flex flex-row gap-2 items-center">
                            <p>{userData.username || 'Unavailable'}</p>
                            <button
                                className="primary"
                                onClick={handleEdit}
                                value='username'>
                                <SquarePen className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                        <div className="w-full flex flex-col items-end">
                            <h6 className="mr-auto text-text-primary">Email:</h6>

                            <div className="flex flex-row gap-2 items-center">
                                <p>{userData.email || 'Unavailable'}</p>
                                <button
                                    className="primary"
                                    onClick={handleEdit}
                                    value='email'>
                                    <SquarePen className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                </div>
            </div>

            
        </section>
    );
};

export default AccountInfo;