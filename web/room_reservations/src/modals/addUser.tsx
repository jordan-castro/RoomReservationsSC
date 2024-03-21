'use client';

import { useRef } from "react";
import BaseModal from "./base";
import addUser from "@/api/addUser";

export default function AddUserModal() {
    const container: any = useRef(null);

    return (
        <BaseModal
            title="Add User"
            body={(
                <div ref={container}>
                    <div className="mb-3">
                        <label htmlFor="ownerAddress" className="form-label">Public Key</label>
                        <input type="text" required className="form-control" id="ownerAddress" name="ownerAddress" aria-describedby="ownerAddressHelp" />
                        <div id="ownerAddressHelp" className="form-text">What is the public key?</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="secretKey" className="form-label">Secret Key</label>
                        <input type="text" required className="form-control" id="secretKey" name="secretKey" aria-describedby="secretKeyHelp" />
                        <div id="secretKeyHelp" className="form-text">What secret key should be created?</div>
                    </div>
                </div>
            )}
            modalId="addUserModal"
            posButtonTitle="Add"
            onPos={async () => {
                const values = {
                    ownerAddress: container.current.querySelector("#ownerAddress"),
                    secretKey: container.current.querySelector("#secretKey")
                };

                // Make request to server
                const result = await addUser(
                    values.ownerAddress.value,
                    values.secretKey.value
                );

                if (!result) {
                    alert("Something went wrong on the server, Try Again in a little while.");
                } else {
                    alert("User ADDED! Check Users tab.");
                }

                values.ownerAddress.value = "";
                values.secretKey.value = "";
            }}
        />
    );
}