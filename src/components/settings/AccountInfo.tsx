import Image from "next/image";
import { SessionPayload } from "@/lib/definitions";

import { SquarePen } from "lucide-react";


type Props = {
    userData: SessionPayload
};

const AccountInfo = (props: Props) => {
    const temp = '/temp.png';
    const userData = props.userData;

    return (
        <section className="flex flex-col gap-5">
            <h2>Account Information</h2>

            <div className="flex flex-row gap-16 mt-8">
                <div className="w-fit flex flex-col items-center">
                    <div className="relative">
                        <Image
                            height={256}
                            width={256}
                            className="border border-border rounded-full"
                            src={temp}
                            alt="Your avatar"
                        />
                        <button className="primary absolute right-4 bottom-4">
                            <SquarePen className="h-4 w-4" />
                        </button>
                    </div>

                    <p>{userData.username || 'Unavailable'}</p>
                    <p className="text-sm">{userData.role || 'User'}</p>
                </div>

                <div className="flex flex-col gap-8">
                    <div className="w-full flex flex-col items-end">
                        <h6 className="mr-auto text-text-primary">Username:</h6>

                        <div className="flex flex-row gap-2 items-center">
                            <p>{userData.username || 'Unavailable'}</p>
                            <button className="primary">
                                <SquarePen className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                        <div className="w-full flex flex-col items-end">
                            <h6 className="mr-auto text-text-primary">Email:</h6>

                            <div className="flex flex-row gap-2 items-center">
                                <p>{userData.email || 'Unavailable'}</p>
                                <button className="primary">
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