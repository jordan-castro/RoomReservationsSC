'use client';

import BaseModal from "./base";

export default function MakePaymentModal() {
    return (
        <BaseModal
            title="Make Payment"
            body={
                (
                    <div>
                        <div className="mb-3">
                            <label htmlFor="reservationId" className="form-label">Reservation ID</label>
                            <input type="number" className="form-control" id="reservationId" name="reservationId" aria-describedby="reservationIdHelp" />
                            <div id="reservationIdHelp" className="form-text">The reservations ID</div>
                        </div>
                    </div>
                )
            }
            modalId="makePaymentModal"
            onPos={() => {}}
            posButtonTitle="Pay"
        />
    );
}