// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.20;

import "./AccessControl.sol";

/**
    @title RoomReservations
    @author Jordan Castro
    @notice Smart Contract for creating, reserving, and paying for rooms on the Polygon Blockchain.
*/
contract RoomReservations is AccessControl {
    struct Room {
        string title; // A custom title for the room
        string physicaAddress; // The physical address
        uint256 id; // The id of the room
        string image; // A image of the room
        uint256 price; // The price for the room
    }
    struct Reservation {
        address reserver; // The one who has the reservation
        uint256 roomId; // The id of the room
        uint256 startDate; // What day does the reservation start
        uint256 endDate; // What day does the reservation end
    }

    // A map for id to room
    mapping(uint256 => Room) private idToRoom;

    // A list of current reservations, in no particular order
    Reservation[] private currentReservations;
    // A list of all rooms, in no particular order
    Room[] private rooms;

    // Empty constructor
    constructor() {}

    function addRoom() public onlyOwner returns (bool) {
        rooms
    }
}