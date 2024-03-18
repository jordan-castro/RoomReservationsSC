import pytest

from brownie import RoomReservations, accounts, web3


@pytest.fixture
def rr():
    return RoomReservations.deploy({'from': accounts[0], 'gas_limit': 6500000})


def add_room(rr, can_reserve=True, owner=None):
    f = owner
    if owner == None:
        f = accounts[0]
    rr.addRoom(
        "Room Test", 
        "1212 Street, City, State, Country", 
        "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187.jpg?w=1272&h=848", 
        web3.toWei(10, 'ether'),
        can_reserve,
        f
    )


def test_add_room_increases_list_size(rr):
    # before room size
    before = rr.getRoomsLength()
    # Add room
    add_room(rr)

    after = rr.getRoomsLength()

    assert after == before + 1, "The length should have increased by 1"


def test_room_correct_id(rr):
    rr.rooms(0)
    add_room(rr)

    assert rr.rooms(1)[2] == 1, "The ID does not match"


def test_add_room_has_correct_owner(rr):
    owner = accounts[1]
    add_room(rr, owner=owner)

    # Get owner of room
    rooms_owner = rr.rooms(rr.getRoomsLength() - 1)[5]

    assert owner == rooms_owner, "It must be the same owner as the one who uploaded room."


def test_make_reservation_success(rr):
    count = rr.getReservationsLength()
    
    add_room(rr)
    add_room(rr)
    
    rr.makeReservation(1, 0, 86500, False, accounts[1])
    rr.makeReservation(2, 0, 86500, True, accounts[1])
    rr.makeReservation(1, 11, 86500, False, accounts[1])
    assert rr.getReservationsLength() == count + 3, "Reservation count does not match."


def test_reservation_correct_id(rr):
    add_room(rr)
    rr.makeReservation(1, 0, 86400, True, accounts[1])

    assert rr.reservations(1)[1] == 1, "Reservation ID does not match"


def test_make_reservation_fail(rr):
    add_room(rr)
    add_room(rr, can_reserve=False)
    rr.makeReservation(1, 0, 86500, False, accounts[1])
    with pytest.raises(Exception):
        rr.makeReservation(1, 0, 86500, True, accounts[1])
    with pytest.raises(Exception):
        rr.makeReservation(129, 0, 86500, False, accounts[1])
    with pytest.raises(Exception):
        rr.makeReservation(2, 0, 86500, False, accounts[1])


def test_make_payment_success(rr):
    add_room(rr)
    before_balance = accounts[1].balance()
    rr.makeReservation(1, 0, 86500, False, accounts[1])
    rr.makePayment(1, {'value': web3.toWei('10', 'ether'), 'from': accounts[1]})

    assert accounts[1].balance() + web3.toWei('10', 'ether') == before_balance, "Balance does not match"
    assert rr.reservations(1)[4] == True, "Reservation is not paid"


def test_make_payment_fail(rr):
    add_room(rr)
    rr.makeReservation(1, 0, 86500, False, accounts[1])

    with pytest.raises(Exception):
        rr.makePayment(1, {'value': 100})
    
    with pytest.raises(Exception):
        rr.makePayment(10, {'value': 1200})


def test_delete_reservation(rr):
    add_room(rr)
    rr.makeReservation(1, 0, 86500, False, accounts[1])
    rr.makeReservation(1, 11, 86500, False, accounts[1])
    assert rr.getReservationsLength() == 3, "Reservations length is not 3"
    assert rr.getReservationsForLength(1) == 2, "Reservations For Length is not 2"
    rr.deleteReservation(1, 1, accounts[1])
    assert rr.getReservationsForLength(1) == 1, "Reservations length is not 1"


def test_delete_reservation_fail(rr):
    add_room(rr)
    rr.makeReservation(1, 0, 86500, False, accounts[1])
    with pytest.raises(Exception):
        rr.deleteReservation(1, 1, accounts[2])
    rr.deleteReservation(1, 1, accounts[1])
    add_room(rr)
    rr.makeReservation(2, 0, 86500, False, accounts[1])
    rr.deleteReservation(2, 1, accounts[0])

    rr.makeReservation(1, 0, 86500, True, accounts[1])
