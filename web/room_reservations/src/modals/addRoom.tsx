'use client';

import { useRef } from "react";
import BaseModal from "./base";
import { connectWallet } from "@/utils/connect_wallet";
import connectToSmartContract from "@/utils/contract";

declare const window: any;

export default function AddRoomModal() {
    const container:any = useRef(null);

    return (
        <BaseModal
            title="Add a room"
            body={
                (
                    <div ref={container}>
                        <div className="mb-3">
                            <label htmlFor="roomTitle" className="form-label">Room title</label>
                            <input type="text" required className="form-control" id="roomTitle" name="roomTitle" aria-describedby="roomHelp" />
                            <div id="roomHelp" className="form-text">What special title do you want for your room?</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="physicalAddress" className="form-label">Physical Address</label>
                            <input type="text" required className="form-control" id="physicalAddress" name="physicalAddress" aria-describedby="physicalAddressHelp" />
                            <div id="physicalAddressHelp" className="form-text">What is your rooms physical address?</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">Image</label>
                            <input type="text" required className="form-control" id="image" name="image" aria-describedby="imageHelp" />
                            <div id="imageHelp" className="form-text">Images must be a URL, otherwise the Smart Contract becomes too expensive.</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="price" className="form-label">Price in Wei</label>
                            <input type="number" required className="form-control" id="price" name="price" aria-describedby="priceHelp" />
                            <div id="priceHelp" className="form-text">What is the price for your room? Values must be in Wei!</div>
                        </div>
                        <div className="mb-3 form-check">
                            <input type="checkbox" required className="form-check-input" id="canReserve" />
                            <label className="form-check-label" htmlFor="canReserve">Can the room be reserved currently?</label>
                        </div>
                    </div>
                )
            }
            modalId="addRoomModal"
            onPos={async () => {
                // Get provider
                if (window.provider === undefined) {
                    alert("No Wallet provider avaialable.");
                    return;
                }

                // Get all values
                const values = {
                    roomTitle: container.current.querySelector("#roomTitle"),
                    physicalAddress: container.current.querySelector("#physicalAddress"),
                    image: container.current.querySelector("#image"),
                    price: container.current.querySelector("#price"),
                    canReserve: container.current.querySelector("#canReserve")
                };

                const signer = await window.provider.getSigner();
                const contract = connectToSmartContract(signer);

                const tx = await contract.addRoom(values.roomTitle.value, values.physicalAddress.value, values.image.value, Number(values.price.value), values.canReserve.checked);

                // WAIT for transaction to finish
                await tx.wait();

                alert("Room has been added. Room ID is: #" + await contract.getRoomsLength());
                console.log(await contract.rooms(await contract.getRoomsLength() - BigInt(1)));

                // Clear the values
                values.roomTitle.value = "";
                values.physicalAddress.value = "";
                values.image.value = "";
                values.price.values = "";
            }}
            posButtonTitle="Add"
        />
    );
}