import pytest

from brownie import RoomReservations, accounts, web3


@pytest.fixture
def rr():
    return RoomReservations.deploy({'from': accounts[0], 'gas_limit': 6500000})


def add_room(rr, d={}, can_reserve=True):
    rr.addRoom(
        "Room Test", 
        "1212 Street, City, State, Country", 
        "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187.jpg?w=1272&h=848", 
        web3.toWei(10, 'ether'),
        can_reserve,
        d
    )


def test_add_room_increases_list_size(rr):
    # before room size
    before = rr.getRoomsLength()
    # Add room
    add_room(rr)
    # rr.addRoom(
    #     "Room Test", 
    #     "1212 Street, City, State, Country", 
    #     "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187.jpg?w=1272&h=848", 
    #     web3.toWei(10, 'ether'),
    #     True
    # )

    after = rr.getRoomsLength()

    assert after == before + 1, "The length should have increased by 1"


def test_add_room_has_correct_owner(rr):
    owner = accounts[1]
    add_room(rr, {'from': owner})
    # rr.addRoom(
    #     "Room test 2",
    #     "other address",
    #     "other image",
    #     web3.toWei(10, 'ether'),
    #     True,
    #     {
    #         "from": owner
    #     }
    # )

    # Get owner of room
    rooms_owner = rr.rooms(rr.getRoomsLength() - 1)[5]

    assert owner == rooms_owner, "It must be the same owner as the one who uploaded room."


def test_make_reservation_success(rr):
    count = rr.getReservationsLength()
    
    add_room(rr)
    add_room(rr)
    
    rr.makeReservation(1, 0, 86500, False)
    rr.makeReservation(2, 0, 86500, True)
    rr.makeReservation(1, 11, 86500, False)
    assert rr.getReservationsLength() == count + 3, "Reservation count does not match."


def test_make_reservation_fail(rr):
    add_room(rr)
    add_room(rr, can_reserve=False)
    rr.makeReservation(1, 0, 86500, False)
    with pytest.raises(Exception):
        rr.makeReservation(1, 0, 86500, True)
    with pytest.raises(Exception):
        rr.makeReservation(129, 0, 86500, False)
    with pytest.raises(Exception):
        rr.makeReservation(2, 0, 86500, False)


def test_make_payment_success(rr):
    add_room(rr)
    before_balance = accounts[0].balance()
    rr.makeReservation(1, 0, 86500, False)
    rr.makePayment(1, {'value': web3.toWei('10', 'ether'),})

    assert accounts[0].balance() + web3.toWei('10', 'ether') == before_balance, "Balance does not match"
    assert rr.reservations(1)[4] == True, "Reservation is not paid"


def test_make_payment_fail(rr):
    add_room(rr)
    rr.makeReservation(1, 0, 86500, False)

    with pytest.raises(Exception):
        rr.makePayment(1, {'value': 100})
    
    with pytest.raises(Exception):
        rr.makePayment(10, {'value': 1200})


def test_delete_reservation(rr):
    add_room(rr)
    rr.makeReservation(1, 0, 86500, False)
    rr.makeReservation(1, 11, 86500, False)
    assert rr.getReservationsLength() == 3, "Reservations length is not 3"
    rr.deleteReservation(1, 1, {'from': accounts[0]})
    assert rr.getReservationsLength() == 2, "Reservations length it not 2"


def test_delete_reservation_fail(rr):
    add_room(rr)
    rr.makeReservation(1, 0, 86500, False, {'from': accounts[1]})
    with pytest.raises(Exception):
        rr.deleteReservation(1, 1, {'from': accounts[2]})
    rr.deleteReservation(1, 1, {'from': accounts[1]})
    add_room(rr)
    rr.makeReservation(2, 0, 86500, False, {'from': accounts[1]})
    rr.deleteReservation(2, 1, {'from': accounts[0]})

    rr.makeReservation(1, 0, 86500, True)
