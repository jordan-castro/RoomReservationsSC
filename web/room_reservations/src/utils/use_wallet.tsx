"use client";

import React from "react";
import {isConnected, connectWallet} from "./connect_wallet";

declare const window: any;

export default function UseWallet() {
    React.useEffect(() => {
        if (!isConnected()) {
            // Connect
            connectWallet();
        }
    });

    return (
        <div id="connectWalletInBackground"></div>
    );
}