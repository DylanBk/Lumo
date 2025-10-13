import { SessionPayload } from "@/lib/definitions";
import { getSession } from "@/lib/session";

import AccountInfo from "@/components/settings/AccountInfo";
import AccountSecurity from "@/components/settings/AccountSecurity";
import Preferences from "@/components/settings/Preferences";

import DangerZone from "@/components/settings/DangerZone";


const Settings = async () => {
    const s = await getSession();
    const userData = s?.payload as SessionPayload;

    // console.log(userData)

    return (
        <main className="flex flex-col gap-10 border border-border rounded-md m-4 bg-surface">
            { userData &&
                <>
                    <AccountInfo userData={userData} />
                    <hr />
                    <AccountSecurity />
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