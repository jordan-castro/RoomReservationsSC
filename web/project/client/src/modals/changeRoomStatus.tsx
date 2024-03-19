// ON CONTRACT = updateRoomReservationStatus()
'use client';

import { useRef } from "react";
import BaseModal from "./base";
import connectToSmartContract from "@/utils/contract";
import updateStatus from "@/api/updateStatus";

declare const window:any;

export default function ChangeRoomStatusModal() {
    const container: any = useRef(null);

    return (
        <BaseModal
            title="Change Room Status"
            body={
                (
                    <div ref={container}>
                        <div className="mb-3">
                            <label htmlFor="roomId" className="form-label">Room ID</label>
                            <input type="number" className="form-control" id="roomId" name="roomId" aria-describedby="roomIdHelp" />
                            <div id="roomId" className="form-text">The rooms ID</div>
                        </div>
                        <div className="mb-3 form-check">
                            <input type="checkbox" className="form-check-input" id="canReserve" />
                            <label className="form-check-label" htmlFor="canReserve">Can the room be reserved currently?</label>
                        </div>
                    </div>
                )
            }
            modalId="changeRoomStatusModal"
            posButtonTitle="Change"
            onPos={async () => {
                // Check we have provider
                if (window.provider === undefined) {
                    alert("No Wallet provider avaialable");
                    return;
                } 

                // VALUES
                const values = {
                    roomId: container.current.querySelector("#roomId"),
                    canReserve: container.current.querySelector("#canReserve")
                };

                // PRIVATE AND PUBLIC
                const signer = await window.provider.getSigner()
                
                const result = await updateStatus(
                    Number(values.roomId.value),
                    values.canReserve.checked,
                    await signer.getAddress()
                );

                if (!result) {
                    alert("Error while changing room reservation status");
                    return;
                }

                alert("Room reservation status changed. Check rooms tab");

                values.roomId.value = "";
            }}
        />
    );
}