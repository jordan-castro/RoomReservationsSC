'use client';

import BaseModal from "./base";

export default function MakeReservationModal() {
    return (
        <BaseModal
            title="Make a Reservation"
            body={
                (
                    <div>
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
            onPos={() => { console.log("Make Reservation"); }}
        />
    );
}