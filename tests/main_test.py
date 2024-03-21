import pytest

from brownie import RoomReservations, accounts, web3


@pytest.fixture
def rr():
    return RoomReservations.deploy({'from': accounts[0], 'gas_limit': 6500000})


def add_room(rr, secret_key, can_reserve=True, owner=None):
    f = owner
    if owner == None:
        f = accounts[0]
    rr.addRoom(
        "Room Test", 
        "1212 Street, City, State, Country", 
        "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187.jpg?w=1272&h=848", 
        web3.toWei(10, 'ether'),
        can_reserve,
        f,
        secret_key
    )


def test_add_key(rr):
    rr.setSecretKey(accounts[0], "Key")
    
    with pytest.raises(Exception):
        add_room(rr, "Wrong Key")
    add_room(rr, "Key")
    assert rr.getRoomsLength() == 2, "Rooms length is not 2"

    rr.makeReservation(
        1,
        0,
        1000000,
        False,
        accounts[1]
    )
    with pytest.raises(Exception):
        rr.deleteReservation(1, 1, accounts[0], "Wrong Key")
    rr.deleteReservation(1, 1, accounts[0], "Key")
    assert rr.getReservationsForLength(1) == 0, "Reservations length is not 0"

    with pytest.raises(Exception):
        rr.updateRoomReservationStatus(1, False, accounts[0], "Wrong Key")
    rr.updateRoomReservationStatus(1, False, accounts[0], "Key")
    assert rr.rooms(1)[6] == False, "Room Reservation Status not changed"


def test_add_room_increases_list_size(rr):
    # before room size
    before = rr.getRoomsLength()

    rr.setSecretKey(accounts[0], "Key")
    # Add room
    add_room(rr, "Key")

    after = rr.getRoomsLength()

    assert after == before + 1, "The length should have increased by 1"


def test_room_correct_id(rr):
    rr.rooms(0)
    rr.setSecretKey(accounts[0], "Key")
    add_room(rr, "Key")

    assert rr.rooms(1)[2] == 1, "The ID does not match"


def test_add_room_has_correct_owner(rr):
    owner = accounts[1]
    rr.setSecretKey(owner, "Key")
    add_room(rr, "Key", owner=owner)

    # Get owner of room
    rooms_owner = rr.rooms(rr.getRoomsLength() - 1)[5]

    assert owner == rooms_owner, "It must be the same owner as the one who uploaded room."


def test_make_reservation_success(rr):
    count = rr.getReservationsLength()
    rr.setSecretKey(accounts[0], "Key")
    
    add_room(rr, "Key")
    add_room(rr, "Key")
    
    rr.makeReservation(1, 0, 86500, False, accounts[1])
    rr.makeReservation(2, 0, 86500, True, accounts[1])
    rr.makeReservation(1, 11, 86500, False, accounts[1])
    assert rr.getReservationsLength() == count + 3, "Reservation count does not match."


def test_reservation_correct_id(rr):
    rr.setSecretKey(accounts[0], "Key")
    add_room(rr, "Key")
    rr.makeReservation(1, 0, 86400, True, accounts[1])

    assert rr.reservations(1)[1] == 1, "Reservation ID does not match"


def test_make_reservation_fail(rr):
    rr.setSecretKey(accounts[0], "Key")

    add_room(rr, "Key")
    add_room(rr, "Key", can_reserve=False)
    rr.makeReservation(1, 0, 86500, False, accounts[1])
    with pytest.raises(Exception):
        rr.makeReservation(1, 0, 86500, True, accounts[1])
    with pytest.raises(Exception):
        rr.makeReservation(129, 0, 86500, False, accounts[1])
    with pytest.raises(Exception):
        rr.makeReservation(2, 0, 86500, False, accounts[1])


def test_make_payment_success(rr):
    rr.setSecretKey(accounts[0], "Key")
    add_room(rr, "Key")
    before_balance = accounts[1].balance()
    rr.makeReservation(1, 0, 86500, False, accounts[1])
    rr.makePayment(1, {'value': web3.toWei('10', 'ether'), 'from': accounts[1]})

    assert accounts[1].balance() + web3.toWei('10', 'ether') == before_balance, "Balance does not match"
    assert rr.reservations(1)[4] == True, "Reservation is not paid"


def test_make_payment_fail(rr):
    rr.setSecretKey(accounts[0], "Key")
    add_room(rr, "Key")
    rr.makeReservation(1, 0, 86500, False, accounts[1])

    with pytest.raises(Exception):
        rr.makePayment(1, {'value': 100})
    
    with pytest.raises(Exception):
        rr.makePayment(10, {'value': 1200})


def test_delete_reservation(rr):
    rr.setSecretKey(accounts[0], "Key")
    add_room(rr, "Key")

    rr.makeReservation(1, 0, 86500, False, accounts[1])
    rr.makeReservation(1, 11, 86500, False, accounts[1])
    assert rr.getReservationsLength() == 3, "Reservations length is not 3"
    assert rr.getReservationsForLength(1) == 2, "Reservations For Length is not 2"
    rr.deleteReservation(1, 1, accounts[0], "Key")
    assert rr.getReservationsForLength(1) == 1, "Reservations length is not 1"


def test_delete_reservation_fail(rr):
    rr.setSecretKey(accounts[0], "Key")
    add_room(rr, "Key")

    rr.makeReservation(1, 0, 86500, False, accounts[1])
    with pytest.raises(Exception):
        rr.deleteReservation(1, 1, accounts[2])
        rr.deleteReservation(1, 1, accounts[1])
    rr.deleteReservation(1, 1, accounts[0], "Key")
    add_room(rr, "Key")
    rr.makeReservation(2, 0, 86500, False, accounts[1])
    rr.deleteReservation(2, 1, accounts[0], "Key")

    rr.makeReservation(1, 0, 86500, True, accounts[1])
