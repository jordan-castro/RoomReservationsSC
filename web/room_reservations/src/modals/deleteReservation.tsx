'use client';

import { useRef } from "react";
import BaseModal from "./base";
import connectToSmartContract from "@/utils/contract";

declare const window: any;

export default function DeleteReservationModal() {
    const container: any = useRef(null);

    return (
        <BaseModal
            title="Delete a Reservation"
            body={
                (
                    <div ref={container}>
                        <div className="mb-3">
                            <label htmlFor="roomId" className="form-label">Room ID</label>
                            <input type="number" className="form-control" id="roomId" name="roomId" aria-describedby="roomIdHelp" />
                            <div id="roomId" className="form-text">The rooms ID</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="reservationId" className="form-label">Reservation ID</label>
                            <input type="number" className="form-control" id="reservationId" name="reservationId" aria-describedby="reservationIdHelp" />
                            <div id="reservationIdHelp" className="form-text">The reservations ID</div>
                        </div>
                    </div>
                )
            }
            modalId="deleteReservationModal"
            posButtonTitle="Delete"
            onPos={async () => {
                // Check we have provider
                if (window.provider === undefined) {
                    alert("No Wallet provider avaialable");
                    return;
                }

                // VALUES
                const values = {
                    roomId: container.current.querySelector("#roomId"),
                    reservationId: container.current.querySelector("#reservationId"),
                };

                // PRIVATE AND PUBLIC
                const signer = await window.provider.getSigner();
                const contract = connectToSmartContract(signer);

                // Call
                contract.deleteReservation(Number(values.roomId.value), Number(values.reservationId.value)).then(async (value) => {
                    await value.wait();
                
                    alert("Reservation has been deleted.");
                    console.log(await contract.getReservationsFor(Number(values.roomId.value)));

                    values.roomId.value = "";
                    values.reservationId.value = "";
                }).catch((reason) => {
                    alert(reason);
                })
            }}
        />
    );
}