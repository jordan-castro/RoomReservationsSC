'use client';

import server from "@/api/server";
import React, { useState, useEffect } from "react";

export default function RoomsTab({ rooms }: React.PropsWithoutRef<{ rooms: any }>) {
    const body = () => {
        if (rooms === undefined) {
            return <tbody>
                <tr>
                    <th scope="row">Null</th>
                    <th scope="row">Null</th>
                    <th scope="row">Null</th>
                    <th scope="row">Null</th>
                    <th scope="row">Null</th>
                    <th scope="row">Null</th>
                </tr>
            </tbody>;
        }

        return (<tbody>
            {rooms.map((room: any, _: any) => (
                <tr key={room.id}>
                    <th scope="row">{room.property_id}</th>
                    <th scope="row">{room.room_id}</th>
                    <th scope="row">{room.title}</th>
                    <th scope="row"><img src={room.image} width={200} height={200} /></th>
                    <th scope="row">{room.owner}</th>
                    <th scope="row">{room.can_reserve ? "Yes" : "No"}</th>
                </tr>
            ))}
        </tbody>
        );
    };

    return (
        <>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Property #</th>
                        <th scope="col">Title</th>
                        <th scope="col">Image</th>
                        <th scope="col">Owner</th>
                        <th scope="col">Can Reserve</th>
                    </tr>
                </thead>
                {body()}
            </table>

        </>
    );
}