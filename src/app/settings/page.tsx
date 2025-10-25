'use client';

import { useSession } from "@/context/SessionContext";
import { useState } from "react";


import UpdateUserModal from "@/components/settings/modals/UpdateUser";
import AccountInfo from "@/components/settings/AccountInfo";
import AccountSecurity from "@/components/settings/AccountSecurity";
import Preferences from "@/components/settings/Preferences";

import DangerZone from "@/components/settings/DangerZone";


const Settings = () => {
    const userData = useSession();

    const [isModal, setIsModal] = useState<boolean>(false);
    const [modalData, setModalData] = useState<string>('');

    const handleModal = (attr?: string) => {
        if (isModal) {
            setIsModal(false);
            setModalData('');
        } else {
        setModalData(attr!);
        setIsModal(true);
        };
    };

    return (
        <main className="flex flex-col gap-10 border border-border rounded-md m-4 bg-surface">
            <UpdateUserModal attr={modalData} show={isModal} onClose={handleModal} />

            { userData &&
                <>
                    <AccountInfo userData={userData} onEdit={handleModal} />
                    <hr />
                    <AccountSecurity onEdit={handleModal} />
                    <hr />
                </>
            }

            <Preferences />

            { userData &&
                <>
                    <hr />
                    <DangerZone />
                </>
            }
        </main>
    );
};

export default Settings;