'use client';

import { useRef } from "react";
import BaseModal from "./base";
import showBalance from "@/api/showBalance";

export default function ShowBalanceModal() {
    const container: any = useRef(null);

    return (
        <BaseModal
            title="Show Balance"
            modalId="showBalanceModal"
            posButtonTitle="Show"
            body={(
                <div ref={container}>
                    <div className="mb-3">
                        <label htmlFor="ownerAddress" className="form-label">Public Key</label>
                        <input type="text" required className="form-control" id="ownerAddress" name="ownerAddress" aria-describedby="ownerAddressHelp" />
                        <div id="ownerAddressHelp" className="form-text">What is the public key?</div>
                    </div>
                </div>
            )}
            onPos={async () => {
                const values = {
                    ownerAddress: container.current.querySelector("#ownerAddress")
                };

                const result = await showBalance(values.ownerAddress.value);

                alert("Balance: " + result);
            }}
        />
    );
}