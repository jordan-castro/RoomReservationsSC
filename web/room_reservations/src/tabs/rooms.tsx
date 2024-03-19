'use client';

import server from "@/api/server";
import React, {useState, useEffect} from "react";

export default function RoomsTab() {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        fetchData();
    });

    const fetchData = async () => {
        const response = await fetch(server + "db/rooms");
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
                        <th scope="col">Title</th>
                        <th scope="col">Physical Address</th>
                        <th scope="col">Image</th>
                        <th scope="col">Owner</th>
                        <th scope="col">Can Reserve</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.map((room:any, _) => (
                        <tr>
                            <th scope="row">{room.room_id}</th>
                            <th scope="row">{room.title}</th>
                            <th scope="row">{room.physical_address}</th>
                            <th scope="row"><img src={room.image} width={200} height={200} /></th>
                            <th scope="row">{room.owner}</th>
                            <th scope="row">{room.can_reserve ? "Yes" : "No"}</th>
                        </tr>
                    ))}
                </tbody>
            </table>

        </>
    );
}