'use client';

import React, { useRef } from "react";
import BaseModal from "./base";
import localImageB64 from "@/utils/local_image_b64";
import addProperty from "@/api/addProperty";

declare const window: any;

export default function AddPropertyModal() {
    const container: any = useRef(null);

    // if (req.body.name === undefined
    //     || req.body.typeOf === undefined
    //     || req.body.physicalAddress === undefined
    //     || req.body.contactEmail === undefined
    //     || req.body.contactPhone === undefined
    //     || req.body.owner === undefined
    //     || req.body.key === undefined
    // ) {

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
                            <label htmlFor="propertyName" className="form-label">Property Name</label>
                            <input type="text" required className="form-control" id="propertyName" name="propertyName" aria-describedby="roomHelp" />
                            <div id="roomHelp" className="form-text">What special title do you want for your room?</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="physicalAddress" className="form-label">Physical Address</label>
                            <input type="text" required className="form-control" id="physicalAddress" name="physicalAddress" aria-describedby="physicalAddressHelp" />
                            <div id="physicalAddressHelp" className="form-text">What is your property's physical address?</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">Logo</label>
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
                            <label htmlFor="contactEmail" className="form-label">Contact Email</label>
                            <input type="email" required className="form-control" id="contactEmail" name="contactEmail" aria-describedby="priceHelp" />
                            <div id="priceHelp" className="form-text">The contact email</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="contactPhone" className="form-label">Contact Email</label>
                            <input type="phone" required className="form-control" id="contactPhone" name="contactPhone" aria-describedby="priceHelps" />
                            <div id="priceHelps" className="form-text">The contact phone</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="typeOf" className="form-label">Property Type</label>
                            <input type="text" required className="form-control" id="typeOf" name="typeOf" aria-describedby="priceHelps2" />
                            <div id="priceHelps2" className="form-text">What is the property type?</div>
                        </div>
                    </div>
                )
            }
            modalId="addPropertyModal"
            onPos={async () => {
                // Get all values
                const values = {
                    ownerAddress: container.current.querySelector("#ownerAddress"),
                    secretKey: container.current.querySelector("#secretKey"),
                    propertyName: container.current.querySelector("#propertyName"),
                    physicalAddress: container.current.querySelector("#physicalAddress"),
                    image: container.current.querySelector("#image").files[0],
                    contactEmail: container.current.querySelector("#contactEmail"),
                    contactPhone: container.current.querySelector("#contactPhone"),
                    typeOf: container.current.querySelector("#typeOf"),
                };
                // const signer = await window.provider.getSigner();

                const result = await addProperty(
                    values.propertyName.value,
                    values.typeOf.value,
                    values.physicalAddress.value,
                    values.image,
                    values.ownerAddress.value,
                    values.secretKey.value,
                    values.contactEmail.value,
                    values.contactPhone.value
                );

                console.log(result);

                if (!result) {
                    alert("Failed to add property. Please try again.");
                    return;
                }

                // Clear the values
                values.propertyName.value = "";
                values.physicalAddress.value = "";
                values.contactEmail.values = "";

                alert("Successfully added property. Please check the Properties tab.");
                document.getElementById("callProperties")?.click();
            }}
            posButtonTitle="Add"
        />
    );
}