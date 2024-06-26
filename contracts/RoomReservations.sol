// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.20;

import "./Ownable.sol";

/**
    @title RoomReservations
    @author Jordan Castro
    @notice Smart Contract for creating, reserving, and paying for rooms on the Polygon Blockchain.
*/
contract RoomReservations is Ownable {
    struct Property {
        string name;
        string logo;
        string typeOf;
        string physicalAddress; // The real world address of the property.
        address owner; // The owner of the property.
        string contactEmail;
        string contactPhone;
    }
    struct Room {
        uint256 propertyId; // The id linking back to its property.
        string title; // A custom title for the room
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
        bool wasDeleted; // Has this reservation been deleted?
    }
    struct Payment {
        address payer; // The address paying for the reservation
        address payee; // The address being payed for the reservation
        uint256 datePaid; // The date the payment went through
        uint256 reservationId; // The id of the reservation the payment is for
    }

    // A mapping to track room reservations
    mapping(uint256 => uint256[]) public reservationsFor;

    // A mapping to track keys to addresses, only addresses with keys can interact
    mapping(string => address) private secretKeys;

    // A mapping of all rooms a property contains
    mapping(uint256 => uint256[]) public roomsOfProperty;

    // A list of all properties
    Property[] public properties;
    // A list of all reservations (previous, current, future)
    Reservation[] public reservations;
    // A list of all rooms
    Room[] public rooms;
    // A list of all payments
    Payment[] public payments;

    constructor() {
        properties.push(Property("Property Zero", "", "", "", address(this), "", ""));
        rooms.push(Room(0, "Room Zero", 0, "", 0, address(this), false));
        reservations.push(Reservation(address(this), 0, 0, 0, true, false));
        payments.push(Payment(address(this), address(this), 0, 0));
    }

    // Make sure any ether sent will be kept by contract
    fallback() external payable {}
    receive() external payable {}

    /**
        @dev Verify the property exists and not out of bounds.
    */
    modifier propertyExists(uint256 propertyId) {
        require (
            propertyId >= 0 && propertyId < properties.length,
            "RoomReservations: propertyId out of bounds."
        );
        _;
    }

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
        @dev Verify the key is valid for said address.
    */
    modifier keyIsValid(string memory key, address whom) {
        require(
            secretKeys[key] == whom,
            "RoomReservations: Address does not have secret key."
        );
        _;
    }

    modifier isPropertyOwner(uint256 propertyId, address whom) {
        require(
            properties[propertyId].owner == whom,
            "RoomReservations: Address is not owner"
        );
        _;
    }

    /**
        @dev add a new property to the list.
    */
    function addProperty(
        string memory name,
        string memory logo,
        string memory typeOf,
        string memory _physicalAddress, 
        address ownerOfProperty, 
        string memory contactEmail,
        string memory contactPhone,
        string memory key
    ) public onlyOwner keyIsValid(key, ownerOfProperty) {
        Property memory property = Property(
            name,
            logo,
            typeOf,
            _physicalAddress,
            ownerOfProperty,
            contactEmail,
            contactPhone
        );

        properties.push(property);
    }

    /**
        @dev add a new room from data to list and set map id. 
        The amount of wei is determined by the compiler
        @notice This is to add a new room.
     */
    function addRoom(
        uint256 propertyId,
        string memory _title,
        string memory _image,
        uint256 _price,
        bool _canReserve,
        address roomOwner, // Because our server acts as a broker of sorts
        string memory key
    ) public onlyOwner keyIsValid(key, roomOwner) propertyExists(propertyId) {
        // Make a new room
        Room memory newRoom = Room(
            propertyId,
            _title,
            rooms.length, // No - 1 because the room has not been added yet.
            _image,
            _price,
            roomOwner,
            _canReserve
        );

        // Add room to list
        rooms.push(newRoom);

        // Push to properties.
        roomsOfProperty[propertyId].push(rooms.length - 1);
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
        bool checkReserved, // If false, it assumes you know that the dates are not currently already reserved.
        address reserver // Because our server acts as a broker of sorts.
    ) public onlyOwner roomExists(roomId) {
        // Check if the room can be reserved
        require(
            rooms[roomId].canReserve,
            "RoomReservations: This room is not available."
        );
        // Check endDate is greater than startDate by atleast 1 day
        require(
            endDate >= startDate + 1 days,
            "RoomReservations: The minimum time in a room is 1 day."
        );
        // Only check if defined in the call.
        if (checkReserved) {
            // For GAS efficiency, keep lookup local
            uint256[] memory roomReservations = reservationsFor[roomId];
            uint256 roomReservationsLength = roomReservations.length;
            Reservation memory r;
            // Check room is not currently reserved
            for (uint256 i = 0; i < roomReservationsLength; i++) {
                r = reservations[roomReservations[i]];
                require(
                    startDate > r.endDate || endDate < r.startDate,
                    "RoomReservations: This room is already reserved during this date"
                );
            }
            // Drop r from memory
            delete r;
        }

        // Make a reservation
        Reservation memory newReservation = Reservation(
            reserver,
            roomId,
            startDate,
            endDate,
            false,
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
    */
    function makePayment(
        uint256 reservationId
    ) public payable reservationExists(reservationId) {
        // Check reservation was not deleted
        require(
            !reservations[reservationId].wasDeleted,
            "RoomReservations: Reservation was deleted."
        );
        // Check payment amout matches reservation
        require(
            rooms[reservations[reservationId].roomId].price == msg.value,
            "RoomReservations: msg.value does not match the room price."
        );

        Reservation storage reservation = reservations[reservationId];
        // Check that reservation is not paid
        require(
            !reservation.isPaid,
            "RoomReservations: Reservation is already paid"
        );

        // Calculate fees
        uint256 propertyFee = (msg.value * 95) / 100;
        uint256 contractFee = msg.value - propertyFee;

        // Owner address
        address payable roomOwner = payable(rooms[reservation.roomId].owner);

        // Make payments
        roomOwner.transfer(propertyFee);
        payable(owner()).transfer(contractFee);

        // Add payment
        Payment memory newPayment = Payment(
            _msgSender(),
            roomOwner,
            block.timestamp, // Right now
            reservationId
        );
        payments.push(newPayment);

        // Update .isPaid on reservation
        reservation.isPaid = true;
    }

    /**
        @dev Remove reservation from room.
        @notice Delete a reservation.
        Is based off the rooms ID.
    */
    function deleteReservation(
        uint256 roomId,
        uint256 reservationId,
        address deleter, // Because our server acts as a broker of sorts
        string memory key
    )
        public
        onlyOwner
        keyIsValid(key, deleter)
        roomExists(roomId)
        reservationExists(reservationId)
    {
        // Check the address calling this method is either
        // A. the owner of the room
        // B. the reserver of the reservation
        require(
            deleter == rooms[roomId].owner,
            // ||
            //     deleter == reservations[reservationId].reserver,
            "RoomReservations: only the rooms owner can delete this reservation."
        );

        // Avoid multiple lookups
        uint256[] storage reservationsInRoom = reservationsFor[roomId];
        reservations[reservationId].wasDeleted = true;

        for (uint256 i = 0; i < reservationsInRoom.length; i++) {
            // Once found, remove value
            if (reservationsInRoom[i] == reservationId) {
                reservationsInRoom[i] = reservationsInRoom[
                    reservationsInRoom.length - 1
                ];
                reservationsInRoom.pop();
                break;
            }
        }
    }

    /**
        @dev Set canReserve = status on room
        @notice Update the room reservation status.
    */
    function updateRoomReservationStatus(
        uint256 roomId,
        bool status,
        address from, // Because our server acts as a broker of sorts
        string memory key
    ) public onlyOwner keyIsValid(key, from) roomExists(roomId) {
        Room storage room = rooms[roomId];
        // Check only the rooms owner is calling this method
        require(
            from == room.owner,
            "RoomReservations: only the rooms owner can update reservation status."
        );
        // Make sure that canReserve does not already equal status
        // This saves you GAS fees.
        require(
            room.canReserve != status,
            "RoomReservations: Can not set canReserve = to same status."
        );

        // Update can reserve status
        room.canReserve = status;
    }

    /**
        @dev Remove a room from the property.
    */
    function removeRoomFromProperty(
        uint256 propertyId, 
        uint256 roomId, 
        address from, 
        string memory key
    ) public onlyOwner keyIsValid(key, from) propertyExists(propertyId) roomExists(roomId) {
        require(
            properties[propertyId].owner == from,
            "RoomReservations: Owner is not the same"
        );

        // Avoid multiple lookups
        uint256[] storage roomsInProperty = roomsOfProperty[propertyId];

        for (uint256 i = 0; i < roomsInProperty.length; i++) {
            // Once found, remove value
            if (roomsInProperty[i] == roomId) {
                roomsInProperty[i] = roomsInProperty[
                    roomsInProperty.length - 1
                ];
                roomsInProperty.pop();
                break;
            }
        }
    }

    /**
        @dev add a room to a property.
     */
    function addRoomToProperty(
        uint256 propertyId, 
        uint256 roomId, 
        address from, 
        string memory key
    ) public onlyOwner keyIsValid(key, from) propertyExists(propertyId) roomExists(roomId) {
        // very from is owner of both property and room
        require(
            properties[propertyId].owner == from && rooms[roomId].owner == from,
            "RoomReservations: Address must be owner"
        );

        // Check if room is already existsing 
        uint256[] storage roomsInProperty = roomsOfProperty[propertyId];
        for (uint256 i = 0; i < roomsInProperty.length; i++) {
            if (roomsInProperty[i] == roomId) {
                // Already exists, finish the function.
                return;
            }
        }

        roomsInProperty.push(roomId);
    }

    /**
        @dev Sets key to address not address to key in mapping.
        @notice Give access to a certain address based on a key.
        Only one key per address.
    */
    function setSecretKey(address whom, string memory key) public onlyOwner {
        // Can not set to 0 address
        require(whom != address(0), "RoomReservations: Address is not valid.");
        // Can not set key to new user.
        require(
            secretKeys[key] == address(0),
            "RoomReservations: Key already exists."
        );

        // Do it
        secretKeys[key] = whom;
    }

    /**
        @dev sets secretKeys[key] = address(0).
        @notice Removes a address secret key rights.
    */
    function removeSecretKey(string memory key) public onlyOwner {
        require(
            secretKeys[key] != address(0),
            "RoomReservations: Key is already removed."
        );

        secretKeys[key] = address(0);
    }

    /* Getters */
    function getRoomsLength() public view returns (uint256) {
        return rooms.length;
    }

    function getReservationsLength() public view returns (uint256) {
        return reservations.length;
    }

    function getPaymentsLength() public view returns (uint256) {
        return payments.length;
    }

    function getReservationsForLength(
        uint256 roomId
    ) public view roomExists(roomId) returns (uint256) {
        return reservationsFor[roomId].length;
    }

    function getReservationsFor(
        uint256 roomId
    ) public view roomExists(roomId) returns (uint256[] memory) {
        return reservationsFor[roomId];
    }

    function getRooms() public view returns (Room[] memory) {
        return rooms;
    }

    function getReservations() public view returns (Reservation[] memory) {
        return reservations;
    }

    function getPayments() public view returns (Payment[] memory) {
        return payments;
    }

    function getRoomsOfPropertyLength(uint256 propertyId) public view propertyExists(propertyId) returns (uint256) {
        return roomsOfProperty[propertyId].length;
    }

    function getRoomsOfProperty(uint256 propertyId) public view propertyExists(propertyId) returns (uint256[] memory) {
        return roomsOfProperty[propertyId];
    }

    function getProperties() public view returns (Property[] memory) {
        return properties;
    }

    function getPropertiesLength() public view returns (uint256) {
        return properties.length;
    }

    // Setters

    /**
        @dev edit the property data.
     */
    function editPropertyData(
        uint256 propertyId, 
        string memory name,
        string memory logo,
        string memory typeOf,
        string memory contactEmail,
        string memory contactPhone,
        address from, 
        string memory key
    ) public onlyOwner keyIsValid(key, from) propertyExists(propertyId) isPropertyOwner(propertyId, from) {
        Property storage property = properties[propertyId];

        if (bytes(name).length > 0) {
            property.name = name;
        }
        if (bytes(logo).length > 0) {
            property.logo = logo;
        }
        if (bytes(typeOf).length > 0) {
            property.typeOf = typeOf;
        }
        if (bytes(contactEmail).length > 0) {
            property.contactEmail = contactEmail;
        }
        if (bytes(contactPhone).length > 0) {
            property.contactPhone = contactPhone;
        }
    }
}
