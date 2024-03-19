'use client';

import { useRef } from "react";
import BaseModal from "./base";
import connectToSmartContract from "@/utils/contract";

declare const window : any;

export default function MakePaymentModal() {
    const container: any = useRef(null);

    return (
        <BaseModal
            title="Make Payment"
            body={
                (
                    <div ref={container}>
                        <div className="mb-3">
                            <label htmlFor="reservationId" className="form-label">Reservation ID</label>
                            <input type="number" className="form-control" id="reservationId" name="reservationId" aria-describedby="reservationIdHelp" />
                            <div id="reservationIdHelp" className="form-text">The reservations ID</div>
                        </div>
                    </div>
                )
            }
            modalId="makePaymentModal"
            posButtonTitle="Pay"
            onPos={async () => {
                // Check we have provider
                if (window.provider === undefined) {
                    alert("No Wallet provider avaialable");
                    return;
                }

                // Values
                const values = {
                    reservationId: container.current.querySelector("#reservationId"),
                };

                // instantiate contract
                const signer = await window.provider.getSigner();
                const contract = connectToSmartContract(signer);
                
                // Get price for room
                const reservation = await contract.reservations(Number(values.reservationId.value));
                const room = await contract.rooms(reservation[1]);
                const price = room[4];

                contract.makePayment(Number(values.reservationId.value), {value: price}).then(async (value) => {
                    await value.wait();
                    alert("Payment has been made for reservation: #" + values.reservationId.value);
                    console.log(await contract.payments(await contract.getPaymentsLength() - 1));
                    values.reservationId.value = "";
                }).catch((reason) => {
                    alert(reason);
                });
            }}
        />
    );
}