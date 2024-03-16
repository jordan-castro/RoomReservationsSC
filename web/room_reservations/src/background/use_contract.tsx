'use client';

import connectToSmartContract from "@/utils/contract";
import { ethers } from "ethers";
import React from "react";

declare const window: any;

export default function UseContract() {
    React.useEffect(() => {
        window.provider.getSigner().then((value:ethers.Signer) => {
            window.contract = connectToSmartContract(value);
        });
    });

    return (
        <div id="useContractInBackground"></div>
    );
}