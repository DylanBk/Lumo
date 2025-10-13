import { SquarePen } from "lucide-react";

const AccountSecurity = () => {
    return (
        <section>
            <h2>Account Security</h2>

            <div className="flex flex-col gap-8 mt-8">
                <div className="w-fit flex flex-col items-end">
                    <h6 className="mr-auto text-text-primary">Password:</h6>

                    <div className="flex flex-row gap-2 items-center ml-4">
                        <p>********</p>
                        <button className="primary">
                            <SquarePen className="h-4 w-4" />
                        </button>
                    </div>
                </div>


                <div className="flex flex-col gap-2">
                    <h6>Two Factor Authentication</h6>
                    <button className="secondary">Enable</button>
                </div>

                <div className="flex flex-col gap-2">
                    <h6>Request Data</h6>
                    <button className="primary">Request</button>
                </div>
            </div>
        </section>
    );
};

export default AccountSecurity;