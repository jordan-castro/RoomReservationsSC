'use client';

import BaseModal from "./base";

export default function AddRoomModal() {
    return (
        <BaseModal
            title="Add a room"
            body={
                (
                    <div>
                        <div className="mb-3">
                            <label htmlFor="roomTitle" className="form-label">Room title</label>
                            <input type="text" className="form-control" id="roomTitle" name="roomTitle" aria-describedby="roomHelp" />
                            <div id="roomHelp" className="form-text">What special title do you want for your room?</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="physicalAddress" className="form-label">Physical Address</label>
                            <input type="text" className="form-control" id="physicalAddress" name="physicalAddress" aria-describedby="physicalAddressHelp" />
                            <div id="physicalAddressHelp" className="form-text">What is your rooms physical address?</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">Image</label>
                            <input type="text" className="form-control" id="image" name="image" aria-describedby="imageHelp" />
                            <div id="imageHelp" className="form-text">Images must be a URL, otherwise the Smart Contract becomes too expensive.</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="price" className="form-label">Price in Wei</label>
                            <input type="number" className="form-control" id="price" name="price" aria-describedby="priceHelp" />
                            <div id="priceHelp" className="form-text">What is the price for your room? Values must be in Wei!</div>
                        </div>
                        <div className="mb-3 form-check">
                            <input type="checkbox" className="form-check-input" id="canReserve" />
                            <label className="form-check-label" htmlFor="canReserve">Can the room be reserved currently?</label>
                        </div>
                    </div>
                )
            }
            modalId="addRoomModal"
            onPos={() => { console.log("Yes!"); }}
            posButtonTitle="Add"
        />
    );
}