'use client';

import server from "@/api/server";
import React, { useState, useEffect } from "react";

export default function PropertiesTab({ rooms }: React.PropsWithoutRef<{ rooms: any }>) {
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
                    <th scope="row">Null</th>
                    <th scope="row">Null</th>
                </tr>
            </tbody>;
        }

        return (<tbody>
            {rooms.map((room: any, _: any) => (
                <tr key={room.id}>
                    <th scope="row">{room.id}</th>
                    <th scope="row">{room.name}</th>
                    <th scope="row"><img src={room.logo} width={200} height={200} /></th>
                    <th scope="row">{room.typeof}</th>
                    <th scope="row">{room.physicaladdress}</th>
                    <th scope="row">{room.owner}</th>
                    <th scope="row">{room.contactemail}</th>
                    <th scope="row">{room.contactphone}</th>
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
                        <th scope="col">Name</th>
                        <th scope="col">Logo</th>
                        <th scope="col">typeOf</th>
                        <th scope="col">Physical Address</th>
                        <th scope="col">Owner</th>
                        <th scope="col">Contact Email</th>
                        <th scope="col">Contact Phone</th>
                    </tr>
                </thead>
                {body()}
            </table>

        </>
    );
}