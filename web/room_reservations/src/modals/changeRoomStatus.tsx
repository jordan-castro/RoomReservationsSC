// ON CONTRACT = updateRoomReservationStatus()
'use client';

import BaseModal from "./base";

export default function ChangeRoomStatusModal() {
    return (
        <BaseModal
            title="Change Room Status"
            body={
                (
                    <div>
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
            onPos={() => { console.log("Change room status"); }}
        />
    );
}