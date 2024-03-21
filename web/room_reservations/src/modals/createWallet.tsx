'use client';

import { useRef } from "react";
import BaseModal from "./base";
import createWallet from "@/api/createWallet";

export default function CreateWalletModal() {
    const container: any = useRef(null);

    return (
        <BaseModal
            title="Create Wallet"
            body={(
                <div ref={container}>
                    <p>
                        Please confirm your Create Wallet request.
                    </p>
                    <div className="mb-3 form-check">
                        <input type="checkbox" required className="form-check-input" id="confirmation" />
                        <label className="form-check-label" htmlFor="confirmation">Yes I want to create a new wallet.</label>
                    </div>
                </div>
            )}
            modalId="createWalletModal"
            posButtonTitle="Create"
            onPos={async () => {
                const values = {
                    confirmation: container.current.querySelector("#confirmation")
                };

                if (!values.confirmation.checked) {
                    alert("You have not confirmed your request.");
                    return;
                }

                const result = await createWallet();
                if (result === null) {
                    alert("Something went wrong on the server, Try Again in a little while.");
                } else {
                    alert("SAVE THIS DATA YOU WILL ONLY SEE IT ONCE: \npublic_key: " + result.public + "\nprivate_key: " + result.private);
                }
                values.confirmation.checked = false;
            }}
        />
    );
}