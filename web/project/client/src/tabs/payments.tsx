'use client';

import server from "@/api/server";
import intToDate from "@/utils/int_to_date";
import React, { useState, useEffect } from "react";


export default function PaymentsTab({ rooms }:React.PropsWithoutRef<{rooms: any}>):React.JSX.Element {
    return (
        <>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Payer</th>
                        <th scope="col">Payee</th>
                        <th scope="col">Date Paid</th>
                        <th scope="col">Reservation ID</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.map((room: any, _: any) => (
                        <tr key={room.id}>
                            <th scope="row">{room.id}</th>
                            <td>{room.payer}</td>
                            <td>{room.payee}</td>
                            <td>{intToDate(room.date_paid)}</td>
                            <td>{room.reservation_id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </>
    );
}