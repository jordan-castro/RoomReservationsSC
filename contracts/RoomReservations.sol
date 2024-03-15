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
        string physicalAddress; // The physical address
        uint256 id; // The id of the room
        string image; // A image of the room
        uint256 price; // The price for the room
        address owner; // The rooms owner i.e. the address that uploaded the room.
        bool canReserve; // Is the room available for reservations?
    }
    struct Reservation {
        address reserver; // The one who has the reservation
        uint256 roomId; // The id of the room
        uint256 startDate; // What day does the reservation start
        uint256 endDate; // What day does the reservation end
        bool isPaid; // Is the reservation paid?
    }
    struct Payment {
        address payer; // The address paying for the reservation
        address payee; // The address being payed for the reservation
        uint256 datePaid; // The date the payment went through
        uint256 reservationId; // The id of the reservation the payment is for
    }

    // A mapping to track room reservations
    mapping(uint256 => uint256[]) private reservationsFor;

    // A list of all reservations (previous, current, future)
    Reservation[] private reservations;
    // A list of all rooms
    Room[] private rooms;
    // A list of all payments
    Payment[] private payments;

    // Make sure any ether sent will be kept by contract
    fallback() external payable {}
    receive() external payable {}

    /**
        @dev Verify the room exists and is not out of bounds
     */
    modifier roomExists(uint256 roomId) {
        require(
            roomId >= 0 && roomId < rooms.length,
            "RoomReservations: roomId out of bounds."
        );
        _;
    }

    /**
        @dev Verify the reservation exists and is not out of bounds
     */
    modifier reservationExists(uint256 reservationId) {
        require(
            reservationId >= 0 && reservationId < reservations.length,
            "RoomReservations: reservationId out of bounds."
        );
        _;
    }

    /**
        @dev add a new room from data to list and set map id. 
        The amount of wei is determined by the compiler
        @notice This is to add a new room.
     */
    function addRoom(
        string memory _title,
        string memory _physicalAddress,
        string memory _image,
        uint256 _price,
        bool _canReserve
    ) public {
        // Make a new room
        Room memory newRoom = Room(
            _title,
            _physicalAddress,
            rooms.length - 1,
            _image,
            _price,
            _msgSender(),
            _canReserve
        );

        // Add room to list
        rooms.push(newRoom);
    }

    /**
        @dev Add new reservation to list. 
        The amount of wei is determined by the compiler. 
        Checks that room id exists.
        @notice This is to make a new reservation.
        The room is reserved by whoever made the call.
     */
    function makeReservation(
        uint256 roomId,
        uint256 startDate,
        uint256 endDate,
        bool checkReserved // If false, it assumes you know that the dates are not currently already reserved.
    ) public roomExists(roomId) {
        // Check if the room can be reserved
        require(
            rooms[roomId].canReserve,
            "RoomReservations: This room is not available."
        );
        // Only check if defined in the call.
        if (checkReserved) {
            Reservation memory r;
            // Check room is not currently reserved
            for (uint256 i = 0; i < reservationsFor[roomId].length; i++) {
                r = reservations[reservationsFor[roomId][i]];
                require(
                    startDate > r.endDate || endDate < r.startDate,
                    "RoomReservations: This room is already reserved during this date."
                );
            }
            // Drop r from memory
            delete r;
        }

        // Make a reservation
        Reservation memory newReservation = Reservation(
            _msgSender(),
            roomId,
            startDate,
            endDate,
            false
        );
        // Add to list
        reservations.push(newReservation);
        // Add reservation to room
        reservationsFor[roomId].push(reservations.length - 1);
    }

    /**
        @dev Adds new payment to list.
        And sets wei or ether on contract.
        @notice This handles payments.
        Lodges a new payment into our smart contract data.
        In order to receive payment you must use the withdraw() function.
        @return bool 
    */
    function makePayment(
        uint256 reservationId
    ) public payable reservationExists(reservationId) returns (bool) {
        // Check payment amout matches reservation
        require(
            rooms[reservations[reservationId].roomId].price == msg.value,
            "RoomReservations: msg.value does not match the room price."
        );

        // Make payment
        address payable payAdd = payable(owner());
        (bool success, ) = payAdd.call{value: msg.value}("");

        // If not successful return false
        if (!success) {
            return false;
        }

        // Add payment
        Payment memory newPayment = Payment(
            _msgSender(),
            owner(),
            block.timestamp, // Right now
            reservationId
        );
        payments.push(newPayment);

        // Update .isPaid on reservation
        reservations[reservationId].isPaid = true;

        return true;
    }

    /**
        @dev Remove reservation from room.
        @notice Delete a reservation.
        Is based off the rooms ID.
    */
    function deleteReservation(
        uint256 roomId,
        uint256 reservationId
    ) public roomExists(roomId) reservationExists(reservationId) {
        // Check the address calling this method is either
        // A. the owner of the room
        // B. the reserver of the reservation
        Room memory room = rooms[roomId];
        Reservation memory reservation = reservations[reservationId];

        require(
            _msgSender() == room.owner || _msgSender() == reservation.reserver,
            "RoomReservations: only the rooms owner or the reservations owner can delete this reservation."
        );
    }

    /**
        @dev Set canReserve = status on room
        @notice Update the room reservation status.
    */
    function updateRoomReservationStatus(
        uint256 roomId,
        bool status
    ) public roomExists(roomId) {
        Room memory room = rooms[roomId];
        // Check only the rooms owner is calling this method
        require(
            _msgSender() == room.owner,
            "RoomReservations: only the rooms owner can update reservation status."
        );
        // Make sure that canReserve does not already equal status
        // This saves you GAS fees.
        require(
            room.canReserve != status,
            "RoomReservations: Can not set canReserve = to same status."
        );

        // Update can reserve status
        rooms[roomId].canReserve = status;
    }
}
