"use client";

import React from "react";
import {isConnected, connectWallet} from "@/utils/connect_wallet";

declare const window: any;

export default function UseWallet() {
    React.useEffect(() => {
        connectWallet().then(async (value) => {
            if (value !== undefined) {
                window.provider = value;
            }
        });
    }); 

    return (
        <div id="connectWalletInBackground"></div>
    );
}