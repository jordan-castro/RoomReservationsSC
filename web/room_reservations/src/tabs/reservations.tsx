'use client';

import server from "@/api/server";
import intToDate from "@/utils/int_to_date";
import React, { useState, useEffect } from "react";

export default function ReservationsTab() {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        fetchData();
    });

    const fetchData = async () => {
        const response = await fetch(server + "db/reservations");
        const json = await response.json();

        if (json.result === 1 || json.result === 2) {
            return;
        }

        setRooms(json.result);
    };

    return (
        <>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Reserver</th>
                        <th scope="col">Room ID</th>
                        <th scope="col">Start Date</th>
                        <th scope="col">End Date</th>
                        <th scope="col">Is Paid</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.map((room: any, _) => (
                        <tr key={room.id}>
                            <th scope="row">{room.reservation_id}</th>
                            <td>{room.reserver}</td>
                            <td>{room.room_id}</td>
                            <td>{intToDate(room.start_date)}</td>
                            <td>{intToDate  (room.end_date)}</td>
                            <td>{room.is_paid ? "Yes" : "No"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}