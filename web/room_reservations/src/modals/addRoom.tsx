'use client';

import React, { useRef } from "react";
import BaseModal from "./base";
import addRoom from "@/api/addRoom";
import localImageB64 from "@/utils/local_image_b64";

declare const window: any;

export default function AddRoomModal() {
    const container: any = useRef(null);

    return (
        <BaseModal
            title="Add a room"
            body={
                (
                    <div ref={container}>
                        <div className="mb-3">
                            <label htmlFor="ownerAddress" className="form-label">Owner Address</label>
                            <input type="text" required className="form-control" id="ownerAddress" name="ownerAddress" aria-describedby="ownerAddressHelp" />
                            <div id="ownerAddressHelp" className="form-text">What is the owners address?</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="secretKey" className="form-label">Secret Key</label>
                            <input type="text" required className="form-control" id="secretKey" name="secretKey" aria-describedby="secretKeyHelp" />
                            <div id="secretKeyHelp" className="form-text">Your scret key to allow transactions?</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="propertyId" className="form-label">Property Id #</label>
                            <input type="number" required className="form-control" id="propertyId" name="propertyId" aria-describedby="propertyIdHelp" />
                            <div id="propertyIdHelp" className="form-text">Which property does this room belong to.</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="roomTitle" className="form-label">Room title</label>
                            <input type="text" required className="form-control" id="roomTitle" name="roomTitle" aria-describedby="roomHelp" />
                            <div id="roomHelp" className="form-text">What special title do you want for your room?</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">Image</label>
                            <input type="file" required className="form-control" id="image" name="image" aria-describedby="imageHelp"
                                onChange={async (e) => {
                                    const preview = container.current.querySelector("#preview");
                                    if (e.target.files === null) {
                                        preview.src = "";
                                    } else {
                                        preview.src = "data:image/png;base64, " + await localImageB64(e.target.files![0]);
                                    }
                                }}
                            />
                            <div id="imageHelp" className="form-text">Images must be a URL, otherwise the Smart Contract becomes too expensive.</div>
                            <img id="preview" width={200} height={200} />
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
                // Get all values
                const values = {
                    ownerAddress: container.current.querySelector("#ownerAddress"),
                    secretKey: container.current.querySelector("#secretKey"),
                    propertyId: container.current.querySelector("#propertyId"),
                    roomTitle: container.current.querySelector("#roomTitle"),
                    image: container.current.querySelector("#image").files[0],
                    price: container.current.querySelector("#price"),
                    canReserve: container.current.querySelector("#canReserve"),
                };
                // const signer = await window.provider.getSigner();

                const result = await addRoom(
                    Number(values.propertyId.value),
                    values.roomTitle.value,
                    values.image,
                    Number(values.price.value),
                    values.canReserve.checked,
                    values.ownerAddress.value,
                    values.secretKey.value,
                );

                console.log(result);

                if (!result) {
                    alert("Failed to add room. Please try again.");
                    return;
                }

                // Clear the values
                values.roomTitle.value = "";
                values.price.values = "";

                alert("Successfully added room. Please check the Rooms tab.");
                document.getElementById("callRooms")?.click();
            }}
            posButtonTitle="Add"
        />
    );
}