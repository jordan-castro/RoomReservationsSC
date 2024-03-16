'use client';

import { useRef } from "react";
import BaseModal from "./base";
import connectToSmartContract from "@/utils/contract";

declare const window: any;

export default function MakeReservationModal() {
    const container: any = useRef(null);

    return (
        <BaseModal
            title="Make a Reservation"
            body={
                (
                    <div ref={container}>
                        <div className="mb-3">
                            <label htmlFor="roomId" className="form-label">Room ID</label>
                            <input type="number" className="form-control" id="roomId" name="roomId" aria-describedby="roomIdHelp" />
                            <div id="roomId" className="form-text">The rooms ID</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="startDate" className="form-label">Start Date</label>
                            <input type="date" className="form-control" id="startDate" name="startDate" aria-describedby="startDateHelp" />
                            <div id="startDateHelp" className="form-text">What is the start date for your reservation?</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="endDate" className="form-label">End Date</label>
                            <input type="date" className="form-control" id="endDate" name="endDate" aria-describedby="endDateHelp" />
                            <div id="endDateHelp" className="form-text">What is the end date for your reservation?</div>
                        </div>
                    </div>
                )
            }
            modalId="makeReservationModal"
            posButtonTitle="Reserve"
            onPos={async () => {
                if (window.provider === undefined) {
                    alert("No Wallet provider avaialable");
                    return;
                }

                // VALUES
                const values = {
                    roomId: container.current.querySelector("#roomId"),
                    startDate: container.current.querySelector("#startDate"),
                    endDate: container.current.querySelector("#endDate"),
                };

                const signer = await window.provider.getSigner();
                const contract = connectToSmartContract(signer);

                contract.makeReservation(
                    Number(values.roomId.value),
                    (new Date(values.startDate.value).getTime() / 1000),
                    (new Date(values.endDate.value).getTime() / 1000),
                    true
                ).then(async (value) => {
                    await value.wait();

                    alert("Reservation has been made. Reservation ID is: #" + await contract.getReservationsLength())

                    values.roomId.value = "";
                    values.startDate.value = "";
                    values.endDate.value = "";
    
                }).catch((reason) => {
                    alert(reason);
                });
            }}
        />
    );
}