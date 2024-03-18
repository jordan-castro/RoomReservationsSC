'use client';

import { useRef } from "react";
import BaseModal from "./base";
import connectToSmartContract from "@/utils/contract";
import deleteReservation from "@/api/deleteReservation";

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

                const result = await deleteReservation(
                    Number(values.roomId.value),
                    Number(values.reservationId.value),
                    await signer.getAddress()
                );

                if (!result) {
                    alert("Error deleting reservation.");
                    return;
                }

                alert("Reservation has been deleted. Check reservations");

                // Clear values
                values.roomId.value = "";
                values.reservationId.value = "";
            }}
        />
    );
}